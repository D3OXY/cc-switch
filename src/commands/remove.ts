import { confirm } from '@inquirer/prompts'
import pc from 'picocolors'
import { readStore, removeAccount, getAccountNames } from '../lib/store.js'
import { deleteConfigBackup } from '../lib/config.js'
import { deleteCredentialBackup } from '../lib/credentials.js'
import { resolveIdentifier } from '../lib/resolve.js'

export async function removeCommand(identifier: string): Promise<void> {
  const store = readStore()
  const names = getAccountNames(store)

  if (names.length === 0) {
    throw new Error('No accounts to remove.')
  }

  const target = resolveIdentifier(identifier, store)
  const account = store.accounts[target]

  const yes = await confirm({
    message: `Remove account ${target} (${account.email})?`,
    default: false,
  })

  if (!yes) {
    console.log('  Cancelled.')
    return
  }

  deleteConfigBackup(target)
  deleteCredentialBackup(target)
  removeAccount(store, target)

  console.log(`\n  ${pc.green('Removed')} account ${pc.bold(target)} (${account.email})\n`)
}
