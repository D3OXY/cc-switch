export interface AccountEntry {
  email: string
  uuid: string
  displayName: string
  added: string
}

export interface Store {
  activeAccount: string | null
  lastUpdated: string
  accounts: Record<string, AccountEntry>
}

export interface OAuthAccount {
  accountUuid: string
  emailAddress: string
  organizationUuid?: string
  hasExtraUsageEnabled?: boolean
  billingType?: string
  accountCreatedAt?: string
  subscriptionCreatedAt?: string
  displayName?: string
}

export interface ClaudeConfig {
  oauthAccount?: OAuthAccount
  [key: string]: unknown
}

export type Platform = 'macos' | 'linux' | 'wsl'
