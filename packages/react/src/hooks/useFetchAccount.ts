'use client'

import type {
  Config,
  FetchAccountErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import type { Compute } from '@wagmi/core/internal'
import type { FetchAccountQueryFnData } from '@wagmi/core/query'
import {
  type FetchAccountData,
  type FetchAccountOptions,
  type FetchAccountQueryKey,
  fetchAccountQueryOptions,
} from '@wagmi/core/query'

import type { ConfigParameter, QueryParameter } from '../types/properties.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useConfig } from './useConfig.js'
import { useInvalidateOnBlock } from './useInvalidateOnBlock.js'
import { useNetworkId } from './useNetworkId.js'

export type UseFetchAccountParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = FetchAccountData,
> = Compute<
  FetchAccountOptions<config, networkId> &
    ConfigParameter<config> &
    QueryParameter<
      FetchAccountQueryFnData,
      FetchAccountErrorType,
      selectData,
      FetchAccountQueryKey<config, networkId>
    > & {
      watch?: boolean
    }
>

export type UseFetchAccountReturnType<selectData = FetchAccountData> =
  UseQueryReturnType<selectData, FetchAccountErrorType>

export function useFetchAccount<
  config extends Config = ResolvedRegister['config'],
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = FetchAccountData,
>(
  parameters: UseFetchAccountParameters<
    config,
    networkId,
    selectData
  > = {} as UseFetchAccountParameters<config, networkId, selectData>,
): UseFetchAccountReturnType<selectData> {
  const { address, watch, query = {} } = parameters

  const config = useConfig(parameters)
  const networkId = useNetworkId({ config })

  const options = fetchAccountQueryOptions(
    config as config,
    {
      ...parameters,
      networkId: parameters.chain?.id ?? networkId,
    } as FetchAccountOptions<config, networkId>,
  )
  const enabled = Boolean(address && (query.enabled ?? true))

  const fetchAccountQuery = useQuery({ ...query, ...options, enabled })

  useInvalidateOnBlock({
    networkId,
    enabled: Boolean(enabled && watch),
    queryKey: fetchAccountQuery.queryKey,
  })

  return fetchAccountQuery
}
