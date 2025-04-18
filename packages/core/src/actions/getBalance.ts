import {
  type GetBalanceErrorType as vimina_GetBalanceErrorType,
  type GetBalanceParameters as vimina_GetBalanceParameters,
  getBalance as vimina_getBalance,
} from 'vimina/actions'

import type { Config } from '../createConfig.js'
import type { NetworkIdParameter } from '../types/properties.js'
import type { Compute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'

export type GetBalanceParameters<config extends Config = Config> = Compute<
  NetworkIdParameter<config> & vimina_GetBalanceParameters
>

export type GetBalanceReturnType = bigint

export type GetBalanceErrorType = vimina_GetBalanceErrorType

export async function getBalance<config extends Config>(
  config: config,
  parameters: GetBalanceParameters<config>,
): Promise<GetBalanceReturnType> {
  const { address, tokenId, networkId } = parameters

  const client = config.getClient({ networkId })
  const action = getAction(client, vimina_getBalance, 'getBalance')
  return action({ address, tokenId })
}
