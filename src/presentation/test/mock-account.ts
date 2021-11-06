import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AuthenticationModel } from '@/domain/models/authentication'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import faker from 'faker'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationsModel: AuthenticationModel = {
    accessToken: faker.random.uuid as any,
    name: faker.name.findName(),
    email: faker.internet.email()
  }

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authenticationParams

    return this.authenticationsModel
  }
}

export class AddAccountSpy implements AddAccount {
  accountModule: AccountModel = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (data: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = data

    return this.accountModule
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role as any

    return this.accountModel
  }
}
