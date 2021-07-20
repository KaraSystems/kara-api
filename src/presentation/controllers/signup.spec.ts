import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      name: 'Gaara',
      email: 'gaara@areia.com',
      password: 'gaara123',
      passwordConfirmation: 'gaara123 '
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
