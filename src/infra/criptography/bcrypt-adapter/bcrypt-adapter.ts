import bcrypt from 'bcrypt'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt)
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
