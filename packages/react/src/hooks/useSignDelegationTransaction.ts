'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ResolvedRegister,
  SignTransactionErrorType,
} from '@wagmina/core'
import type { Compute } from '@wagmina/core/internal'
import {
  type SignDelegationTransactionData,
  type SignDelegationTransactionMutate,
  type SignDelegationTransactionMutateAsync,
  type SignDelegationTransactionVariables,
  signDelegationTransactionMutationOptions,
} from '@wagmina/core/query'

import type { ConfigParameter } from '../types/properties.js'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query.js'
import { useConfig } from './useConfig.js'

export type UseSignDelegationTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignDelegationTransactionData,
          SignTransactionErrorType,
          SignDelegationTransactionVariables<
            config,
            config['chains'][number]['id']
          >,
          context
        >
      | undefined
  }
>

export type UseSignDelegationTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignDelegationTransactionData,
    SignTransactionErrorType,
    SignDelegationTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignDelegationTransactionMutate<config, context>
    signTransactionAsync: SignDelegationTransactionMutateAsync<config, context>
  }
>

export function useSignDelegationTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSignDelegationTransactionParameters<config, context> = {},
): UseSignDelegationTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signDelegationTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSignDelegationTransactionReturnType<config, context>
  return {
    ...result,
    signTransaction: mutate as Return['signTransaction'],
    signTransactionAsync: mutateAsync as Return['signTransactionAsync'],
  }
}
