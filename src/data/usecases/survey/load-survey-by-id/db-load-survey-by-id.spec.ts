import { DbLoadSurveyById } from './db-load-survey-by-id-protocols'
import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

let surveyId: string

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.random.uuid()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()

    await sut.loadById(surveyId)

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should return Survey when calls with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()

    const survey = await sut.loadById(surveyId)

    expect(survey).toEqual(loadSurveyByIdRepositorySpy.surveyModel)
  })

  it('should throw if LoadSurveyByIdRepository throw', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValueOnce(new Error())

    const promise = sut.loadById(surveyId)

    await expect(promise).rejects.toThrow()
  })
})
