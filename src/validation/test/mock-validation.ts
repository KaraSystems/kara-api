import { Validation } from '@/presentation/protocols'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): null {
      return null
    }
  }
  return new ValidationStub()
}
