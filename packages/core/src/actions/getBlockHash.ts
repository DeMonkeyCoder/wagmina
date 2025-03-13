import {
  type GetBlockHashErrorType as vimina_GetBlockHashErrorType,
  type GetBlockHashParameters as vimina_GetBlockHashParameters,
  type GetBlockHashReturnType as vimina_GetBlockHashReturnType,
  getBlockHash as vimina_getBlockHash,
} from 'vimina/actions'

import type { Config } from '../createConfig.js'
import type { NetworkIdParameter } from '../types/properties.js'
import type { Compute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'

export type GetBlockHashParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  vimina_GetBlockHashParameters & NetworkIdParameter<config, networkId>
>

export type GetBlockHashReturnType = vimina_GetBlockHashReturnType

export type GetBlockHashErrorType = vimina_GetBlockHashErrorType

export function getBlockHash<
  config extends Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  config: config,
  parameters: GetBlockHashParameters<config, networkId> = {},
): Promise<GetBlockHashReturnType> {
  const { networkId, ...rest } = parameters
  const client = config.getClient({ networkId })
  const action = getAction(client, vimina_getBlockHash, 'getBlockHash')
  return action(rest)
}
