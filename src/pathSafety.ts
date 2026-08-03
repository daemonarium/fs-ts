import path from 'node:path'
import { RpcException } from '@wa-os/ts-rpc'

/**
 * Resolve a service-relative path against rootDir.
 * Rejects empty, absolute, NUL, and `..` escapes.
 */
export function resolveRelative(rootDir: string, relativePath: string): string {
  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    throw new RpcException('path must be a non-empty string', 'fs_invalid_path')
  }
  if (relativePath.includes('\0')) {
    throw new RpcException('path must not contain NUL', 'fs_invalid_path')
  }
  if (path.isAbsolute(relativePath)) {
    throw new RpcException('path must be relative to service root', 'fs_invalid_path')
  }

  const root = path.resolve(rootDir)
  const normalized = path.posix.normalize(relativePath.replace(/\\/g, '/'))
  if (normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) {
    throw new RpcException('path must not escape service root', 'fs_invalid_path')
  }
  // After posix.normalize, lone '.' is ok (means root); empty after strip trailing slash?
  const segments = normalized.split('/').filter((s) => s.length > 0 && s !== '.')
  if (segments.some((s) => s === '..')) {
    throw new RpcException('path must not escape service root', 'fs_invalid_path')
  }

  const absolute = path.resolve(root, ...segments)
  const relative = path.relative(root, absolute)
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new RpcException('path must not escape service root', 'fs_invalid_path')
  }
  return absolute
}
