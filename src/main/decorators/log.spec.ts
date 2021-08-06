import { Controller, HttpRequest, HttpRespose } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SuiTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
      const httpResponse: HttpRespose = {
        statusCode: 200,
        body: {
          name: 'Gaara'
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SuiTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'Gaara',
        email: 'gaara@areia.com',
        password: 'gaara123',
        passwordConfirmation: 'gaara123'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'Gaara',
        email: 'gaara@areia.com',
        password: 'gaara123',
        passwordConfirmation: 'gaara123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Gaara'
      }
    })
  })
})
