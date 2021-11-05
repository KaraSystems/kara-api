import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import faker from 'faker'

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: faker.random.uuid(),
    question: faker.random.words(),
    answers: [{
      answer: faker.random.words()
    }, {
      answer: faker.random.words(),
      image: faker.image.imageUrl()
    }],
    date: faker.date.recent()
  }
}

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.words()
  }, {
    answer: faker.random.word()
  }],
  date: faker.date.recent()
})
