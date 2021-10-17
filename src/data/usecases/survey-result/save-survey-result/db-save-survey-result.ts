import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import {
  SaveSurveyResult,
  SaveSurveyResultModel,
  SurveyResultModel
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const survey = await this.saveSurveyResultRepository.save(data)
    return survey
  }
}
