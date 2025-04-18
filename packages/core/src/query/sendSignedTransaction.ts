import type { MutateOptions, MutationOptions } from '@tanstack/query-core'

import {
  type SendSignedTransactionErrorType,
  type SendSignedTransactionParameters,
  type SendSignedTransactionReturnType,
  sendSignedTransaction,
} from '../actions/sendSignedTransaction.js'
import type { Config } from '../createConfig.js'
import type { Compute } from '../types/utils.js'

export function sendSignedTransactionMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return sendSignedTransaction(config, variables)
    },
    mutationKey: ['sendSignedTransaction'],
  } as const satisfies MutationOptions<
    SendSignedTransactionData,
    SendSignedTransactionErrorType,
    SendSignedTransactionVariables<config, config['chains'][number]['id']>
  >
}

export type SendSignedTransactionData = Compute<SendSignedTransactionReturnType>

export type SendSignedTransactionVariables<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = SendSignedTransactionParameters<config, chainId>

export type SendSignedTransactionMutate<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SendSignedTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SendSignedTransactionData,
          SendSignedTransactionErrorType,
          Compute<SendSignedTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => void

export type SendSignedTransactionMutateAsync<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SendSignedTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SendSignedTransactionData,
          SendSignedTransactionErrorType,
          Compute<SendSignedTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => Promise<SendSignedTransactionData>
