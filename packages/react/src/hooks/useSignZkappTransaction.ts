'use client'

import { useMutation } from '@tanstack/react-query'
import type {
  Config,
  ResolvedRegister,
  SignTransactionErrorType,
} from '@wagmi/core'
import type { Compute } from '@wagmi/core/internal'
import {
  type SignZkappTransactionData,
  type SignZkappTransactionMutate,
  type SignZkappTransactionMutateAsync,
  type SignZkappTransactionVariables,
  signZkappTransactionMutationOptions,
} from '@wagmi/core/query'

import type { ConfigParameter } from '../types/properties.js'
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from '../utils/query.js'
import { useConfig } from './useConfig.js'

export type UseSignZkappTransactionParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SignZkappTransactionData,
          SignTransactionErrorType,
          SignZkappTransactionVariables<config, config['chains'][number]['id']>,
          context
        >
      | undefined
  }
>

export type UseSignZkappTransactionReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SignZkappTransactionData,
    SignTransactionErrorType,
    SignZkappTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    signTransaction: SignZkappTransactionMutate<config, context>
    signTransactionAsync: SignZkappTransactionMutateAsync<config, context>
  }
>

/** https://wagmi.sh/react/api/hooks/useSignTransaction */
export function useSignZkappTransaction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: UseSignZkappTransactionParameters<config, context> = {},
): UseSignZkappTransactionReturnType<config, context> {
  const { mutation } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signZkappTransactionMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  })

  type Return = UseSignZkappTransactionReturnType<config, context>
  return {
    ...result,
    signTransaction: mutate as Return['signTransaction'],
    signTransactionAsync: mutateAsync as Return['signTransactionAsync'],
  }
}
