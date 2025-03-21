import {
  type WatchBlockHashParameters as vimina_WatchBlockHashParameters,
  type WatchBlockHashReturnType as vimina_WatchBlockHashReturnType,
  watchBlockHash as vimina_watchBlockHash,
} from 'vimina/actions'

import type { Chain, Transport, WebSocketTransport } from 'vimina'
import type { Config } from '../createConfig.js'
import type { SelectChains } from '../types/chain.js'
import type {
  NetworkIdParameter,
  SyncConnectedChainParameter,
} from '../types/properties.js'
import type { UnionCompute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'

export type WatchBlockHashParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>,
> = {
  [key in keyof chains]: UnionCompute<
    vimina_WatchBlockHashParameters<
      config['_internal']['transports'][chains[key]['id']] extends infer transport extends
        Transport
        ? Transport extends transport
          ? WebSocketTransport
          : transport
        : WebSocketTransport
    > &
      NetworkIdParameter<config, networkId> &
      SyncConnectedChainParameter
  >
}[number]

export type WatchBlockHashReturnType = vimina_WatchBlockHashReturnType

// TODO: wrap in vimina's `observe` to avoid duplicate invocations.
export function watchBlockHash<
  config extends Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  config: config,
  parameters: WatchBlockHashParameters<config, networkId>,
): WatchBlockHashReturnType {
  const { syncConnectedChain = config._internal.syncConnectedChain, ...rest } =
    parameters as WatchBlockHashParameters

  let unwatch: WatchBlockHashReturnType | undefined
  const listener = (networkId: string | undefined) => {
    if (unwatch) unwatch()

    const client = config.getClient({ networkId })
    const action = getAction(client, vimina_watchBlockHash, 'watchBlockHash')
    unwatch = action(rest as vimina_WatchBlockHashParameters)
    return unwatch
  }

  // set up listener for block number changes
  const unlisten = listener(parameters.networkId)

  // set up subscriber for connected chain changes
  let unsubscribe: (() => void) | undefined
  if (syncConnectedChain && !parameters.networkId)
    unsubscribe = config.subscribe(
      ({ networkId }) => networkId,
      async (networkId) => listener(networkId),
    )

  return () => {
    unlisten?.()
    unsubscribe?.()
  }
}
