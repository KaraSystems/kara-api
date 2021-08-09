import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'Gaara',
    email: 'gaara@areia.com',
    password: 'gaara123',
    passwordConfirmation: 'gaara123'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'Kabuto',
  email: 'kabuto@son.com',
  password: 'kabuto123'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  describe('when have invalid parameters', () => {
    it('should return 400 if no name is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    })

    it('should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    it('should return 400 if password confirmation fails', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'invalid_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    })

    it('should return 400 if no password confirmation is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    it('should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
  })

  describe('when have internal server error', () => {
    it('should return 500 if AddAccount throws', async () => {
      const { sut, addAccountStub } = makeSut()
      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(new Error()))
      })
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    it('should return 500 if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })
  })

  describe('when have valid parameters', () => {
    it('should call AddAccount', async () => {
      const { sut, addAccountStub } = makeSut()
      const addSpy = jest.spyOn(addAccountStub, 'add')
      await sut.handle(makeFakeRequest())
      expect(addSpy).toHaveBeenCalledWith({
        name: 'Gaara',
        email: 'gaara@areia.com',
        password: 'gaara123'
      })
    })

    it('should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      await sut.handle(makeFakeRequest())
      expect(isValidSpy).toHaveBeenCalledWith('gaara@areia.com')
    })

    it('should return 200 and create a new Account', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    it('should call Validation with correct value', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeFakeRequest()
      await sut.handle(makeFakeRequest())
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
  })
})
