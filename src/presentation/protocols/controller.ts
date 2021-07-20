import { HttpRequest, HttpRespose } from './http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => HttpRespose
}
