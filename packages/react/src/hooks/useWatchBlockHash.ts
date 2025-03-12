'use client'

import {
  type Config,
  type ResolvedRegister,
  type WatchBlockHashParameters,
  watchBlockHash,
} from '@wagmi/core'
import type { UnionCompute, UnionExactPartial } from '@wagmi/core/internal'
import { useEffect } from 'react'

import type { ConfigParameter, EnabledParameter } from '../types/properties.js'
import { useConfig } from './useConfig.js'
import { useNetworkId } from './useNetworkId.js'

export type UseWatchBlockHashParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = UnionCompute<
  UnionExactPartial<WatchBlockHashParameters<config, networkId>> &
    ConfigParameter<config> &
    EnabledParameter
>

export type UseWatchBlockHashReturnType = void

/** https://wagmi.sh/react/api/hooks/useWatchBlockHash */
export function useWatchBlockHash<
  config extends Config = ResolvedRegister['config'],
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parameters: UseWatchBlockHashParameters<config, networkId> = {} as any,
): UseWatchBlockHashReturnType {
  const { enabled = true, onBlockHash, config: _, ...rest } = parameters

  const config = useConfig(parameters)
  const configNetworkId = useNetworkId({ config })
  const networkId = parameters.networkId ?? configNetworkId

  // TODO(react@19): cleanup
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
  useEffect(() => {
    if (!enabled) return
    if (!onBlockHash) return
    return watchBlockHash(config, {
      ...(rest as any),
      networkId,
      onBlockHash,
    })
  }, [
    networkId,
    config,
    enabled,
    onBlockHash,
    ///
    rest.onError,
    rest.emitMissed,
    rest.emitOnBegin,
    rest.poll,
    rest.pollingInterval,
    rest.syncConnectedChain,
  ])
}
