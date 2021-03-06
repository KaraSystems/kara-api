import { DbLoadAccountByToken } from './db-load-account-by-token'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/test'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

let token: string
let role: string

describe('DbLoadAccountByToken Usecase', () => {
  beforeEach(() => {
    token = faker.random.uuid()
    role = faker.random.word()
  })

  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load(token, role)

    expect(decrypterSpy.ciphertext).toBe(token)
  })

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null as any
    const account = await sut.load(token, role)

    expect(account).toBeNull()
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()

    await sut.load(token, role)

    expect(loadAccountByTokenRepositorySpy.token).toBe(token)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
  })

  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.accountModel = null as any

    const account = await sut.load(token, role)

    expect(account).toBeNull()
  })

  it('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()

    const account = await sut.load(token, role)

    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel)
  })

  it('should throw if Decrypter throw', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockRejectedValueOnce(new Error())

    const account = await sut.load(token, role)

    expect(account).toBeNull()
  })

  it('should throw if LoadAccountByTokenRepository throw', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockRejectedValueOnce(new Error())

    const promise = sut.load(token, role)

    await expect(promise).rejects.toThrow()
  })
})
