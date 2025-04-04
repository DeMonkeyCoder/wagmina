import type { CaipNetworkId, ChainNamespace } from '@reown/appkit-common'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks'
import { devnet } from 'vimina/chains'

export const minaDevnet: AppKitNetwork & {
  id: string
} = defineChain({
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
