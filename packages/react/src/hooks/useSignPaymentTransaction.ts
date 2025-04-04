'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ResolvedRegister,
  SignTransactionErrorType,
} from '@wagmina/core'
import type { Compute } from '@wagmina/core/internal'
import {
  type SignPaymentTransactionData,
  type SignPaymentTransactionMutate,
  type SignPaymentTransactionMutateAsync,
  type SignPaymentTransactionVariables,
  signPaymentTransactionMutationOptions,
} from '@wagmina/core/query'

import type { ConfigParameter } from '../types/properties.js'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query.js'
import { useConfig } from './useConfig.js'

export type UseSignPaymentTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignPaymentTransactionData,
          SignTransactionErrorType,
          SignPaymentTransactionVariables<
            config,
            config['chains'][number]['id']
          >,
          context
        >
      | undefined
  }
>

export type UseSignPaymentTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignPaymentTransactionData,
    SignTransactionErrorType,
    SignPaymentTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignPaymentTransactionMutate<config, context>
    signTransactionAsync: SignPaymentTransactionMutateAsync<config, context>
  }
>

export function useSignPaymentTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSignPaymentTransactionParameters<config, context> = {},
): UseSignPaymentTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signPaymentTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSignPaymentTransactionReturnType<config, context>
  return {
    ...result,
    signTransaction: mutate as Return['signTransaction'],
    signTransactionAsync: mutateAsync as Return['signTransactionAsync'],
  }
}
