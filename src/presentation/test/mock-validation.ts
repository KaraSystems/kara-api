import { Validation } from '../protocols'

export class ValidationSpy implements Validation {
  input: any

  validate (input: any): Error | null {
    this.input = input
    return null
  }
}
