import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if mongodb is down', async () => {
    let accountConllection = await sut.getCollection('accounts')
    expect(accountConllection).toBeTruthy()
    await sut.disconnect()
    accountConllection = await sut.getCollection('accounts')
    expect(accountConllection).toBeTruthy()
  })
})
