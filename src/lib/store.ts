import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { PATHS } from './paths.js'
import type { Store, AccountEntry } from './types.js'

function defaultStore(): Store {
  return {
    activeAccount: null,
    lastUpdated: new Date().toISOString(),
    accounts: {},
  }
}

export function ensureDirs(): void {
  mkdirSync(PATHS.configsDir, { recursive: true })
  mkdirSync(PATHS.credentialsDir, { recursive: true })
}

export function readStore(): Store {
  if (!existsSync(PATHS.storeFile)) return defaultStore()
  try {
    return JSON.parse(readFileSync(PATHS.storeFile, 'utf-8'))
  } catch {
    throw new Error('Store file is corrupted. Delete ~/.ccs-backup/store.json to start fresh.')
  }
}

export function writeStore(store: Store): void {
  ensureDirs()
  store.lastUpdated = new Date().toISOString()
  writeFileSync(PATHS.storeFile, JSON.stringify(store, null, 2) + '\n', { mode: 0o600 })
}

export function getAccountNames(store: Store): string[] {
  return Object.keys(store.accounts)
}

export function addAccount(store: Store, name: string, entry: AccountEntry): void {
  store.accounts[name] = entry
  store.activeAccount = name
  writeStore(store)
}

export function removeAccount(store: Store, name: string): void {
  delete store.accounts[name]
  if (store.activeAccount === name) store.activeAccount = null
  writeStore(store)
}

export function setActive(store: Store, name: string): void {
  store.activeAccount = name
  writeStore(store)
}
