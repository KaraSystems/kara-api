import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers/http/http-helper'
import { HttpRespose } from '@/presentation/protocols'
import { Controller, HttpRequest, LoadSurveyById } from './save-survey-result-controller.protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }

    return ok(survey)
  }
}
