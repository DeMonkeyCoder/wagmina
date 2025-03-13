'use client'

import { useQueryClient } from '@tanstack/react-query'
import type {
  Config,
  GetConnectorClientErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import type { Compute, Omit } from '@wagmi/core/internal'
import {
  type GetConnectorClientData,
  type GetConnectorClientOptions,
  type GetConnectorClientQueryFnData,
  type GetConnectorClientQueryKey,
  getConnectorClientQueryOptions,
} from '@wagmi/core/query'
import { useEffect, useRef } from 'react'

import type { ConfigParameter } from '../types/properties.js'
import {
  type UseQueryParameters,
  type UseQueryReturnType,
  useQuery,
} from '../utils/query.js'
import { useAccount } from './useAccount.js'
import { useConfig } from './useConfig.js'
import { useNetworkId } from './useNetworkId.js'

export type UseConnectorClientParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, networkId>,
> = Compute<
  GetConnectorClientOptions<config, networkId> &
    ConfigParameter<config> & {
      query?:
        | Compute<
            Omit<
              UseQueryParameters<
                GetConnectorClientQueryFnData<config, networkId>,
                GetConnectorClientErrorType,
                selectData,
                GetConnectorClientQueryKey<config, networkId>
              >,
              'gcTime' | 'staleTime'
            >
          >
        | undefined
    }
>

export type UseConnectorClientReturnType<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, networkId>,
> = UseQueryReturnType<selectData, GetConnectorClientErrorType>

export function useConnectorClient<
  config extends Config = ResolvedRegister['config'],
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, networkId>,
>(
  parameters: UseConnectorClientParameters<config, networkId, selectData> = {},
): UseConnectorClientReturnType<config, networkId, selectData> {
  const { query = {}, ...rest } = parameters

  const config = useConfig(rest)
  const queryClient = useQueryClient()
  const { address, connector, status } = useAccount({ config })
  const networkId = useNetworkId({ config })

  const { queryKey, ...options } = getConnectorClientQueryOptions<
    config,
    networkId
  >(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
    connector: parameters.connector ?? connector,
  })
  const enabled = Boolean(
    (status === 'connected' || status === 'reconnecting') &&
      (query.enabled ?? true),
  )

  const addressRef = useRef(address)
  // biome-ignore lint/correctness/useExhaustiveDependencies: `queryKey` not required
  useEffect(() => {
    const previousAddress = addressRef.current
    if (!address && previousAddress) {
      // remove when account is disconnected
      queryClient.removeQueries({ queryKey })
      addressRef.current = undefined
    } else if (address !== previousAddress) {
      // invalidate when address changes
      queryClient.invalidateQueries({ queryKey })
      addressRef.current = address
    }
  }, [address, queryClient])

  return useQuery({
    ...query,
    ...options,
    queryKey,
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
