import { LoadSurveyResultRepository, SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel, mockSurveyResultParams } from '@/domain/test'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
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

  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const surveyResultData = mockSurveyResultParams()

    await sut.save(surveyResultData)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
  })

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSurveyResultParams())

    await expect(promise).rejects.toThrow()
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
