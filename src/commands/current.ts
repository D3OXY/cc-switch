import pc from 'picocolors'
import { readStore } from '../lib/store.js'

export async function currentCommand(): Promise<void> {
  const store = readStore()

  if (!store.activeAccount || !store.accounts[store.activeAccount]) {
    console.log(`\n  No active account. Run ${pc.cyan('ccs add')} to add one.\n`)
    return
  }

  const name = store.activeAccount
  const account = store.accounts[name]
  console.log(`\n  ${pc.bold(name)} ${pc.dim(`(${account.email})`)}\n`)
}
