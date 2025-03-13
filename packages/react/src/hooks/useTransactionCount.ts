'use client'

import type {
  Config,
  GetTransactionCountErrorType,
  ResolvedRegister,
} from '@wagmina/core'
import type { Compute } from '@wagmina/core/internal'
import type { GetTransactionCountQueryFnData } from '@wagmina/core/query'
import {
  type GetTransactionCountData,
  type GetTransactionCountOptions,
  type GetTransactionCountQueryKey,
  getTransactionCountQueryOptions,
} from '@wagmina/core/query'

import type { ConfigParameter, QueryParameter } from '../types/properties.js'
import { type UseQueryReturnType, useQuery } from '../utils/query.js'
import { useConfig } from './useConfig.js'
import { useInvalidateOnBlock } from './useInvalidateOnBlock.js'
import { useNetworkId } from './useNetworkId.js'

export type UseTransactionCountParameters<
  config extends Config = Config,
  selectData = GetTransactionCountData,
> = Compute<
  GetTransactionCountOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionCountQueryFnData,
      GetTransactionCountErrorType,
      selectData,
      GetTransactionCountQueryKey<config>
    > & {
      watch?: boolean
    }
>

export type UseTransactionCountReturnType<
  selectData = GetTransactionCountData,
> = UseQueryReturnType<selectData, GetTransactionCountErrorType>

export function useTransactionCount<
  config extends Config = ResolvedRegister['config'],
  selectData = GetTransactionCountData,
>(
  parameters: UseTransactionCountParameters<config, selectData> = {},
): UseTransactionCountReturnType<selectData> {
  const { address, watch, query = {} } = parameters

  const config = useConfig(parameters)
  const networkId = useNetworkId({ config })

  const options = getTransactionCountQueryOptions(config, {
    ...parameters,
    networkId: parameters.networkId ?? networkId,
  })
  const enabled = Boolean(address && (query.enabled ?? true))

  const transactionCountQuery = useQuery({ ...query, ...options, enabled })

  useInvalidateOnBlock({
    networkId,
    enabled: Boolean(enabled && watch),
    queryKey: transactionCountQuery.queryKey,
  })

  return transactionCountQuery
}
