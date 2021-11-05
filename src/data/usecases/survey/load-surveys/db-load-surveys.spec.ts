import { LoadSurveysRepositorySpy } from '@/data/test'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)

  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositorySpy, 'loadAll')

    await sut.load()

    expect(loadAllSpy).toHaveBeenCalled()
  })

  it('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()

    const surveys = await sut.load()

    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels)
  })

  it('should throw if LoadSurveysRepository throw', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockRejectedValueOnce(new Error())

    const promise = sut.load()

    await expect(promise).rejects.toThrow()
  })
})
