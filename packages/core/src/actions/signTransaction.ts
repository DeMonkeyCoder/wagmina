import type {
  Account,
  Chain,
  Client,
  TransactionType,
  SignTransactionErrorType as vimina_SignTransactionErrorType,
  SignTransactionParameters as vimina_SignTransactionParameters,
  SignTransactionReturnType as vimina_SignTransactionReturnType,
} from 'vimina'
import { signTransaction as vimina_signTransaction } from 'vimina/actions'

import type { Config } from '../createConfig.js'
import type { BaseErrorType, ErrorType } from '../errors/base.js'
import type { SelectChains } from '../types/chain.js'
import type {
  ConnectorParameter,
  NetworkIdParameter,
} from '../types/properties.js'
import type { Compute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'
import { getAccount } from './getAccount.js'
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from './getConnectorClient.js'
import { getTransactionCount } from './getTransactionCount.js'

export type SignTransactionParameters<
  transactionType extends TransactionType,
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>,
> = {
  [key in keyof chains]: Compute<
    vimina_SignTransactionParameters<
      transactionType,
      chains[key],
      Account,
      chains[key]
    > &
      NetworkIdParameter<config, networkId> &
      ConnectorParameter
  >
}[number]

export type SignTransactionReturnType<transactionType extends TransactionType> =
  vimina_SignTransactionReturnType<transactionType>

export type SignTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // vimina
  | vimina_SignTransactionErrorType

export async function signTransaction<
  config extends Config,
  networkId extends config['chains'][number]['id'],
  parameters extends SignTransactionParameters<
    TransactionType,
    config,
    networkId
  > = SignTransactionParameters<TransactionType, config, networkId>,
>(
  config: config,
  parameters: parameters,
): Promise<SignTransactionReturnType<parameters['type']>> {
  const { account, networkId, connector, ...rest } = parameters

  let client: Client
  if (typeof account === 'object' && account?.type === 'local')
    client = config.getClient({ networkId })
  else
    client = await getConnectorClient(config, {
      account: account ?? undefined,
      networkId,
      connector,
    })

  // @ts-ignore
  const action = getAction(client, vimina_signTransaction, 'signTransaction')

  // TODO: remove this nonce parameter injection after Pallad supports optional nonce
  const txParameters = { ...(rest as any) }
  const address = account
    ? typeof account === 'string'
      ? account
      : account.address
    : (await getAccount(config)).address
  const nonce = String(
    (txParameters.type === 'zkapp'
      ? txParameters.feePayer?.nonce
      : txParameters.nonce) ??
      (await getTransactionCount(config, { address: address! })),
  )
  if (txParameters.type === 'zkapp') {
    txParameters.feePayer = {
      ...txParameters.feePayer,
      publicKey: txParameters.feePayer.publicKey ?? address,
      nonce,
    }
  } else {
    txParameters.nonce = nonce
  }

  return action({
    ...(txParameters as any),
    ...(account ? { account } : {}),
    chain: networkId ? { id: networkId } : null,
    // gas: rest.gas ?? undefined,
  }) as SignTransactionReturnType<parameters['type']>
}
