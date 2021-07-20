export class SignUpController {
  handle (httpRequest: any): any {
    return {
      statusCode: 401,
      body: new Error('Missing-par am: name')
    }
  }
}
