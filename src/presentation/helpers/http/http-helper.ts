import { ServerError, UnauthorizedError } from '../../errors'
import { HttpRespose } from '../../protocols/http'

export const badRequest = (error: Error): HttpRespose => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpRespose => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (error: Error): HttpRespose => ({
  statusCode: 500,
  body: new ServerError(error.stack as string)
})

export const ok = (data: any): HttpRespose => ({
  statusCode: 200,
  body: data
})
