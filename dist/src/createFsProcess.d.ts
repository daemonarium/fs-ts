import { SocketRpcServer, TypeDescription, type TypeRegistry, type SocketOptions } from '@wa-os/ts-rpc';
import { Kernel, LocalProcess, Direction } from '@wa-os/ts-kernel';
import { FsService } from './FsService.js';
export interface CreateFsProcessOptions {
    rootDir: string;
    processId?: number;
    socketId?: number;
    manaLimit?: number;
    socketOptions?: SocketOptions;
}
export interface FsProcessHandle {
    process: LocalProcess;
    processId: number;
    socketId: number;
    service: FsService;
    registry: TypeRegistry;
    server: SocketRpcServer;
}
export declare function createFsRpcRegistry(service: FsService): {
    registry: TypeRegistry;
    types: {
        [key: string]: TypeDescription;
    };
};
/**
 * Spawn a LocalProcess hosting the FS RPC API on a socket (default 0).
 * Caller binds consumers to that socket; capability = topology.
 */
export declare function createFsProcess(kernel: Kernel, options: CreateFsProcessOptions): FsProcessHandle;
export declare function bindToFsProcess(consumer: LocalProcess, consumerSocketId: number, fsHandle: FsProcessHandle, direction?: Direction): void;
