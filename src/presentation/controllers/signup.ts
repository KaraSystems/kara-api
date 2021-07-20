import { MissingParamError } from '../errors/missing-param-error'
import { BadRequest } from '../helpers/http-helper'
import { HttpRequest, HttpRespose } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpRespose {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParamError(field))
      }
    }
    return BadRequest(new MissingParamError('else'))
  }
}
