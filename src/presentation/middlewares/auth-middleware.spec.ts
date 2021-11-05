import { HttpRequest } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadAccountByTokenSpy } from '@/presentation/test'
import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '@/presentation/errors'
import faker from 'faker'

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.random.uuid
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('Auth Middleware', () => {
  it('Shoul return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Shoul call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.headers['x-access-token'])
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  it('Shoul return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.accountModel = null as any

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Shoul return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({
      accountId: loadAccountByTokenSpy.accountModel.id
    }))
  })

  it('Shoul return 500 if LoadAccountByToken returns throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
