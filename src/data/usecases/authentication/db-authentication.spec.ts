import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'Gaara',
  email: 'gaara@areia.com',
  password: 'gara@123'
})

const makeLoadAccountByEmailRepository = (): LoadAccountEmailRepository => {
  class LoadAccountEmailRepositoryStub implements LoadAccountEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountEmailRepositoryStub()
}

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'gaara@areia.com',
  password: 'gara@123'
})

interface SutTypes {
  sut: DbAuthentication
  loadAccountEmailRepositoryStub: LoadAccountEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountEmailRepositoryStub)
  return {
    sut,
    loadAccountEmailRepositoryStub
  }
}
describe('DbAuthentication UseCase', () => {
  it(' should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('gaara@areia.com')
  })
})
