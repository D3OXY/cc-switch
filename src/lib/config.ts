import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs'
import { PATHS, configBackupPath } from './paths.js'
import type { ClaudeConfig, OAuthAccount } from './types.js'

export function findConfigPath(): string {
  if (existsSync(PATHS.claudeConfigAlt)) return PATHS.claudeConfigAlt
  if (existsSync(PATHS.claudeConfig)) return PATHS.claudeConfig
  throw new Error('Claude Code config not found. Please install and log in to Claude Code first.')
}

export function readClaudeConfig(): ClaudeConfig {
  const path = findConfigPath()
  return JSON.parse(readFileSync(path, 'utf-8'))
}

export function getOAuthAccount(): OAuthAccount {
  const config = readClaudeConfig()
  if (!config.oauthAccount) {
    throw new Error('No account logged in. Please run `claude` and log in first.')
  }
  return config.oauthAccount
}

export function backupOAuthAccount(name: string): void {
  const oauth = getOAuthAccount()
  writeFileSync(configBackupPath(name), JSON.stringify(oauth, null, 2) + '\n', { mode: 0o600 })
}

export function restoreOAuthAccount(name: string): void {
  const backupFile = configBackupPath(name)
  if (!existsSync(backupFile)) {
    throw new Error(`No config backup found for account "${name}".`)
  }

  const oauth: OAuthAccount = JSON.parse(readFileSync(backupFile, 'utf-8'))
  const configPath = findConfigPath()
  const config: ClaudeConfig = JSON.parse(readFileSync(configPath, 'utf-8'))
  config.oauthAccount = oauth
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')
}

export function deleteConfigBackup(name: string): void {
  const path = configBackupPath(name)
  if (existsSync(path)) unlinkSync(path)
}
