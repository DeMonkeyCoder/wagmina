import type { QueryOptions } from '@tanstack/query-core'
import type { GetChainParameter } from 'vimina'
import {
  type FetchAccountErrorType,
  type FetchAccountParameters,
  type FetchAccountReturnType,
  fetchAccount,
} from '../actions/fetchAccount.js'
import type { Config } from '../createConfig.js'
import type { SelectChains } from '../types/chain.js'
import type { ScopeKeyParameter } from '../types/properties.js'
import type { Compute, PartialBy } from '../types/utils.js'
import { filterQueryOptions } from './utils.js'

export type FetchAccountOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = Compute<
  PartialBy<
    FetchAccountParameters<config, networkId>,
    | 'address'
    | keyof GetChainParameter<
        SelectChains<config, networkId>[number],
        SelectChains<config, networkId>[number]
      >
  > &
    ScopeKeyParameter
>

export function fetchAccountQueryOptions<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  options: FetchAccountOptions<config, networkId> = {} as FetchAccountOptions<
    config,
    networkId
  >,
) {
  return {
    async queryFn({ queryKey }) {
      const { address, scopeKey: _, ...parameters } = queryKey[1]
      if (!address) throw new Error('address is required')
      const account = await fetchAccount(config, {
        ...(parameters as FetchAccountParameters<config, networkId>),
        address,
      })
      return account ?? null
    },
    queryKey: fetchAccountQueryKey(options),
  } as const satisfies QueryOptions<
    FetchAccountQueryFnData,
    FetchAccountErrorType,
    FetchAccountData,
    FetchAccountQueryKey<config, networkId>
  >
}

export type FetchAccountQueryFnData = Compute<FetchAccountReturnType>

export type FetchAccountData = FetchAccountQueryFnData

export function fetchAccountQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  options: FetchAccountOptions<config, networkId> = {} as FetchAccountOptions<
    config,
    networkId
  >,
) {
  return ['fetchAccount', filterQueryOptions(options)] as const
}

export type FetchAccountQueryKey<
  config extends Config,
  networkId extends config['chains'][number]['id'],
> = ReturnType<typeof fetchAccountQueryKey<config, networkId>>
