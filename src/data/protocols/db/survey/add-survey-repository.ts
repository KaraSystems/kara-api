import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (suveyData: AddSurveyModel) => Promise<void>
}
