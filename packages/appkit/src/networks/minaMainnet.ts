import type { CaipNetworkId, ChainNamespace } from '@reown/appkit-common'
import { defineChain } from '@reown/appkit/networks'
import { mainnet } from 'vimina/chains'
import type { WagminaAppKitNetwork } from '../types/network'

export const minaMainnet: WagminaAppKitNetwork = defineChain({
  id: mainnet.id,
  name: mainnet.name,
  nativeCurrency: mainnet.nativeCurrency,
  rpcUrls: mainnet.rpcUrls,
  blockExplorers: mainnet.blockExplorers,
  testnet: false,
  chainNamespace: 'mina' as ChainNamespace,
  caipNetworkId: 'mina:mainnet' as CaipNetworkId,
  deprecatedCaipNetworkId: 'mina:mainnet',
})
