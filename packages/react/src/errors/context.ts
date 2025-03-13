import { BaseError } from './base.js'

export type WagminaProviderNotFoundErrorType = WagminaProviderNotFoundError & {
  name: 'WagminaProviderNotFoundError'
}
export class WagminaProviderNotFoundError extends BaseError {
  override name = 'WagminaProviderNotFoundError'
  constructor() {
    super('`useConfig` must be used within `WagminaProvider`.', {
      docsPath: '/api/WagminaProvider',
    })
  }
}
