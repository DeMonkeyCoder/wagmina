'use client'

import {
  type Config,
  type GetClientParameters,
  type GetClientReturnType,
  type ResolvedRegister,
  getClient,
  watchClient,
} from '@wagmina/core'
import type { Compute } from '@wagmina/core/internal'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector.js'

import type { ConfigParameter } from '../types/properties.js'
import { useConfig } from './useConfig.js'

export type UseClientParameters<
  config extends Config = Config,
  networkId extends config['chains'][number]['id'] | string | undefined =
    | config['chains'][number]['id']
    | undefined,
> = Compute<GetClientParameters<config, networkId> & ConfigParameter<config>>

export type UseClientReturnType<
  config extends Config = Config,
  networkId extends config['chains'][number]['id'] | string | undefined =
    | config['chains'][number]['id']
    | undefined,
> = GetClientReturnType<config, networkId>

export function useClient<
  config extends Config = ResolvedRegister['config'],
  networkId extends config['chains'][number]['id'] | string | undefined =
    | config['chains'][number]['id']
    | undefined,
>(
  parameters: UseClientParameters<config, networkId> = {},
): UseClientReturnType<config, networkId> {
  const config = useConfig(parameters)

  return useSyncExternalStoreWithSelector(
    (onChange) => watchClient(config, { onChange }),
    () => getClient(config, parameters),
    () => getClient(config, parameters),
    (x) => x,
    (a, b) => a?.uid === b?.uid,
  ) as any
}
