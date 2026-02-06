import pc from 'picocolors'
import { readStore, setActive, getAccountNames } from '../lib/store.js'
import { backupOAuthAccount, restoreOAuthAccount, getOAuthAccount } from '../lib/config.js'
import { backupCredentials, restoreCredentials } from '../lib/credentials.js'
import { resolveIdentifier } from '../lib/resolve.js'

export async function switchCommand(identifier: string): Promise<void> {
  const store = readStore()
  const names = getAccountNames(store)

  if (names.length === 0) {
    throw new Error('No accounts managed yet. Run \'ccs add\' first.')
  }

  const target = resolveIdentifier(identifier, store)

  if (target === store.activeAccount) {
    console.log(`\n  Already on account ${pc.bold(target)}.\n`)
    return
  }

  // Save current account state before switching
  if (store.activeAccount && store.accounts[store.activeAccount]) {
    try {
      backupOAuthAccount(store.activeAccount)
      backupCredentials(store.activeAccount)
    } catch {
      // Current account may not be logged in anymore, continue with switch
    }
  }

  // Restore target account
  restoreOAuthAccount(target)
  restoreCredentials(target)
  setActive(store, target)

  const account = store.accounts[target]
  console.log(`\n  ${pc.green('Switched')} to ${pc.bold(target)} (${account.email})`)
  console.log(`  ${pc.dim('Restart Claude Code to use the new account.')}\n`)
}
