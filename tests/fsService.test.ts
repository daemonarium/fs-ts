import { expect } from 'chai'
import os from 'node:os'
import path from 'node:path'
import fsp from 'node:fs/promises'
import {
  CodecRegistry,
  registerDynamicCodecs,
  SocketRpcClient,
  RpcException,
  type SocketOptions,
} from '@wa-os/ts-rpc'
import { Kernel, LocalProcess } from '@wa-os/ts-kernel'
import {
  bindToFsProcess,
  createFsProcess,
  open_flag,
  seek_whence,
} from '../src/index.js'

const SOCKET_OPTS: SocketOptions = {
  inputBufferSize: 65536,
  outputBufferSize: 65536,
  flushThreshold: 4096,
  dataEventThreshold: 0,
  drainEventThreshold: 4,
  flags: 0,
}

async function withTempRoot<T>(fn: (root: string) => Promise<T>): Promise<T> {
  const root = await fsp.mkdtemp(path.join(os.tmpdir(), 'waos-ts-fs-'))
  try {
    return await fn(root)
  } finally {
    await fsp.rm(root, { recursive: true, force: true })
  }
}

async function setupRpc(rootDir: string) {
  const kernel = new Kernel()
  const fsHandle = createFsProcess(kernel, {
    rootDir,
    processId: 1,
    socketId: 0,
    socketOptions: SOCKET_OPTS,
  })

  const clientProc = new LocalProcess(kernel, 2, 1_000_000)
  kernel.processes[2] = clientProc
  const clientSocket = clientProc.createSocket(0, SOCKET_OPTS)
  bindToFsProcess(clientProc, 0, fsHandle)

  const codecs = new CodecRegistry()
  registerDynamicCodecs(codecs, fsHandle.registry)
  const client = new SocketRpcClient(clientSocket, fsHandle.registry, codecs)

  const methods = new Map(
    fsHandle.registry.getMethods().map((m) => [m.memberName, m.methodId])
  )
  const id = (name: string) => {
    const full = name.includes('.') ? name : `fs.${name}`
    const methodId = methods.get(full)
    if (methodId === undefined) {
      throw new Error(`missing method ${full}`)
    }
    return methodId
  }

  return { kernel, fsHandle, client, id }
}

describe('ts-fs FsService over RPC', () => {
  it('rejects path jail escapes', async () => {
    await withTempRoot(async (root) => {
      const { client, id } = await setupRpc(root)
      for (const bad of ['/etc/passwd', '../outside', 'foo/../../etc']) {
        try {
          await client.call(id('exists'), bad)
          expect.fail(`expected invalid path for ${bad}`)
        } catch (error) {
          expect(error).to.be.instanceOf(RpcException)
          expect((error as RpcException).typeName).to.equal('fs_invalid_path')
        }
      }
    })
  })

  it('mkdir, write, read, sync, unlink', async () => {
    await withTempRoot(async (root) => {
      const { client, id } = await setupRpc(root)

      await client.call(id('mkdir'), 'logs')
      const flags = open_flag.CREATE | open_flag.WRITE | open_flag.READ | open_flag.TRUNCATE
      const fileId = await client.call(id('open'), 'logs/a.bin', flags) as number

      const payload = new TextEncoder().encode('hello-fs')
      const written = await client.call(id('write'), fileId, payload) as number
      expect(written).to.equal(payload.length)
      await client.call(id('sync'), fileId)

      await client.call(id('seek'), fileId, 0n, seek_whence.SET)
      const readBack = await client.call(id('read'), fileId, 64) as Uint8Array
      expect(new TextDecoder().decode(readBack)).to.equal('hello-fs')

      await client.call(id('close'), fileId)
      await client.call(id('unlink'), 'logs/a.bin')
      expect(await client.call(id('exists'), 'logs/a.bin')).to.equal(false)
    })
  })

  it('APPEND writes at end', async () => {
    await withTempRoot(async (root) => {
      const { client, id } = await setupRpc(root)
      await client.call(id('mkdir'), 'app')
      const createFlags = open_flag.CREATE | open_flag.WRITE | open_flag.TRUNCATE
      let fileId = await client.call(id('open'), 'app/log.bin', createFlags) as number
      await client.call(id('write'), fileId, new TextEncoder().encode('abc'))
      await client.call(id('close'), fileId)

      const appendFlags = open_flag.CREATE | open_flag.WRITE | open_flag.APPEND | open_flag.READ
      fileId = await client.call(id('open'), 'app/log.bin', appendFlags) as number
      await client.call(id('write'), fileId, new TextEncoder().encode('XYZ'))
      await client.call(id('seek'), fileId, 0n, seek_whence.SET)
      const data = await client.call(id('read'), fileId, 64) as Uint8Array
      expect(new TextDecoder().decode(data)).to.equal('abcXYZ')
      await client.call(id('close'), fileId)
    })
  })

  it('rename for atomic publish', async () => {
    await withTempRoot(async (root) => {
      const { client, id } = await setupRpc(root)
      await client.call(id('mkdir'), 'snap')
      const flags = open_flag.CREATE | open_flag.WRITE | open_flag.TRUNCATE
      const fileId = await client.call(id('open'), 'snap/x.tmp', flags) as number
      await client.call(id('write'), fileId, new Uint8Array([1, 2, 3]))
      await client.call(id('close'), fileId)
      await client.call(id('rename'), 'snap/x.tmp', 'snap/x.bin')
      expect(await client.call(id('exists'), 'snap/x.tmp')).to.equal(false)
      expect(await client.call(id('exists'), 'snap/x.bin')).to.equal(true)
    })
  })

  it('stat / readdir / rmdir', async () => {
    await withTempRoot(async (root) => {
      const { client, id } = await setupRpc(root)
      await client.call(id('mkdir'), 'dir')
      const flags = open_flag.CREATE | open_flag.WRITE | open_flag.TRUNCATE
      const fileId = await client.call(id('open'), 'dir/f.txt', flags) as number
      await client.call(id('write'), fileId, new TextEncoder().encode('xy'))
      await client.call(id('close'), fileId)

      const info = await client.call(id('stat'), 'dir/f.txt') as {
        is_directory: boolean
        size: bigint
      }
      expect(info.is_directory).to.equal(false)
      expect(Number(info.size)).to.equal(2)

      const entries = await client.call(id('readdir'), 'dir') as Array<{ name: string }>
      expect(entries.map((e) => e.name)).to.include('f.txt')

      await client.call(id('unlink'), 'dir/f.txt')
      await client.call(id('rmdir'), 'dir')
      expect(await client.call(id('exists'), 'dir')).to.equal(false)
    })
  })

  it('invalid handle and missing open without CREATE', async () => {
    await withTempRoot(async (root) => {
      const { client, id } = await setupRpc(root)
      try {
        await client.call(id('close'), 999)
        expect.fail('expected invalid handle')
      } catch (error) {
        expect(error).to.be.instanceOf(RpcException)
        expect((error as RpcException).typeName).to.equal('fs_invalid_handle')
      }

      try {
        await client.call(id('open'), 'missing.bin', open_flag.READ)
        expect.fail('expected not found')
      } catch (error) {
        expect(error).to.be.instanceOf(RpcException)
        expect((error as RpcException).typeName).to.equal('fs_not_found')
      }
    })
  })

  it('EOF is empty binary', async () => {
    await withTempRoot(async (root) => {
      const { client, id } = await setupRpc(root)
      const flags = open_flag.CREATE | open_flag.WRITE | open_flag.READ | open_flag.TRUNCATE
      const fileId = await client.call(id('open'), 'empty.bin', flags) as number
      const data = await client.call(id('read'), fileId, 16) as Uint8Array
      expect(data.length).to.equal(0)
      await client.call(id('close'), fileId)
    })
  })
})
