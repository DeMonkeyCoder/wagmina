import type { CaipNetworkId, ChainNamespace } from '@reown/appkit-common'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'
import { lightnet } from 'vimina/chains'

export const minaLightnet: AppKitNetwork & {
  id: string
} = defineChain({
  id: lightnet.id,
  name: lightnet.name,
  nativeCurrency: lightnet.nativeCurrency,
  rpcUrls: lightnet.rpcUrls as any,
  blockExplorers: lightnet.blockExplorers,
  testnet: false,
  chainNamespace: 'mina' as ChainNamespace,
  caipNetworkId: 'mina:testnet' as CaipNetworkId,
  deprecatedCaipNetworkId: 'mina:testnet',
})
