import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpRespose, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys.length) {
        return ok(surveys)
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
