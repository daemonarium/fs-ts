# Architecture

`src/fsApi.ts` is the checked-in TypeScript of the filesystem RPC in
rpc-cpp `v0.1.0`, `src/examples/structures/fs.hpp`. This repository
does not regenerate it. A guest and this host agree on those names.

`createFsProcess` inserts a `LocalProcess`, builds that registry, and
serves it with `SocketRpcServer`. `bindToFsProcess` connects a
consumer socket to that process with `LocalProcess.bind`. The kernel
does not open files. Capability is the bind.

```
Guest process
    │  RPC on the bound socket
    ▼
FsService LocalProcess
    ▼
rootDir on the host, through node:fs
```

## Path jail

`resolveRelative` rejects:

- an empty path
- a NUL byte
- an absolute path
- any `..` segment, including `foo/../../etc`

What remains is resolved under `rootDir`.

## Semantics

- `mkdir` creates parents.
- `open` with `CREATE` and a missing parent returns `fs_not_found`.
- `write` is all-or-throw. The return value is the input length.
- `read` returns an empty `binary` at EOF.
- `APPEND`: each `write` goes to EOF. `seek` affects later `read`s only.
- `rename` follows POSIX replace rules.

### Flags (`open_flag`)

`READ`, `WRITE`, `CREATE`, `TRUNCATE`, `APPEND`. Combine them with
bitwise or.

### `seek_whence`

`SET`, `CUR`, `END`.

### Exceptions

`fs_error`, `fs_not_found`, `fs_already_exists`, `fs_not_a_directory`,
`fs_is_a_directory`, `fs_invalid_path`, `fs_invalid_handle`,
`fs_invalid_flag`, `fs_io_error`.

Node errors map onto those names. `ENOENT` is `fs_not_found`. `EEXIST`
is `fs_already_exists`.

## Not this package

- A C++ host (`cpp-fs`) is not started.
- WASI is not a way in. Guests do not get a raw filesystem.
- `attach(file_id)` streaming is not implemented.
- The browser upload sink is a future implementation of this same RPC.
