import type { CaipNetworkId, ChainNamespace } from '@reown/appkit-common'
import { defineChain } from '@reown/appkit/networks'
import { lightnet } from 'vimina/chains'
import type { WagminaAppKitNetwork } from '../types/network'

export const minaLightnet: WagminaAppKitNetwork = defineChain({
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
