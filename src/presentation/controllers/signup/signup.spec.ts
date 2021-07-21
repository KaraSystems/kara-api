import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  describe('when I have invalid parameters', () => {
    it('should return 400 if no name is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    it('should return 400 if no email is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    it('should return 400 if no password is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    it('should return 400 if password confirmation fails', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'invalid_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    it('should return 400 if no password confirmation is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    it('should return 400 if an invalid email is provided', () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'invalid_email@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    it('should call EmailValidator with correct email', () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('gaara@areia.com')
    })

    it('should return 500 if EmailValidator throws', () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
  })
  describe('when i have valid parameters', () => {
    it('should call AddAccount', () => {
      const { sut, addAccountStub } = makeSut()
      const addSpy = jest.spyOn(addAccountStub, 'add')
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        name: 'Gaara',
        email: 'gaara@areia.com',
        password: 'gaara123'
      })
    })

    it('should return 500 if AddAccount throws', () => {
      const { sut, addAccountStub } = makeSut()
      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
  })
})
