import { MissingParamError } from '../errors/missing-param-error'
import { BadRequest } from '../helpers/http-helper'
import { HttpRequest, HttpRespose } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpRespose {
    if (!httpRequest.body.name) {
      return BadRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return BadRequest(new MissingParamError('email'))
    }
    return BadRequest(new MissingParamError('else'))
  }
}
