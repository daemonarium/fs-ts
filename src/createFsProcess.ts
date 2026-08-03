import {
  CodecRegistry,
  registerDynamicCodecs,
  SocketRpcServer,
  TypeDescription,
  TypeKind,
  type TypeRegistry,
  type SocketOptions,
} from '@wa-os/ts-rpc'
import { Kernel, LocalProcess, Direction } from '@wa-os/ts-kernel'
import { createGeneratedTypeRegistry } from './fsApi.js'
import { FsService } from './FsService.js'

const DEFAULT_SOCKET_OPTIONS: SocketOptions = {
  inputBufferSize: 65536,
  outputBufferSize: 65536,
  flushThreshold: 4096,
  dataEventThreshold: 0,
  drainEventThreshold: 4,
  flags: 0,
}

export interface CreateFsProcessOptions {
  rootDir: string
  processId?: number
  socketId?: number
  manaLimit?: number
  socketOptions?: SocketOptions
}

export interface FsProcessHandle {
  process: LocalProcess
  processId: number
  socketId: number
  service: FsService
  registry: TypeRegistry
  server: SocketRpcServer
}

function ensureRuntimeError(registry: TypeRegistry): void {
  if (registry.getTypeByName('runtime_error')) {
    return
  }
  const stringType = registry.getTypeByName('string')
  if (!stringType) {
    throw new Error('string type missing from FS registry')
  }
  registry.registerType(TypeDescription.create({
    name: 'runtime_error',
    kind: TypeKind.Exception,
    members: [{ name: 'what', type: stringType, annotations: [] }],
  }))
}

export function createFsRpcRegistry(service: FsService): {
  registry: TypeRegistry
  types: { [key: string]: TypeDescription }
} {
  const { registry, types } = createGeneratedTypeRegistry()
  ensureRuntimeError(registry)

  types['fs_mkdir'].implementation = (p: string) => service.mkdir(p)
  types['fs_rmdir'].implementation = (p: string) => service.rmdir(p)
  types['fs_readdir'].implementation = (p: string) => service.readdir(p)
  types['fs_unlink'].implementation = (p: string) => service.unlink(p)
  types['fs_rename'].implementation = (from: string, to: string) => service.rename(from, to)
  types['fs_stat'].implementation = (p: string) => service.stat(p)
  types['fs_exists'].implementation = (p: string) => service.exists(p)
  types['fs_open'].implementation = (p: string, flags: number) => service.open(p, flags)
  types['fs_close'].implementation = (id: number) => service.close(id)
  types['fs_write'].implementation = (id: number, data: Uint8Array) => service.write(id, data)
  types['fs_read'].implementation = (id: number, maxBytes: number) => service.read(id, maxBytes)
  types['fs_seek'].implementation = (
    id: number,
    offset: number | bigint,
    whence: number
  ) => service.seek(id, offset, whence)
  types['fs_sync'].implementation = (id: number) => service.sync(id)

  registry.assignMethodIds()
  return { registry, types }
}

/**
 * Spawn a LocalProcess hosting the FS RPC API on a socket (default 0).
 * Caller binds consumers to that socket; capability = topology.
 */
export function createFsProcess(
  kernel: Kernel,
  options: CreateFsProcessOptions
): FsProcessHandle {
  const processId = options.processId ?? kernel.processes.length
  const socketId = options.socketId ?? 0
  const manaLimit = options.manaLimit ?? 1_000_000
  const socketOptions = options.socketOptions ?? DEFAULT_SOCKET_OPTIONS

  while (kernel.processes.length <= processId) {
    kernel.processes.push(null)
  }
  if (kernel.processes[processId]) {
    throw new Error(`Process slot ${processId} already occupied`)
  }

  const process = new LocalProcess(kernel, processId, manaLimit)
  kernel.processes[processId] = process

  const service = new FsService(options.rootDir)
  const { registry } = createFsRpcRegistry(service)
  const socket = process.createSocket(socketId, socketOptions)
  process.setRpcDescription(socketId, registry)

  const codecs = new CodecRegistry()
  registerDynamicCodecs(codecs, registry)
  const server = new SocketRpcServer(socket, registry, codecs)

  return {
    process,
    processId,
    socketId,
    service,
    registry,
    server,
  }
}

export function bindToFsProcess(
  consumer: LocalProcess,
  consumerSocketId: number,
  fsHandle: FsProcessHandle,
  direction: Direction = Direction.BOTH
): void {
  consumer.bind(fsHandle.process, consumerSocketId, fsHandle.socketId, direction)
}
