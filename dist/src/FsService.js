import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { RpcException } from '@wa-os/ts-rpc';
import { open_flag, seek_whence, } from './fsApi.js';
import { resolveRelative } from './pathSafety.js';
function hasFlag(flags, flag) {
    return (flags & flag) !== 0;
}
function mapNodeError(error, fallbackType = 'fs_io_error') {
    const err = error;
    const message = err?.message ? String(err.message) : String(error);
    switch (err?.code) {
        case 'ENOENT':
            throw new RpcException(message, 'fs_not_found');
        case 'EEXIST':
            throw new RpcException(message, 'fs_already_exists');
        case 'ENOTDIR':
            throw new RpcException(message, 'fs_not_a_directory');
        case 'EISDIR':
            throw new RpcException(message, 'fs_is_a_directory');
        case 'EINVAL':
            throw new RpcException(message, 'fs_invalid_flag');
        default:
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException(message, fallbackType);
    }
}
export class FsService {
    rootDir;
    files = new Map();
    nextFileId = 1;
    constructor(rootDir) {
        this.rootDir = path.resolve(rootDir);
    }
    abs(relativePath) {
        return resolveRelative(this.rootDir, relativePath);
    }
    getOpen(id) {
        const file = this.files.get(id);
        if (!file) {
            throw new RpcException(`invalid file handle ${id}`, 'fs_invalid_handle');
        }
        return file;
    }
    async mkdir(relativePath) {
        const abs = this.abs(relativePath);
        try {
            await fsp.mkdir(abs, { recursive: true });
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async rmdir(relativePath) {
        const abs = this.abs(relativePath);
        try {
            await fsp.rmdir(abs);
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async readdir(relativePath) {
        const abs = this.abs(relativePath);
        try {
            const names = await fsp.readdir(abs);
            const entries = [];
            for (const name of names) {
                const st = await fsp.stat(path.join(abs, name));
                entries.push({
                    name,
                    is_directory: st.isDirectory(),
                    size: BigInt(st.size),
                });
            }
            return entries;
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async unlink(relativePath) {
        const abs = this.abs(relativePath);
        try {
            const st = await fsp.stat(abs);
            if (st.isDirectory()) {
                throw new RpcException('path is a directory', 'fs_is_a_directory');
            }
            await fsp.unlink(abs);
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async rename(from, to) {
        const absFrom = this.abs(from);
        const absTo = this.abs(to);
        try {
            await fsp.rename(absFrom, absTo);
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async stat(relativePath) {
        const abs = this.abs(relativePath);
        try {
            const st = await fsp.stat(abs);
            return {
                is_directory: st.isDirectory(),
                size: BigInt(st.isDirectory() ? 0 : st.size),
                mtime_ms: BigInt(Math.floor(st.mtimeMs)),
            };
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async exists(relativePath) {
        const abs = this.abs(relativePath);
        try {
            await fsp.access(abs, fs.constants.F_OK);
            return true;
        }
        catch (error) {
            const err = error;
            if (err?.code === 'ENOENT') {
                return false;
            }
            mapNodeError(error);
        }
    }
    async open(relativePath, flags) {
        const wantRead = hasFlag(flags, open_flag.READ);
        const wantWrite = hasFlag(flags, open_flag.WRITE);
        const wantCreate = hasFlag(flags, open_flag.CREATE);
        const wantTrunc = hasFlag(flags, open_flag.TRUNCATE);
        const wantAppend = hasFlag(flags, open_flag.APPEND);
        if (!wantRead && !wantWrite) {
            throw new RpcException('open requires READ and/or WRITE', 'fs_invalid_flag');
        }
        if (wantAppend && !wantWrite) {
            throw new RpcException('APPEND requires WRITE', 'fs_invalid_flag');
        }
        if (wantTrunc && !wantWrite) {
            throw new RpcException('TRUNCATE requires WRITE', 'fs_invalid_flag');
        }
        const abs = this.abs(relativePath);
        let nodeFlags = 0;
        if (wantRead && wantWrite) {
            nodeFlags |= fs.constants.O_RDWR;
        }
        else if (wantWrite) {
            nodeFlags |= fs.constants.O_WRONLY;
        }
        else {
            nodeFlags |= fs.constants.O_RDONLY;
        }
        if (wantCreate) {
            nodeFlags |= fs.constants.O_CREAT;
        }
        if (wantTrunc) {
            nodeFlags |= fs.constants.O_TRUNC;
        }
        if (wantAppend) {
            nodeFlags |= fs.constants.O_APPEND;
        }
        try {
            const handle = await fsp.open(abs, nodeFlags);
            const id = this.nextFileId++;
            this.files.set(id, { handle, flags, position: 0 });
            return id;
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async close(id) {
        const file = this.getOpen(id);
        this.files.delete(id);
        try {
            await file.handle.close();
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async write(id, data) {
        const file = this.getOpen(id);
        if (!hasFlag(file.flags, open_flag.WRITE)) {
            throw new RpcException('file not opened for WRITE', 'fs_invalid_flag');
        }
        try {
            if (hasFlag(file.flags, open_flag.APPEND)) {
                const result = await file.handle.write(data, 0, data.length, null);
                if (result.bytesWritten !== data.length) {
                    throw new RpcException(`short write ${result.bytesWritten}/${data.length}`, 'fs_io_error');
                }
                return result.bytesWritten;
            }
            const result = await file.handle.write(data, 0, data.length, file.position);
            if (result.bytesWritten !== data.length) {
                throw new RpcException(`short write ${result.bytesWritten}/${data.length}`, 'fs_io_error');
            }
            file.position += result.bytesWritten;
            return result.bytesWritten;
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async read(id, maxBytes) {
        const file = this.getOpen(id);
        if (!hasFlag(file.flags, open_flag.READ)) {
            throw new RpcException('file not opened for READ', 'fs_invalid_flag');
        }
        if (maxBytes <= 0) {
            return new Uint8Array(0);
        }
        try {
            const buffer = Buffer.alloc(maxBytes);
            const result = await file.handle.read(buffer, 0, maxBytes, file.position);
            file.position += result.bytesRead;
            return new Uint8Array(buffer.subarray(0, result.bytesRead));
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async seek(id, offset, whence) {
        const file = this.getOpen(id);
        const delta = typeof offset === 'bigint' ? Number(offset) : offset;
        try {
            const st = await file.handle.stat();
            let next = file.position;
            if (whence === seek_whence.SET) {
                next = delta;
            }
            else if (whence === seek_whence.CUR) {
                next = file.position + delta;
            }
            else if (whence === seek_whence.END) {
                next = st.size + delta;
            }
            else {
                throw new RpcException(`invalid seek whence ${whence}`, 'fs_invalid_flag');
            }
            if (next < 0) {
                throw new RpcException('seek before start of file', 'fs_invalid_flag');
            }
            file.position = next;
            return BigInt(file.position);
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async sync(id) {
        const file = this.getOpen(id);
        try {
            await file.handle.sync();
        }
        catch (error) {
            mapNodeError(error);
        }
    }
    async closeAll() {
        const ids = [...this.files.keys()];
        for (const id of ids) {
            await this.close(id);
        }
    }
}
