# fs

The Node filesystem host for Daemonarium. A `LocalProcess` speaks the
filesystem RPC on one socket. No WASI. A guest can touch files only
when something binds it to that socket.

The npm package is `@daemonarium/fs`. This repository is
`daemonarium/fs-ts`.

## Why it is not in the kernel

The kernel stays off the host disk, so the same process contract runs
in the browser and in Node. This package is the Node sink: one
`rootDir`, `node:fs` underneath. A browser sink can implement the same
RPC later. `debug-store`, the first Wasm consumer, is a separate
repository.

## Install

```
npm i @daemonarium/fs
```

Depends on `@daemonarium/kernel` and `@daemonarium/rpc`.

## One example

```ts
import { Kernel, LocalProcess } from '@daemonarium/kernel'
import { CodecRegistry, SocketRpcClient, registerDynamicCodecs } from '@daemonarium/rpc'
import { bindToFsProcess, createFsProcess, open_flag } from '@daemonarium/fs'

const kernel = new Kernel()
const fs = createFsProcess(kernel, { rootDir: './data', processId: 1 })

const client = new LocalProcess(kernel, 2, 1_000_000)
kernel.processes[2] = client
client.createSocket(0, {
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
const rpc = new SocketRpcClient(client.getSocket(0)!, fs.registry, codecs)
const mkdir = fs.registry.getMethods().find((m) => m.memberName === 'fs.mkdir')
await rpc.call(mkdir!.methodId, 'logs')
```

The write and read round-trip is in [docs/examples.md](docs/examples.md).

## Paths and methods

Every path is relative to `rootDir`. Absolute paths, NUL, and `..`
are `fs_invalid_path`.

Methods: `mkdir`, `rmdir`, `readdir`, `unlink`, `rename`, `stat`,
`exists`, `open`, `close`, `write`, `read`, `seek`, `sync`.

Flags, exceptions, and append rules are in
[docs/architecture.md](docs/architecture.md).

## License

MIT. Upstream notices are in `NOTICE`. Conduct is in
`CODE_OF_CONDUCT.md`.
