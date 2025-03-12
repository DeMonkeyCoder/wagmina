'use client'

import {
  type Config,
  type GetNetworkIdReturnType,
  type ResolvedRegister,
  getNetworkId,
  watchNetworkId,
} from '@wagmi/core'
import { useSyncExternalStore } from 'react'

import type { ConfigParameter } from '../types/properties.js'
import { useConfig } from './useConfig.js'

export type UseNetworkIdParameters<config extends Config = Config> =
  ConfigParameter<config>

export type UseNetworkIdReturnType<config extends Config = Config> =
  GetNetworkIdReturnType<config>

/** https://wagmi.sh/react/api/hooks/useNetworkId */
export function useNetworkId<
  config extends Config = ResolvedRegister['config'],
>(
  parameters: UseNetworkIdParameters<config> = {},
): UseNetworkIdReturnType<config> {
  const config = useConfig(parameters)

  return useSyncExternalStore(
    (onChange) => watchNetworkId(config, { onChange }),
    () => getNetworkId(config),
    () => getNetworkId(config),
  )
}
