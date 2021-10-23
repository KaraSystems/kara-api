import { AccountModel } from '@/domain/models/account'

export type AddAccountParams = {
  name: string
  email: string
  password: string
}

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
