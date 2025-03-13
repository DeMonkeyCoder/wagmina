import type { Chain } from 'vimina'
import {
  type FetchAccountErrorType as viem_FetchAccountErrorType,
  type FetchAccountParameters as viem_FetchAccountParameters,
  type FetchAccountReturnType as viem_FetchAccountReturnType,
  fetchAccount as viem_fetchAccount,
} from 'vimina/actions'

import type { Config } from '../createConfig.js'
import type { SelectChains } from '../types/chain.js'
import type { NetworkIdParameter } from '../types/properties.js'
import type { Compute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'

export type FetchAccountParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  chains extends readonly Chain[] = SelectChains<config, networkId>,
> = Compute<
  {
    [key in keyof chains]: Compute<
      viem_FetchAccountParameters<chains[key], chains[key]> &
        NetworkIdParameter<config, networkId>
    >
  }[number]
>

export type FetchAccountErrorType = viem_FetchAccountErrorType

export type FetchAccountReturnType = viem_FetchAccountReturnType

/** https://wagmi.sh/core/api/actions/fetchAccount */
export async function fetchAccount<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: FetchAccountParameters<config, networkId>,
): Promise<FetchAccountReturnType> {
  const { address, networkId } = parameters

  const client = config.getClient({ networkId })
  const action = getAction(client, viem_fetchAccount, 'fetchAccount')

  const chain = config.chains.find((x) => x.id === networkId) ?? client.chain!
  return action({
    address,
    chain,
  })
}
