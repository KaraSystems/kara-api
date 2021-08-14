import { AccountModel } from '../../domain/models/account'

export interface LoadAccountEmailRepository {
  load: (email: string) => Promise<AccountModel>
}
