'use client'

import { useMutation } from '@tanstack/react-query'
import type { Connector, ReconnectErrorType } from '@wagmina/core'
import type { Compute } from '@wagmina/core/internal'
import {
  type ReconnectData,
  type ReconnectMutate,
  type ReconnectMutateAsync,
  type ReconnectVariables,
  reconnectMutationOptions,
} from '@wagmina/core/query'

import type { ConfigParameter } from '../types/properties.js'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query.js'
import { useConfig } from './useConfig.js'

export type UseReconnectParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | UseMutationParameters<
          ReconnectData,
          ReconnectErrorType,
          ReconnectVariables,
          context
        >
      | undefined
  }
>

export type UseReconnectReturnType<context = unknown> = Compute<
  UseMutationReturnType<
    ReconnectData,
    ReconnectErrorType,
    ReconnectVariables,
    context
  > & {
    connectors: readonly Connector[]
    reconnect: ReconnectMutate<context>
    reconnectAsync: ReconnectMutateAsync<context>
  }
>

export function useReconnect<context = unknown>(
  parameters: UseReconnectParameters<context> = {},
): UseReconnectReturnType<context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = reconnectMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  return {
    ...result,
    connectors: config.connectors,
    reconnect: mutate,
    reconnectAsync: mutateAsync,
  }
}
