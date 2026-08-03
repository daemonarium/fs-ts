import { TypeRegistry, TypeDescription } from '@wa-os/ts-rpc';
export interface rpc_request {
    request_id: bigint;
    function_id: bigint;
}
export interface rpc_response {
    request_id: bigint;
}
export interface rpc_error {
    request_id: bigint;
}
export interface read_annotation {
}
export interface member_annotation {
}
export interface fs {
    "fs.mkdir": any;
    "fs.rmdir": any;
    "fs.readdir": any;
    "fs.unlink": any;
    "fs.rename": any;
    "fs.stat": any;
    "fs.exists": any;
    "fs.open": any;
    "fs.close": any;
    "fs.write": any;
    "fs.read": any;
    "fs.seek": any;
    "fs.sync": any;
}
export interface dir_entry {
    name: string;
    is_directory: boolean;
    size: bigint;
}
export interface file_info {
    is_directory: boolean;
    size: bigint;
    mtime_ms: bigint;
}
export declare enum seek_whence {
    SET = 0,
    CUR = 1,
    END = 2
}
export declare enum open_flag {
    NONE = 0,
    READ = 1,
    WRITE = 2,
    CREATE = 4,
    TRUNCATE = 8,
    APPEND = 16
}
export declare function createGeneratedTypeRegistry(): {
    registry: TypeRegistry;
    types: {
        [key: string]: TypeDescription;
    };
};
export declare function implementMethods(result: ReturnType<typeof createGeneratedTypeRegistry>): void;
export declare function setupServer(): TypeRegistry;
