import { seek_whence, type dir_entry, type file_info } from './fsApi.js';
export declare class FsService {
    private readonly rootDir;
    private readonly files;
    private nextFileId;
    constructor(rootDir: string);
    private abs;
    private getOpen;
    mkdir(relativePath: string): Promise<void>;
    rmdir(relativePath: string): Promise<void>;
    readdir(relativePath: string): Promise<dir_entry[]>;
    unlink(relativePath: string): Promise<void>;
    rename(from: string, to: string): Promise<void>;
    stat(relativePath: string): Promise<file_info>;
    exists(relativePath: string): Promise<boolean>;
    open(relativePath: string, flags: number): Promise<number>;
    close(id: number): Promise<void>;
    write(id: number, data: Uint8Array): Promise<number>;
    read(id: number, maxBytes: number): Promise<Uint8Array>;
    seek(id: number, offset: number | bigint, whence: seek_whence): Promise<bigint>;
    sync(id: number): Promise<void>;
    closeAll(): Promise<void>;
}
