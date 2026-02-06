import type { Store } from './types.js'

export function resolveIdentifier(identifier: string, store: Store): string {
  const names = Object.keys(store.accounts)

  // Try as 1-based numeric index
  const num = parseInt(identifier, 10)
  if (!isNaN(num) && String(num) === identifier) {
    if (num < 1 || num > names.length) {
      throw new Error(`Index ${num} out of range (1-${names.length}). Use 'ccs list' to see accounts.`)
    }
    return names[num - 1]
  }

  // Try as name
  if (store.accounts[identifier]) {
    return identifier
  }

  throw new Error(`Account "${identifier}" not found. Use 'ccs list' to see accounts.`)
}
