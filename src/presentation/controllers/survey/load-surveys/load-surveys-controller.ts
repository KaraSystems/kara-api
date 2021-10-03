import { noContent } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpRespose, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpRespose> {
    await this.loadSurveys.load()
    return noContent()
  }
}
