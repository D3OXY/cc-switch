import type { Store } from './types.js'

const NAME_PATTERN = /^[a-z0-9_]+$/

export function validateAccountName(name: string): string | true {
  if (!name) return 'Account name cannot be empty.'
  if (!NAME_PATTERN.test(name)) return 'Only lowercase letters, digits, and underscores allowed.'
  if (name.length > 32) return 'Must be 32 characters or fewer.'
  return true
}

export function ensureNameAvailable(name: string, store: Store): void {
  if (store.accounts[name]) {
    throw new Error(`Account name "${name}" is already in use.`)
  }
}
