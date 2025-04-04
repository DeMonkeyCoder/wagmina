'use client'

import {
  type Config,
  type GetChainsReturnType,
  type ResolvedRegister,
  getChains,
} from '@wagmina/core'
import { watchChains } from '@wagmina/core/internal'
import { useSyncExternalStore } from 'react'

import type { ConfigParameter } from '../types/properties.js'
import { useConfig } from './useConfig.js'

export type UseChainsParameters<config extends Config = Config> =
  ConfigParameter<config>

export type UseChainsReturnType<config extends Config = Config> =
  GetChainsReturnType<config>

export function useChains<config extends Config = ResolvedRegister['config']>(
  parameters: UseChainsParameters<config> = {},
): UseChainsReturnType<config> {
  const config = useConfig(parameters)

  return useSyncExternalStore(
    (onChange) => watchChains(config, { onChange }),
    () => getChains(config),
    () => getChains(config),
  )
}
