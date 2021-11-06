import { LoadSurveysRepositorySpy } from '@/data/test'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'
import faker from 'faker'

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
    const accountId = faker.random.uuid()

    await sut.load(accountId)

    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  it('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()

    const surveys = await sut.load(faker.random.uuid())

    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels)
  })

  it('should throw if LoadSurveysRepository throw', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()

    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockRejectedValueOnce(new Error())

    const promise = sut.load(faker.random.uuid())

    await expect(promise).rejects.toThrow()
  })
})
