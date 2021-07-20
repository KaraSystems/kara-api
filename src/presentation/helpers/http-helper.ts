import { HttpRespose } from '../protocols/http'

export const BadRequest = (error: Error): HttpRespose => ({
  statusCode: 400,
  body: error
})
