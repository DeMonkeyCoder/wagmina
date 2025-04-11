import type { CaipNetworkId, ChainNamespace } from '@reown/appkit-common'
import { defineChain } from '@reown/appkit/networks'
import { devnet } from 'vimina/chains'
import type { WagminaAppKitNetwork } from '../types/network'

export const minaDevnet: WagminaAppKitNetwork = defineChain({
  id: devnet.id,
  name: devnet.name,
  nativeCurrency: devnet.nativeCurrency,
  rpcUrls: devnet.rpcUrls,
  blockExplorers: devnet.blockExplorers,
  testnet: true,
  chainNamespace: 'mina' as ChainNamespace,
  caipNetworkId: 'mina:devnet' as CaipNetworkId,
  deprecatedCaipNetworkId: 'mina:devnet',
})
