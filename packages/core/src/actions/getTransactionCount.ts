import {
  type GetTransactionCountErrorType as vimina_GetTransactionCountErrorType,
  type GetTransactionCountParameters as vimina_GetTransactionCountParameters,
  type GetTransactionCountReturnType as vimina_GetTransactionCountReturnType,
  getTransactionCount as vimina_getTransactionCount,
} from 'vimina/actions'

import type { Config } from '../createConfig.js'
import type { NetworkIdParameter } from '../types/properties.js'
import type { Compute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'

export type GetTransactionCountParameters<config extends Config = Config> =
  Compute<NetworkIdParameter<config> & vimina_GetTransactionCountParameters>

export type GetTransactionCountReturnType = vimina_GetTransactionCountReturnType

export type GetTransactionCountErrorType = vimina_GetTransactionCountErrorType

export async function getTransactionCount<config extends Config>(
  config: config,
  parameters: GetTransactionCountParameters<config>,
): Promise<GetTransactionCountReturnType> {
  const { address, blockNumber, blockTag, networkId } = parameters

  const client = config.getClient({ networkId })
  const action = getAction(
    client,
    vimina_getTransactionCount,
    'getTransactionCount',
  )
  return action(blockNumber ? { address, blockNumber } : { address, blockTag })
}
