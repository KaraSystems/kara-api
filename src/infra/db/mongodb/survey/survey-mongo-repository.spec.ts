import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    it('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_questions',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({ question: 'any_questions' })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('Should load all survey on success', async () => {
      await surveyCollection.insertMany([{
        question: 'any_questions',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date()
      }, {
        question: 'other_questions',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date()
      }])
      const sut = makeSut()

      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_questions')
      expect(surveys[1].question).toBe('other_questions')
    })

    it('Should load empty list', async () => {
      const sut = makeSut()

      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    it('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_questions',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date()
      })
      const sut = makeSut()

      const surveys = await sut.loadById(res.ops[0]._id)

      expect(surveys.question).toBe('any_questions')
      expect(surveys.id).toBeTruthy()
    })

    it('Should return empty if load survey by id unknown', async () => {
      await surveyCollection.insertOne({
        question: 'any_questions',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date()
      })
      const sut = makeSut()

      const survey = await sut.loadById('616b3888ad4c847d20780dfa')

      expect(survey).toBeNull()
    })
  })
})
