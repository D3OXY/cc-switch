import { Command } from 'commander'
import pc from 'picocolors'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'
import { switchCommand } from './commands/switch.js'
import { removeCommand } from './commands/remove.js'
import { currentCommand } from './commands/current.js'
import { interactiveCommand } from './commands/interactive.js'

const program = new Command()

program
  .name('ccs')
  .description('Switch between multiple Claude Code accounts')
  .version('0.1.0')

program
  .command('add')
  .description('Add the currently logged-in Claude Code account')
  .action(wrap(addCommand))

program
  .command('list')
  .description('List all managed accounts')
  .action(wrap(listCommand))

program
  .command('switch')
  .description('Switch to an account by name or index')
  .argument('<id>', 'Account name or numeric index from list')
  .action(wrap(switchCommand))

program
  .command('remove')
  .description('Remove a managed account')
  .argument('<id>', 'Account name or numeric index from list')
  .action(wrap(removeCommand))

program
  .command('current')
  .description('Show the currently active account')
  .action(wrap(currentCommand))

program
  .command('help')
  .description('Show help information')
  .action(() => { program.help() })

// No subcommand → interactive mode
program.action(wrap(interactiveCommand))

function wrap(fn: (...args: any[]) => Promise<void>) {
  return async (...args: any[]) => {
    try {
      await fn(...args)
    } catch (err: any) {
      // Ctrl+C from inquirer
      if (err?.name === 'ExitPromptError') {
        process.exit(0)
      }
      console.error(`\n  ${pc.red('Error:')} ${err?.message ?? err}\n`)
      process.exit(1)
    }
  }
}

program.parse()
