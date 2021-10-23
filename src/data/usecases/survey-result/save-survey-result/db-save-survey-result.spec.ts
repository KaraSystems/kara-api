import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { mockSaveSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel, mockSurveyResultParams } from '@/domain/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = mockSurveyResultParams()

    await sut.save(surveyResultData)

    expect(addSpy).toHaveBeenCalledWith(surveyResultData)
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSurveyResultParams())

    await expect(promise).rejects.toThrow()
  })

  it('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(mockSurveyResultParams())

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
