'use client'

import type { Config, GetBalanceErrorType, ResolvedRegister } from '@wagmi/core'
import type { Compute } from '@wagmi/core/internal'
import type { GetBalanceQueryFnData } from '@wagmi/core/query'
import {
  type GetBalanceData,
  type GetBalanceOptions,
  type GetBalanceQueryKey,
  getBalanceQueryOptions,
} from '@wagmi/core/query'

import type { ConfigParameter, QueryParameter } from '../types/properties.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useConfig } from './useConfig.js'
import { useInvalidateOnBlock } from './useInvalidateOnBlock.js'
import { useNetworkId } from './useNetworkId.js'

export type UseBalanceParameters<
  config extends Config = Config,
  selectData = GetBalanceData,
> = Compute<
  GetBalanceOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetBalanceQueryFnData,
      GetBalanceErrorType,
      selectData,
      GetBalanceQueryKey<config>
    > & {
      watch?: boolean
    }
>

export type UseBalanceReturnType<selectData = GetBalanceData> =
  UseQueryReturnType<selectData, GetBalanceErrorType>

/** https://wagmi.sh/react/api/hooks/useBalance */
export function useBalance<
  config extends Config = ResolvedRegister['config'],
  selectData = GetBalanceData,
>(
  parameters: UseBalanceParameters<config, selectData> = {},
): UseBalanceReturnType<selectData> {
  const { address, watch, query = {} } = parameters

  const config = useConfig(parameters)
  const networkId = useNetworkId({ config })

  const options = getBalanceQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  })
  const enabled = Boolean(address && (query.enabled ?? true))

  const balanceQuery = useQuery({ ...query, ...options, enabled })

  useInvalidateOnBlock({
    networkId,
    enabled: Boolean(enabled && watch),
    queryKey: balanceQuery.queryKey,
  })

  return balanceQuery
}
