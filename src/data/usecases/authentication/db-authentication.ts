import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountEmailRepository
  constructor (loadAccountByEmailRepository: LoadAccountEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return ''
  }
}
