import { ok } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpRespose, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
    await this.validation.validate(httpRequest.body)
    return await Promise.resolve(ok(null))
  }
}
