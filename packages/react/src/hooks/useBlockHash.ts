'use client'

import { useQueryClient } from '@tanstack/react-query'
import type {
  Config,
  GetBlockHashErrorType,
  ResolvedRegister,
} from '@wagmina/core'
import type {
  Compute,
  UnionCompute,
  UnionStrictOmit,
} from '@wagmina/core/internal'
import {
  type GetBlockHashData,
  type GetBlockHashOptions,
  type GetBlockHashQueryFnData,
  type GetBlockHashQueryKey,
  getBlockHashQueryOptions,
} from '@wagmina/core/query'

import type { ConfigParameter, QueryParameter } from '../types/properties.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useConfig } from './useConfig.js'
import { useNetworkId } from './useNetworkId.js'
import {
  type UseWatchBlockHashParameters,
  useWatchBlockHash,
} from './useWatchBlockHash.js'

export type UseBlockHashParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockHashData,
> = Compute<
  GetBlockHashOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      GetBlockHashQueryFnData,
      GetBlockHashErrorType,
      selectData,
      GetBlockHashQueryKey<config, networkId>
    > & {
      watch?:
        | boolean
        | UnionCompute<
            UnionStrictOmit<
              UseWatchBlockHashParameters<config, networkId>,
              'networkId' | 'config' | 'onBlockHash' | 'onError'
            >
          >
        | undefined
    }
>

export type UseBlockHashReturnType<selectData = GetBlockHashData> =
  UseQueryReturnType<selectData, GetBlockHashErrorType>

export function useBlockHash<
  config extends Config = ResolvedRegister['config'],
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockHashData,
>(
  parameters: UseBlockHashParameters<config, networkId, selectData> = {},
): UseBlockHashReturnType<selectData> {
  const { query = {}, watch } = parameters

  const config = useConfig(parameters)
  const queryClient = useQueryClient()
  const configNetworkId = useNetworkId({ config })
  const networkId = parameters.networkId ?? configNetworkId

  const options = getBlockHashQueryOptions(config, {
    ...parameters,
    networkId,
  })

  useWatchBlockHash({
    ...({
      config: parameters.config,
      networkId: parameters.networkId,
      ...(typeof watch === 'object' ? watch : {}),
    } as UseWatchBlockHashParameters),
    enabled: Boolean(
      (query.enabled ?? true) &&
        (typeof watch === 'object' ? watch.enabled : watch),
    ),
    onBlockHash(blockNumber) {
      queryClient.setQueryData(options.queryKey, blockNumber)
    },
  })

  return useQuery({ ...query, ...options })
}
