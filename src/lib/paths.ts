import { homedir } from 'node:os'
import { join } from 'node:path'

const home = homedir()

export const PATHS = {
  claudeDir: join(home, '.claude'),
  claudeConfig: join(home, '.claude.json'),
  claudeConfigAlt: join(home, '.claude', '.claude.json'),
  claudeCredentialsFile: join(home, '.claude', '.credentials.json'),

  backupDir: join(home, '.ccs-backup'),
  storeFile: join(home, '.ccs-backup', 'store.json'),
  configsDir: join(home, '.ccs-backup', 'configs'),
  credentialsDir: join(home, '.ccs-backup', 'credentials'),
} as const

export const KEYCHAIN = {
  claudeService: 'Claude Code-credentials',
  backupPrefix: 'ccs-backup-',
} as const

export function configBackupPath(name: string): string {
  return join(PATHS.configsDir, `${name}.json`)
}

export function credentialBackupPath(name: string): string {
  return join(PATHS.credentialsDir, `${name}.json`)
}

export function keychainBackupService(name: string): string {
  return `${KEYCHAIN.backupPrefix}${name}`
}
