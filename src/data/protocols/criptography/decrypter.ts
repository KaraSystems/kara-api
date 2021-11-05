import { JwtPayload } from 'jsonwebtoken'

export interface Decrypter {
  decrypt: (ciphertext: string) => Promise<string | null | JwtPayload>
}
