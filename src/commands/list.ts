import pc from 'picocolors'
import { readStore, getAccountNames } from '../lib/store.js'

export async function listCommand(): Promise<void> {
  const store = readStore()
  const names = getAccountNames(store)

  if (names.length === 0) {
    console.log(`\n  No accounts managed yet. Run ${pc.cyan('ccs add')} to add your first account.\n`)
    return
  }

  console.log('')
  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    const account = store.accounts[name]
    const isActive = name === store.activeAccount
    const idx = pc.dim(`${i + 1}.`)
    const label = isActive ? pc.green(pc.bold(name)) : name
    const email = pc.dim(`(${account.email})`)
    const marker = isActive ? pc.green(' ← active') : ''
    console.log(`  ${idx} ${label} ${email}${marker}`)
  }
  console.log('')
}
