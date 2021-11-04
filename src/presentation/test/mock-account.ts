import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import faker from 'faker'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  token: string = faker.random.uuid as any

  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    this.authenticationParams = authenticationParams

    return await Promise.resolve(this.token)
  }
}

export class AddAccountSpy implements AddAccount {
  accountModule: AccountModel = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (data: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = data

    return await Promise.resolve(this.accountModule)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role as any

    return await Promise.resolve(this.accountModel)
  }
}
