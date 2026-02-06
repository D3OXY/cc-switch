import type { Platform } from './types.js'

export function detectPlatform(): Platform {
  if (process.platform === 'darwin') return 'macos'
  if (process.env.WSL_DISTRO_NAME) return 'wsl'
  if (process.platform === 'linux') return 'linux'
  throw new Error(`Unsupported platform: ${process.platform}. Supports macOS, Linux, and WSL.`)
}

export function isMacOS(): boolean {
  return process.platform === 'darwin'
}
