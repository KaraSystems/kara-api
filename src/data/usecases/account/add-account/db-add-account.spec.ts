import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test/mock-account'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/data/test'

type SubType = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SubType => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.accountModel = null as any
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct plaintext', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(hasherSpy.plaintext).toBe(addAccountParams.password)
  })

  it('should throw if Hasher throw', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    })
  })

  it('should throw if AddAccountRepository throw', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()

    const account = await sut.add(mockAccountModel())

    expect(account).toEqual(addAccountRepositorySpy.accountModel)
  })

  it('should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()

    const account = await sut.add(mockAddAccountParams())

    expect(account).toBeNull()
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })
})
