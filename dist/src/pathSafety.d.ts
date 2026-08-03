/**
 * Resolve a service-relative path against rootDir.
 * Rejects empty, absolute, NUL, and `..` escapes.
 */
export declare function resolveRelative(rootDir: string, relativePath: string): string;
