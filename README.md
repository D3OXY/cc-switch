# ccs — Claude Code Switcher

Switch between multiple Claude Code accounts from the terminal.

## Install

```bash
npm install -g cc-switch
```

## Platform Support

| Platform | Support | Credential Storage |
|----------|---------|-------------------|
| macOS | Full | macOS Keychain (encrypted) |
| Linux | Partial | Plain file (`~/.ccs-backup/credentials/`) with `0600` permissions |
| WSL | Partial | Same as Linux |
| Windows | Not supported | — |

On macOS, backed-up credentials are stored in the system Keychain under `ccs-backup-{name}`, matching the same security level as Claude Code itself.

On Linux/WSL, credentials are stored as files. They're owner-read-only (`0600`) but not encrypted — same as how Claude Code stores them natively.

## Usage

### Add an account

Log into Claude Code, then register it:

```bash
ccs add
# ? Name for this account: work
# Added account work (you@company.com)
```

Log into a different account and add that too:

```bash
ccs add
# ? Name for this account: personal
# Added account personal (me@gmail.com)
```

### List accounts

```bash
ccs list
# 1. work (you@company.com) ← active
# 2. personal (me@gmail.com)
```

### Switch accounts

By name:

```bash
ccs switch work
```

By index from list:

```bash
ccs switch 2
```

### Show current account

```bash
ccs current
# work (you@company.com)
```

### Remove an account

```bash
ccs remove personal
# ? Remove account personal (me@gmail.com)? Yes
# Removed account personal (me@gmail.com)
```

### Interactive mode

Run `ccs` with no arguments for a menu:

```bash
ccs
# ? What do you want to do?
#   Switch account
#   Add current account
#   List accounts
#   Remove account
#   Show current
```

## How it works

Claude Code uses two pieces of state to identify you:

1. **`~/.claude.json`** — contains `oauthAccount` (email, account UUID, org)
2. **System credentials** — OAuth tokens (macOS Keychain / Linux file)

When you `ccs add`, both are copied to backups. When you `ccs switch`, the current account's state is saved first, then the target account's backup is restored. Only the `oauthAccount` field is swapped — your settings (MCP servers, theme, etc.) stay untouched.

After switching, restart Claude Code to pick up the new account.

## Data locations

```
~/.ccs-backup/
├── store.json               # Account registry (names, emails — no secrets)
├── configs/
│   └── {name}.json          # Saved oauthAccount metadata per account
└── credentials/
    └── {name}.json          # Linux/WSL only — OAuth tokens
```

On macOS, credentials are in the Keychain under service `ccs-backup-{name}` instead of files.

## Commands

```
ccs add                Add the currently logged-in account
ccs list               List all managed accounts
ccs switch <id|name>   Switch to an account by name or index
ccs remove <id|name>   Remove an account
ccs current            Show the active account
ccs                    Interactive mode
ccs help               Show help
```

## License

MIT
