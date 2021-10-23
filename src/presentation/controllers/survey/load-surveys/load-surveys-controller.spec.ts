import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import { mockLoadSurveys } from '@/presentation/test'
import { mockSurveyModels } from '@/domain/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })

  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(noContent())
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
