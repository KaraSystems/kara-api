import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel } from '@/domain/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}
describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const spyLoadBySurveyId = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.load('any_survey_id')

    expect(spyLoadBySurveyId).toHaveBeenCalledWith('any_survey_id')
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const promise = sut.load('any_survey_id')

    await expect(promise).rejects.toThrow()
  })

  it('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.load('any_survey_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
