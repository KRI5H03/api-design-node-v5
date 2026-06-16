import bcrypt from 'bcrypt'
import env from '../../env.ts'

export const hashPasswords = async (password: string) => {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS)
}

export const comparePasswords = async (
  pasword: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(pasword, hashedPassword)
}
