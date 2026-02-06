import { input } from '@inquirer/prompts'
import pc from 'picocolors'
import { getOAuthAccount, backupOAuthAccount } from '../lib/config.js'
import { backupCredentials } from '../lib/credentials.js'
import { readStore, addAccount, ensureDirs } from '../lib/store.js'
import { validateAccountName, ensureNameAvailable } from '../lib/validate.js'
import type { AccountEntry } from '../lib/types.js'

export async function addCommand(): Promise<void> {
  const oauth = getOAuthAccount()

  ensureDirs()
  const store = readStore()

  // Check if this email is already managed
  const existing = Object.entries(store.accounts).find(([, a]) => a.email === oauth.emailAddress)
  if (existing) {
    console.log(`\n  Account ${pc.cyan(existing[0])} (${oauth.emailAddress}) is already managed.\n`)
    return
  }

  const name = await input({
    message: 'Name for this account',
    validate: (val) => {
      const result = validateAccountName(val)
      if (result !== true) return result
      if (store.accounts[val]) return `Name "${val}" is already in use.`
      return true
    },
  })

  ensureNameAvailable(name, store)

  // Backup current state
  backupOAuthAccount(name)
  backupCredentials(name)

  const entry: AccountEntry = {
    email: oauth.emailAddress,
    uuid: oauth.accountUuid,
    displayName: oauth.displayName ?? '',
    added: new Date().toISOString(),
  }

  addAccount(store, name, entry)

  console.log(`\n  ${pc.green('Added')} account ${pc.bold(name)} (${oauth.emailAddress})\n`)
}
