import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveysSpy } from '@/presentation/test'
import MockDate from 'mockdate'
import { HttpRequest } from '@/presentation/protocols'
import faker from 'faker'

const mockRequest = (): HttpRequest => ({ accountId: faker.random.uuid() })

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId)
  })

  it('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveyModels))
  })

  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveyModels = []

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(noContent())
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
