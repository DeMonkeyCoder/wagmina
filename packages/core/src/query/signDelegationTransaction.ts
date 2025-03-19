import type { MutateOptions, MutationOptions } from '@tanstack/query-core'
import {
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from '../actions/signTransaction.js'
import type { Config } from '../createConfig.js'
import type { Compute } from '../types/utils.js'

export function signDelegationTransactionMutationOptions<config extends Config>(
  config: config,
) {
  return {
    mutationFn(variables) {
      return signTransaction(config, {
        ...variables,
        type: 'delegation',
      } as SignTransactionParameters<
        'delegation',
        config,
        config['chains'][number]['id']
      >)
    },
    mutationKey: ['signTransaction'],
  } as const satisfies MutationOptions<
    SignDelegationTransactionData,
    SignTransactionErrorType,
    SignDelegationTransactionVariables<config, config['chains'][number]['id']>
  >
}

export type SignDelegationTransactionData = Compute<
  SignTransactionReturnType<'delegation'>
>

export type SignDelegationTransactionVariables<
  config extends Config,
  chainId extends config['chains'][number]['id'],
> = Omit<SignTransactionParameters<'delegation', config, chainId>, 'type'>

export type SignDelegationTransactionMutate<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SignDelegationTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SignDelegationTransactionData,
          SignTransactionErrorType,
          Compute<SignDelegationTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => void

export type SignDelegationTransactionMutateAsync<
  config extends Config,
  context = unknown,
> = <chainId extends config['chains'][number]['id']>(
  variables: SignDelegationTransactionVariables<config, chainId>,
  options?:
    | Compute<
        MutateOptions<
          SignDelegationTransactionData,
          SignTransactionErrorType,
          Compute<SignDelegationTransactionVariables<config, chainId>>,
          context
        >
      >
    | undefined,
) => Promise<SignDelegationTransactionData>
