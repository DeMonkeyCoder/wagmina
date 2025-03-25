import type { CaipNetworkId, ChainNamespace } from '@reown/appkit-common'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'
import { mainnet } from 'vimina/chains'

export const minaMainnet: AppKitNetwork & {
  id: string
} = defineChain({
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
