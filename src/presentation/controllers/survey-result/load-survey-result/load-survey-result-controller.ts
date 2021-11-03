import { ok } from '@/presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpRespose,
  LoadSurveyById
} from './load-survey-result-controller.protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { }

  async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    return Promise.resolve(ok(null))
  }
}
