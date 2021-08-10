import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return new MissingParamError('field')
  }
}

const makeSut = (validationStub: ValidationStub): ValidationComposite => {
  return new ValidationComposite([validationStub])
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const validationStub = new ValidationStub()
    const sut = makeSut(validationStub)
    const error = sut.validate({ name: 'Gaara' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
