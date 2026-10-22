// Auto-generated TypeScript RPC Server
import { TypeRegistry, TypeDescription, TypeKind } from '@daemonarium/rpc'

// TypeScript type definitions
// type index: 16
export interface rpc_request {
  request_id: bigint
  function_id: bigint
}

// type index: 17
export interface rpc_response {
  request_id: bigint
}

// type index: 18
export interface rpc_error {
  request_id: bigint
}

// type index: 20
export interface read_annotation {}

// type index: 21
export interface member_annotation {}

// type index: 22
export interface fs {
  "fs.mkdir": any
  "fs.rmdir": any
  "fs.readdir": any
  "fs.unlink": any
  "fs.rename": any
  "fs.stat": any
  "fs.exists": any
  "fs.open": any
  "fs.close": any
  "fs.write": any
  "fs.read": any
  "fs.seek": any
  "fs.sync": any
}

// type index: 27
export interface dir_entry {
  name: string
  is_directory: boolean
  size: bigint
}

// type index: 31
export interface file_info {
  is_directory: boolean
  size: bigint
  mtime_ms: bigint
}

// type index: 38
export enum seek_whence {
  SET = 0,
  CUR = 1,
  END = 2
}

// type index: 40
export enum open_flag {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  CREATE = 4,
  TRUNCATE = 8,
  APPEND = 16
}


export function createGeneratedTypeRegistry(): { registry: TypeRegistry, types: { [key: string]: TypeDescription } } {
  const registry = new TypeRegistry()
  const types: { [key: string]: TypeDescription } = {}

  // Declare types (without members/item/key yet)
  // type index: 0
  const void_ = TypeDescription.create({
    name: "void",
    kind: TypeKind.Void,
  })
  types['void_'] = void_

  // type index: 1
  const bool = TypeDescription.create({
    name: "bool",
    kind: TypeKind.Boolean,
  })
  types['bool'] = bool

  // type index: 2
  const uint8 = TypeDescription.create({
    name: "uint8",
    kind: TypeKind.UnsignedInteger8,
  })
  types['uint8'] = uint8

  // type index: 3
  const sint8 = TypeDescription.create({
    name: "sint8",
    kind: TypeKind.SignedInteger8,
  })
  types['sint8'] = sint8

  // type index: 4
  const uint16 = TypeDescription.create({
    name: "uint16",
    kind: TypeKind.UnsignedInteger16,
  })
  types['uint16'] = uint16

  // type index: 5
  const sint16 = TypeDescription.create({
    name: "sint16",
    kind: TypeKind.SignedInteger16,
  })
  types['sint16'] = sint16

  // type index: 6
  const uint32 = TypeDescription.create({
    name: "uint32",
    kind: TypeKind.UnsignedInteger32,
  })
  types['uint32'] = uint32

  // type index: 7
  const sint32 = TypeDescription.create({
    name: "sint32",
    kind: TypeKind.SignedInteger32,
  })
  types['sint32'] = sint32

  // type index: 8
  const uint64 = TypeDescription.create({
    name: "uint64",
    kind: TypeKind.UnsignedInteger64,
  })
  types['uint64'] = uint64

  // type index: 9
  const sint64 = TypeDescription.create({
    name: "sint64",
    kind: TypeKind.SignedInteger64,
  })
  types['sint64'] = sint64

  // type index: 10
  const float32 = TypeDescription.create({
    name: "float32",
    kind: TypeKind.FloatingPoint32,
  })
  types['float32'] = float32

  // type index: 11
  const float64 = TypeDescription.create({
    name: "float64",
    kind: TypeKind.FloatingPoint64,
  })
  types['float64'] = float64

  // type index: 12
  const string_ = TypeDescription.create({
    name: "string",
    kind: TypeKind.String,
  })
  types['string_'] = string_

  // type index: 13
  const binary = TypeDescription.create({
    name: "binary",
    kind: TypeKind.Binary,
  })
  types['binary'] = binary

  // type index: 14
  const pointer = TypeDescription.create({
    name: "pointer",
    kind: TypeKind.Pointer,
  })
  types['pointer'] = pointer

  // type index: 15
  const map = TypeDescription.create({
    name: "map",
    kind: TypeKind.Map,
  })
  types['map'] = map

  // type index: 16
  const rpc_request = TypeDescription.create({
    name: "rpc_request",
    kind: TypeKind.Message,
  })
  types['rpc_request'] = rpc_request

  // type index: 17
  const rpc_response = TypeDescription.create({
    name: "rpc_response",
    kind: TypeKind.Message,
  })
  types['rpc_response'] = rpc_response

  // type index: 18
  const rpc_error = TypeDescription.create({
    name: "rpc_error",
    kind: TypeKind.Message,
  })
  types['rpc_error'] = rpc_error

  // type index: 19
  const unknown_exception = TypeDescription.create({
    name: "unknown_exception",
    kind: TypeKind.Exception,
  })
  types['unknown_exception'] = unknown_exception

  // type index: 20
  const read_annotation = TypeDescription.create({
    name: "read_annotation",
    kind: TypeKind.DynamicObject,
    bases: [],
  })
  types['read_annotation'] = read_annotation

  // type index: 21
  const member_annotation = TypeDescription.create({
    name: "member_annotation",
    kind: TypeKind.DynamicObject,
  })
  types['member_annotation'] = member_annotation

  // type index: 22
  const fs = TypeDescription.create({
    name: "fs",
    kind: TypeKind.Object,
  })
  types['fs'] = fs

  // type index: 23
  const fs_mkdir = TypeDescription.create({
    name: "fs.mkdir",
    kind: TypeKind.Function,
  })
  types['fs_mkdir'] = fs_mkdir

  // type index: 24
  const fs_rmdir = TypeDescription.create({
    name: "fs.rmdir",
    kind: TypeKind.Function,
  })
  types['fs_rmdir'] = fs_rmdir

  // type index: 25
  const fs_readdir = TypeDescription.create({
    name: "fs.readdir",
    kind: TypeKind.Function,
  })
  types['fs_readdir'] = fs_readdir

  // type index: 26
  const vector_dir_entry_allocator_dir_entry = TypeDescription.create({
    name: "vector<dir_entry, allocator<dir_entry>>",
    kind: TypeKind.Array,
  })
  types['vector_dir_entry_allocator_dir_entry'] = vector_dir_entry_allocator_dir_entry

  // type index: 27
  const dir_entry = TypeDescription.create({
    name: "dir_entry",
    kind: TypeKind.Object,
  })
  types['dir_entry'] = dir_entry

  // type index: 28
  const fs_unlink = TypeDescription.create({
    name: "fs.unlink",
    kind: TypeKind.Function,
  })
  types['fs_unlink'] = fs_unlink

  // type index: 29
  const fs_rename = TypeDescription.create({
    name: "fs.rename",
    kind: TypeKind.Function,
  })
  types['fs_rename'] = fs_rename

  // type index: 30
  const fs_stat = TypeDescription.create({
    name: "fs.stat",
    kind: TypeKind.Function,
  })
  types['fs_stat'] = fs_stat

  // type index: 31
  const file_info = TypeDescription.create({
    name: "file_info",
    kind: TypeKind.Object,
  })
  types['file_info'] = file_info

  // type index: 32
  const fs_exists = TypeDescription.create({
    name: "fs.exists",
    kind: TypeKind.Function,
  })
  types['fs_exists'] = fs_exists

  // type index: 33
  const fs_open = TypeDescription.create({
    name: "fs.open",
    kind: TypeKind.Function,
  })
  types['fs_open'] = fs_open

  // type index: 34
  const fs_close = TypeDescription.create({
    name: "fs.close",
    kind: TypeKind.Function,
  })
  types['fs_close'] = fs_close

  // type index: 35
  const fs_write = TypeDescription.create({
    name: "fs.write",
    kind: TypeKind.Function,
  })
  types['fs_write'] = fs_write

  // type index: 36
  const fs_read = TypeDescription.create({
    name: "fs.read",
    kind: TypeKind.Function,
  })
  types['fs_read'] = fs_read

  // type index: 37
  const fs_seek = TypeDescription.create({
    name: "fs.seek",
    kind: TypeKind.Function,
  })
  types['fs_seek'] = fs_seek

  // type index: 38
  const seek_whence = TypeDescription.create({
    name: "seek_whence",
    kind: TypeKind.Enum,
    enumMembers: [],
  })
  types['seek_whence'] = seek_whence

  // type index: 39
  const fs_sync = TypeDescription.create({
    name: "fs.sync",
    kind: TypeKind.Function,
  })
  types['fs_sync'] = fs_sync

  // type index: 40
  const open_flag = TypeDescription.create({
    name: "open_flag",
    kind: TypeKind.Enum,
    enumMembers: [],
  })
  types['open_flag'] = open_flag

  // type index: 41
  const fs_error = TypeDescription.create({
    name: "fs_error",
    kind: TypeKind.Exception,
  })
  types['fs_error'] = fs_error

  // type index: 42
  const fs_not_found = TypeDescription.create({
    name: "fs_not_found",
    kind: TypeKind.Exception,
  })
  types['fs_not_found'] = fs_not_found

  // type index: 43
  const fs_already_exists = TypeDescription.create({
    name: "fs_already_exists",
    kind: TypeKind.Exception,
  })
  types['fs_already_exists'] = fs_already_exists

  // type index: 44
  const fs_not_a_directory = TypeDescription.create({
    name: "fs_not_a_directory",
    kind: TypeKind.Exception,
  })
  types['fs_not_a_directory'] = fs_not_a_directory

  // type index: 45
  const fs_is_a_directory = TypeDescription.create({
    name: "fs_is_a_directory",
    kind: TypeKind.Exception,
  })
  types['fs_is_a_directory'] = fs_is_a_directory

  // type index: 46
  const fs_invalid_path = TypeDescription.create({
    name: "fs_invalid_path",
    kind: TypeKind.Exception,
  })
  types['fs_invalid_path'] = fs_invalid_path

  // type index: 47
  const fs_invalid_handle = TypeDescription.create({
    name: "fs_invalid_handle",
    kind: TypeKind.Exception,
  })
  types['fs_invalid_handle'] = fs_invalid_handle

  // type index: 48
  const fs_invalid_flag = TypeDescription.create({
    name: "fs_invalid_flag",
    kind: TypeKind.Exception,
  })
  types['fs_invalid_flag'] = fs_invalid_flag

  // type index: 49
  const fs_io_error = TypeDescription.create({
    name: "fs_io_error",
    kind: TypeKind.Exception,
  })
  types['fs_io_error'] = fs_io_error

  // Register all types to preserve indices
  registry.registerType(void_)
  registry.registerType(bool)
  registry.registerType(uint8)
  registry.registerType(sint8)
  registry.registerType(uint16)
  registry.registerType(sint16)
  registry.registerType(uint32)
  registry.registerType(sint32)
  registry.registerType(uint64)
  registry.registerType(sint64)
  registry.registerType(float32)
  registry.registerType(float64)
  registry.registerType(string_)
  registry.registerType(binary)
  registry.registerType(pointer)
  registry.registerType(map)
  registry.registerType(rpc_request)
  registry.registerType(rpc_response)
  registry.registerType(rpc_error)
  registry.registerType(unknown_exception)
  registry.registerType(read_annotation)
  registry.registerType(member_annotation)
  registry.registerType(fs)
  registry.registerType(fs_mkdir)
  registry.registerType(fs_rmdir)
  registry.registerType(fs_readdir)
  registry.registerType(vector_dir_entry_allocator_dir_entry)
  registry.registerType(dir_entry)
  registry.registerType(fs_unlink)
  registry.registerType(fs_rename)
  registry.registerType(fs_stat)
  registry.registerType(file_info)
  registry.registerType(fs_exists)
  registry.registerType(fs_open)
  registry.registerType(fs_close)
  registry.registerType(fs_write)
  registry.registerType(fs_read)
  registry.registerType(fs_seek)
  registry.registerType(seek_whence)
  registry.registerType(fs_sync)
  registry.registerType(open_flag)
  registry.registerType(fs_error)
  registry.registerType(fs_not_found)
  registry.registerType(fs_already_exists)
  registry.registerType(fs_not_a_directory)
  registry.registerType(fs_is_a_directory)
  registry.registerType(fs_invalid_path)
  registry.registerType(fs_invalid_handle)
  registry.registerType(fs_invalid_flag)
  registry.registerType(fs_io_error)

  // Fill enumMembers, bases, item/key
  read_annotation.bases = [
    member_annotation,
  ]

  fs_mkdir.item = void_

  fs_rmdir.item = void_

  fs_readdir.item = vector_dir_entry_allocator_dir_entry

  vector_dir_entry_allocator_dir_entry.item = dir_entry

  fs_unlink.item = void_

  fs_rename.item = void_

  fs_stat.item = file_info

  fs_exists.item = bool

  fs_open.item = uint32

  fs_close.item = void_

  fs_write.item = uint32

  fs_read.item = binary

  fs_seek.item = uint64

  seek_whence.enumMembers = [
    { name: "SET", value: 0 },
    { name: "CUR", value: 1 },
    { name: "END", value: 2 },
  ]

  fs_sync.item = void_

  open_flag.enumMembers = [
    { name: "NONE", value: 0 },
    { name: "READ", value: 1 },
    { name: "WRITE", value: 2 },
    { name: "CREATE", value: 4 },
    { name: "TRUNCATE", value: 8 },
    { name: "APPEND", value: 16 },
  ]

  // Fill members (after all types exist)
  rpc_request.members = [
    {
      name: "request_id",
      type: uint64,
      annotations: [],
    },
    {
      name: "function_id",
      type: uint64,
      annotations: [],
    },
  ]

  rpc_response.members = [
    {
      name: "request_id",
      type: uint64,
      annotations: [],
    },
  ]

  rpc_error.members = [
    {
      name: "request_id",
      type: uint64,
      annotations: [],
    },
  ]

  unknown_exception.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs.members = [
    {
      name: "fs.mkdir",
      type: fs_mkdir,
      annotations: [],
    },
    {
      name: "fs.rmdir",
      type: fs_rmdir,
      annotations: [],
    },
    {
      name: "fs.readdir",
      type: fs_readdir,
      annotations: [],
    },
    {
      name: "fs.unlink",
      type: fs_unlink,
      annotations: [],
    },
    {
      name: "fs.rename",
      type: fs_rename,
      annotations: [],
    },
    {
      name: "fs.stat",
      type: fs_stat,
      annotations: [],
    },
    {
      name: "fs.exists",
      type: fs_exists,
      annotations: [],
    },
    {
      name: "fs.open",
      type: fs_open,
      annotations: [],
    },
    {
      name: "fs.close",
      type: fs_close,
      annotations: [],
    },
    {
      name: "fs.write",
      type: fs_write,
      annotations: [],
    },
    {
      name: "fs.read",
      type: fs_read,
      annotations: [],
    },
    {
      name: "fs.seek",
      type: fs_seek,
      annotations: [],
    },
    {
      name: "fs.sync",
      type: fs_sync,
      annotations: [],
    },
  ]

  fs_mkdir.members = [
    {
      name: "path",
      type: string_,
      annotations: [],
    },
  ]

  fs_rmdir.members = [
    {
      name: "path",
      type: string_,
      annotations: [],
    },
  ]

  fs_readdir.members = [
    {
      name: "path",
      type: string_,
      annotations: [],
    },
  ]

  dir_entry.members = [
    {
      name: "name",
      type: string_,
      annotations: [],
    },
    {
      name: "is_directory",
      type: bool,
      annotations: [],
    },
    {
      name: "size",
      type: uint64,
      annotations: [],
    },
  ]

  fs_unlink.members = [
    {
      name: "path",
      type: string_,
      annotations: [],
    },
  ]

  fs_rename.members = [
    {
      name: "from",
      type: string_,
      annotations: [],
    },
    {
      name: "to",
      type: string_,
      annotations: [],
    },
  ]

  fs_stat.members = [
    {
      name: "path",
      type: string_,
      annotations: [],
    },
  ]

  file_info.members = [
    {
      name: "is_directory",
      type: bool,
      annotations: [],
    },
    {
      name: "size",
      type: uint64,
      annotations: [],
    },
    {
      name: "mtime_ms",
      type: uint64,
      annotations: [],
    },
  ]

  fs_exists.members = [
    {
      name: "path",
      type: string_,
      annotations: [],
    },
  ]

  fs_open.members = [
    {
      name: "path",
      type: string_,
      annotations: [],
    },
    {
      name: "flags",
      type: uint32,
      annotations: [],
    },
  ]

  fs_close.members = [
    {
      name: "id",
      type: uint32,
      annotations: [],
    },
  ]

  fs_write.members = [
    {
      name: "id",
      type: uint32,
      annotations: [],
    },
    {
      name: "data",
      type: binary,
      annotations: [],
    },
  ]

  fs_read.members = [
    {
      name: "id",
      type: uint32,
      annotations: [],
    },
    {
      name: "max_bytes",
      type: uint32,
      annotations: [],
    },
  ]

  fs_seek.members = [
    {
      name: "id",
      type: uint32,
      annotations: [],
    },
    {
      name: "offset",
      type: sint64,
      annotations: [],
    },
    {
      name: "whence",
      type: seek_whence,
      annotations: [],
    },
  ]

  fs_sync.members = [
    {
      name: "id",
      type: uint32,
      annotations: [],
    },
  ]

  fs_error.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_not_found.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_already_exists.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_not_a_directory.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_is_a_directory.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_invalid_path.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_invalid_handle.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_invalid_flag.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  fs_io_error.members = [
    {
      name: "what",
      type: string_,
      annotations: [],
    },
  ]

  return { registry, types }
}

// Empty method implementations
async function fs_mkdir_impl(
  path: string
): Promise<void> {
  /// TODO: implement
  return Promise.resolve()
}

async function fs_rmdir_impl(
  path: string
): Promise<void> {
  /// TODO: implement
  return Promise.resolve()
}

async function fs_readdir_impl(
  path: string
): Promise<dir_entry[]> {
  /// TODO: implement
  return Promise.resolve([])
}

async function fs_unlink_impl(
  path: string
): Promise<void> {
  /// TODO: implement
  return Promise.resolve()
}

async function fs_rename_impl(
  from: string,
  to: string
): Promise<void> {
  /// TODO: implement
  return Promise.resolve()
}

async function fs_stat_impl(
  path: string
): Promise<file_info> {
  /// TODO: implement
  return Promise.resolve(null as any as file_info)
}

async function fs_exists_impl(
  path: string
): Promise<boolean> {
  /// TODO: implement
  return Promise.resolve(false)
}

async function fs_open_impl(
  path: string,
  flags: number
): Promise<number> {
  /// TODO: implement
  return Promise.resolve(0)
}

async function fs_close_impl(
  id: number
): Promise<void> {
  /// TODO: implement
  return Promise.resolve()
}

async function fs_write_impl(
  id: number,
  data: Uint8Array
): Promise<number> {
  /// TODO: implement
  return Promise.resolve(0)
}

async function fs_read_impl(
  id: number,
  max_bytes: number
): Promise<Uint8Array> {
  /// TODO: implement
  return Promise.resolve(null as any as Uint8Array)
}

async function fs_seek_impl(
  id: number,
  offset: bigint,
  whence: seek_whence
): Promise<bigint> {
  /// TODO: implement
  return Promise.resolve(null as any as bigint)
}

async function fs_sync_impl(
  id: number
): Promise<void> {
  /// TODO: implement
  return Promise.resolve()
}

export function implementMethods(result: ReturnType<typeof createGeneratedTypeRegistry>): void {
  const { registry, types } = result
  types['fs_mkdir'].implementation = fs_mkdir_impl
  types['fs_rmdir'].implementation = fs_rmdir_impl
  types['fs_readdir'].implementation = fs_readdir_impl
  types['fs_unlink'].implementation = fs_unlink_impl
  types['fs_rename'].implementation = fs_rename_impl
  types['fs_stat'].implementation = fs_stat_impl
  types['fs_exists'].implementation = fs_exists_impl
  types['fs_open'].implementation = fs_open_impl
  types['fs_close'].implementation = fs_close_impl
  types['fs_write'].implementation = fs_write_impl
  types['fs_read'].implementation = fs_read_impl
  types['fs_seek'].implementation = fs_seek_impl
  types['fs_sync'].implementation = fs_sync_impl
}

export function setupServer(): TypeRegistry {
  const result = createGeneratedTypeRegistry()
  implementMethods(result)
  result.registry.assignMethodIds()
  return result.registry
}

