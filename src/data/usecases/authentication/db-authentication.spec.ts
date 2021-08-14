import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/bd-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'Gaara',
  email: 'gaara@areia.com',
  password: 'hash_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel | null> {
      const account: AccountModel = makeFakeAccount()
      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'gaara@areia.com',
  password: 'gara@123'
})

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  }
}
describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('gaara@areia.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(comparerSpy).toHaveBeenCalledWith('gara@123', 'hash_password')
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
