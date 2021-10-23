import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Controller, HttpRequest, HttpRespose } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LogControllerDecorator } from './log-contoller-decorator'
import { mockAccountModel } from '@/domain/test'
import { mockLogErrorRepository } from '@/data/test'

const makeFakeServerError = (): HttpRespose => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'Gaara',
    email: 'gaara@areia.com',
    password: 'gaara123',
    passwordConfirmation: 'gaara123'
  }
})

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
      return Promise.resolve(ok(mockAccountModel()))
    }
  }
  return new ControllerStub()
}

type SuTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SuTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
