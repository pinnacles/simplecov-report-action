import {createHash} from 'crypto'

export const encryptSha256 = (val: string): string => {
  const hash = createHash('sha256')
  hash.update(val)
  return hash.digest('hex')
}
