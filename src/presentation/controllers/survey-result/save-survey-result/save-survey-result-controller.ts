import { ok } from '@/presentation/helpers/http/http-helper'
import { HttpRespose } from '@/presentation/protocols'
import { Controller, HttpRequest, LoadSurveyById } from './save-survey-result-controller.protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
    const test = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    return ok(test)
  }
}
