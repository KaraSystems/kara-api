import { RequiredFieldValidation } from '../../presentation/helpers/validation/required-field-validation'
import { Validation } from '../../presentation/helpers/validation/validation'
import { ValidationComposite } from '../../presentation/helpers/validation/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validation/validation-composite.ts')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
