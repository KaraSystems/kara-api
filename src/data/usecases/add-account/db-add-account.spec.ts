import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SubType {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SubType => {
  const hasherStub = makeEncripter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'Gaara',
  email: 'gaara@areia.com',
  password: 'gaara123'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'Gaara',
  email: 'gaara@areia.com',
  password: 'gaara123'
})

const makeEncripter = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('gaara123')
  })

  it('should throw if Hasher throw', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Gaara',
      email: 'gaara@areia.com',
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throw', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })
  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
