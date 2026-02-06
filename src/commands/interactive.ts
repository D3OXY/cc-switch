import { select } from '@inquirer/prompts'
import { readStore, getAccountNames } from '../lib/store.js'
import { addCommand } from './add.js'
import { listCommand } from './list.js'
import { switchCommand } from './switch.js'
import { removeCommand } from './remove.js'
import { currentCommand } from './current.js'

export async function interactiveCommand(): Promise<void> {
  const store = readStore()
  const names = getAccountNames(store)
  const hasAccounts = names.length > 0

  const choices: { name: string; value: string }[] = []

  if (hasAccounts) {
    choices.push({ name: 'Switch account', value: 'switch' })
  }
  choices.push({ name: 'Add current account', value: 'add' })
  if (hasAccounts) {
    choices.push({ name: 'List accounts', value: 'list' })
    choices.push({ name: 'Remove account', value: 'remove' })
    choices.push({ name: 'Show current', value: 'current' })
  }

  const action = await select({ message: 'What do you want to do?', choices })

  if (action === 'switch') {
    const target = await selectAccount(store, names, 'Switch to')
    if (target) await switchCommand(target)
  } else if (action === 'add') {
    await addCommand()
  } else if (action === 'list') {
    await listCommand()
  } else if (action === 'remove') {
    const target = await selectAccount(store, names, 'Remove')
    if (target) await removeCommand(target)
  } else if (action === 'current') {
    await currentCommand()
  }
}

async function selectAccount(
  store: ReturnType<typeof readStore>,
  names: string[],
  label: string,
): Promise<string | null> {
  const choices = names.map((name, i) => {
    const account = store.accounts[name]
    const active = name === store.activeAccount ? ' (active)' : ''
    return {
      name: `${i + 1}. ${name} (${account.email})${active}`,
      value: name,
    }
  })

  return select({ message: `${label} which account?`, choices })
}
