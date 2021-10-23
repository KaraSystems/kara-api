import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (suveyData: AddSurveyParams) => Promise<void>
}
