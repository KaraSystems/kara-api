import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '@/presentation/errors'
import { ValidationSpy } from '@/presentation/test'
import faker from 'faker'

const field = faker.random.word()

type SutTypes = {
  sut: ValidationComposite
  validationStubs: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError(field))

    const error = sut.validate({ [field]: faker.random.word() })

    expect(error).toEqual(new MissingParamError(field))
  })

  it('should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError(field))

    const error = sut.validate({ [field]: faker.random.word() })

    expect(error).toEqual(new Error())
  })

  it('should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ [field]: faker.random.word() })

    expect(error).toBeFalsy()
  })
})
