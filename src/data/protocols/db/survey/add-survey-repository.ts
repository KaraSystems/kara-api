import { AddSurveyModel } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (suveyData: AddSurveyModel) => Promise<void>
}
