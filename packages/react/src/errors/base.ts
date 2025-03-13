import { BaseError as CoreError } from '@wagmina/core'

import { getVersion } from '../utils/getVersion.js'

export type BaseErrorType = BaseError & { name: 'WagminaError' }

export class BaseError extends CoreError {
  override name = 'WagminaError'

  override get docsBaseUrl() {
    return ''
  }

  override get version() {
    return getVersion()
  }
}
