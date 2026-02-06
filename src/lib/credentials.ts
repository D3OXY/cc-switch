import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs'
import { userInfo } from 'node:os'
import { PATHS, KEYCHAIN, keychainBackupService, credentialBackupPath } from './paths.js'
import { isMacOS } from './platform.js'

// --- macOS Keychain ---

function keychainRead(service: string): string | null {
  try {
    return execFileSync('security', [
      'find-generic-password', '-s', service, '-w',
    ], { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return null
  }
}

function keychainWrite(service: string, data: string): void {
  const username = userInfo().username
  execFileSync('security', [
    'add-generic-password', '-U', '-s', service, '-a', username, '-w', data,
  ], { stdio: ['pipe', 'pipe', 'pipe'] })
}

function keychainDelete(service: string): void {
  try {
    execFileSync('security', [
      'delete-generic-password', '-s', service,
    ], { stdio: ['pipe', 'pipe', 'pipe'] })
  } catch {
    // already deleted or not found
  }
}

// --- File-based (Linux/WSL) ---

function fileRead(path: string): string | null {
  if (!existsSync(path)) return null
  return readFileSync(path, 'utf-8')
}

function fileWrite(path: string, data: string): void {
  writeFileSync(path, data, { mode: 0o600 })
}

// --- Unified API ---

export function readCurrentCredentials(): string {
  if (isMacOS()) {
    const creds = keychainRead(KEYCHAIN.claudeService)
    if (!creds) throw new Error('No credentials found in keychain for Claude Code.')
    return creds
  }
  const creds = fileRead(PATHS.claudeCredentialsFile)
  if (!creds) throw new Error('No credentials file found at ~/.claude/.credentials.json')
  return creds
}

export function backupCredentials(name: string): void {
  const creds = readCurrentCredentials()
  if (isMacOS()) {
    keychainWrite(keychainBackupService(name), creds)
  } else {
    fileWrite(credentialBackupPath(name), creds)
  }
}

export function restoreCredentials(name: string): void {
  let creds: string | null
  if (isMacOS()) {
    creds = keychainRead(keychainBackupService(name))
  } else {
    creds = fileRead(credentialBackupPath(name))
  }

  if (!creds) throw new Error(`No credential backup found for account "${name}".`)

  if (isMacOS()) {
    keychainWrite(KEYCHAIN.claudeService, creds)
  } else {
    fileWrite(PATHS.claudeCredentialsFile, creds)
  }
}

export function deleteCredentialBackup(name: string): void {
  if (isMacOS()) {
    keychainDelete(keychainBackupService(name))
  } else {
    const path = credentialBackupPath(name)
    if (existsSync(path)) unlinkSync(path)
  }
}
