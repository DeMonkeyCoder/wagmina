'use client'

import type { Config, ResolvedRegister } from '@wagmina/core'
import { useContext } from 'react'

import { WagminaContext } from '../context.js'
import { WagminaProviderNotFoundError } from '../errors/context.js'
import type { ConfigParameter } from '../types/properties.js'

export type UseConfigParameters<config extends Config = Config> =
  ConfigParameter<config>

export type UseConfigReturnType<config extends Config = Config> = config

export function useConfig<config extends Config = ResolvedRegister['config']>(
  parameters: UseConfigParameters<config> = {},
): UseConfigReturnType<config> {
  const config = parameters.config ?? useContext(WagminaContext)
  if (!config) throw new WagminaProviderNotFoundError()
  return config as UseConfigReturnType<config>
}
