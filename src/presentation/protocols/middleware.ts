import { HttpRequest, HttpRespose } from './http'

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpRespose>
}
