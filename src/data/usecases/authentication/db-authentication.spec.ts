import { AccountModel } from '../../../domain/models/account'
import { LoadAccountEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  it(' should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountEmailRepositoryStub implements LoadAccountEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gara@123'
        }
        return await new Promise(resolve => resolve(account))
      }
    }

    const loadAccountEmailRepositoryStub = new LoadAccountEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'gaara@areia.com',
      password: 'gara@123'
    })
    expect(loadSpy).toHaveBeenCalledWith('gaara@areia.com')
  })
})
