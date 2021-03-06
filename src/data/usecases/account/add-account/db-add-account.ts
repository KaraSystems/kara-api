import {
  AddAccount,
  AddAccountParams,
  AddAccountRepository,
  Hasher,
  AccountModel,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountParams): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account) {
      return null
    }
    const hashedPassword = await this.encrypter.hash(accountData.password)
    return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
  }
}
