import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

export interface SaveSurveyResultRepository {
  save: (suveyData: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
