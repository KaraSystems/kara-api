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
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
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
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('name'))
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
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
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
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
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
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    it('should return 400 if an invalid email is provided', async () => {
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
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    it('should call EmailValidator with correct email', async () => {
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
      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('gaara@areia.com')
    })

    it('should return 500 if EmailValidator throws', async () => {
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
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
  })
  describe('when i have valid parameters', () => {
    it('should call AddAccount', async () => {
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
      await sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        name: 'Gaara',
        email: 'gaara@areia.com',
        password: 'gaara123'
      })
    })

    it('should return 500 if AddAccount throws', async () => {
      const { sut, addAccountStub } = makeSut()
      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(new Error()))
      })
      const httpRequest = {
        body: {
          name: 'Gaara',
          email: 'gaara@areia.com',
          password: 'gaara123',
          passwordConfirmation: 'gaara123'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    it('should return 200 and create a new Account', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'valid_name',
          email: 'valid_email@gmail.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body).toEqual({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      })
    })
  })
})
