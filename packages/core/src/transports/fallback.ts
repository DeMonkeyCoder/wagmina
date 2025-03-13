import { fallback as vimina_fallback } from 'vimina'

import type { Transport } from '../createConfig.js'

export function fallback(
  transports: Transport[],
  config?: Parameters<typeof vimina_fallback>[1],
) {
  return vimina_fallback(transports, config)
}
