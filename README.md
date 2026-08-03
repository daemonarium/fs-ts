# ts-fs (`@wa-os/ts-fs`)

Status: **implemented** (Node `LocalProcess` host).

Host filesystem access for WA-OS processes via **RPC over sockets**, same pattern as the kernel API. No WASI: processes must not bypass the socket contract.

| Piece | Location |
|-------|----------|
| Shared contract | [`cpp-rpc/src/examples/structures/fs.hpp`](../cpp-rpc/src/examples/structures/fs.hpp) |
| WASM registry module | [`cpp-rpc/src/examples/modules/fs.cpp`](../cpp-rpc/src/examples/modules/fs.cpp) → `fs.wasm` |
| Generated TS API | [`src/fsApi.ts`](src/fsApi.ts) |
| Node host | this package (`FsService`, `createFsProcess`) |
| Future C++ host | `cpp-fs` (not started) |

## Why

- Durable snapshots / I/O logs / service logs need a host sink without giving WASM WASI file access.
- Capability = who is `bind`ed to the FS process socket.
- Later **debug-service** can use this on Node; in the browser it would use WebSocket upload instead — same consumer API shape, different sink.

## Architecture

```
Consumer process
    │  RPC (bind to FS socket)
    ▼
ts-fs LocalProcess (@wa-os/ts-fs)
    │
    ▼
host filesystem (one rootDir per instance)
```

## Semantics

- Paths are relative to `rootDir`. Absolute paths, NUL, and `..` escapes → `fs_invalid_path`.
- `mkdir` creates parents (`mkdir -p`).
- `open(CREATE…)` with missing parent directory → `fs_not_found`.
- `write` is all-or-throw (returns byte count = input length).
- `read` returns empty `binary` at EOF.
- `APPEND`: each `write` goes to EOF; `seek` only affects subsequent `read`.
- `rename` follows POSIX file replace rules.

### Flags (`open_flag`)

`READ`, `WRITE`, `CREATE`, `TRUNCATE`, `APPEND` (bitmask).

### Methods

`mkdir`, `rmdir`, `readdir`, `unlink`, `rename`, `stat`, `exists`, `open`, `close`, `write`, `read`, `seek`, `sync`.

### Exceptions

`fs_error`, `fs_not_found`, `fs_already_exists`, `fs_not_a_directory`, `fs_is_a_directory`, `fs_invalid_path`, `fs_invalid_handle`, `fs_invalid_flag`, `fs_io_error`.

## Usage

```ts
import { Kernel, LocalProcess } from '@wa-os/ts-kernel'
import { createFsProcess, bindToFsProcess, open_flag } from '@wa-os/ts-fs'
import { CodecRegistry, registerDynamicCodecs, SocketRpcClient } from '@wa-os/ts-rpc'

const kernel = new Kernel()
const fs = createFsProcess(kernel, { rootDir: './data', processId: 1 })

const client = new LocalProcess(kernel, 2, 1_000_000)
kernel.processes[2] = client
client.createSocket(0, { /* buffer sizes */ })
bindToFsProcess(client, 0, fs)

const codecs = new CodecRegistry()
registerDynamicCodecs(codecs, fs.registry)
const rpc = new SocketRpcClient(client.getSocket(0)!, fs.registry, codecs)
// rpc.call(methodId, ...)
```

## Regenerate `fsApi.ts`

Requires WASM toolchain + existing `cmake-build-emscripten`:

```bash
cmake --build cmake-build-emscripten --target fs
cd ts-rpc && npm run build
node dist/src/codeGenCli.js \
  ../cmake-build-emscripten/examples/modules/fs.wasm \
  -l "TS Server" -s 0 \
  > ../ts-fs/src/fsApi.ts
```

## Tests

```bash
npm install   # root workspaces, includes ts-fs
cd ts-fs && npm test
```

## Out of scope (here)

- `debug-service`, browser upload / WS sink
- `cpp-fs`
- `attach(file_id ↔ socket)` streaming fast-path
- WASI, kernel API changes
