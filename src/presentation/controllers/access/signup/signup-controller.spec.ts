import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { SignUpController } from './signup-controller'
import { HttpRequest } from '@/presentation/protocols'
import faker from 'faker'

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('should return 403 if AddAcounts returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.accountModule = null as any

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.token }))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const error = faker.random.word()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError(error))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError(error)))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
