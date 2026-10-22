# Example

The host chooses `rootDir`. This snippet uses `./data`. The tests use
a temporary directory the same way.

```ts
import { Kernel, LocalProcess } from '@daemonarium/kernel'
import { CodecRegistry, SocketRpcClient, registerDynamicCodecs } from '@daemonarium/rpc'
import { bindToFsProcess, createFsProcess, open_flag, seek_whence } from '@daemonarium/fs'

const kernel = new Kernel()
const fs = createFsProcess(kernel, { rootDir: './data', processId: 1 })

const client = new LocalProcess(kernel, 2, 1_000_000)
kernel.processes[2] = client
const socket = client.createSocket(0, {
  inputBufferSize: 65536,
  outputBufferSize: 65536,
  flushThreshold: 4096,
  dataEventThreshold: 0,
  drainEventThreshold: 4,
  flags: 0,
})
bindToFsProcess(client, 0, fs)

const codecs = new CodecRegistry()
registerDynamicCodecs(codecs, fs.registry)
const rpc = new SocketRpcClient(socket, fs.registry, codecs)

const id = (name: string) => {
  const method = fs.registry.getMethods().find((m) => m.memberName === `fs.${name}`)
  if (!method) throw new Error(`missing fs.${name}`)
  return method.methodId
}

await rpc.call(id('mkdir'), 'logs')
const flags = open_flag.CREATE | open_flag.WRITE | open_flag.READ | open_flag.TRUNCATE
const fileId = await rpc.call(id('open'), 'logs/a.bin', flags) as number

const payload = new TextEncoder().encode('hello-fs')
await rpc.call(id('write'), fileId, payload)
await rpc.call(id('seek'), fileId, 0n, seek_whence.SET)
const readBack = await rpc.call(id('read'), fileId, 64) as Uint8Array
// readBack decodes to "hello-fs"

await rpc.call(id('close'), fileId)
```

`./data/logs/a.bin` is the file on the host. A process that is not
bound to this socket cannot open it through the kernel.
