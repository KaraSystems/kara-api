import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpRespose } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
    return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}
