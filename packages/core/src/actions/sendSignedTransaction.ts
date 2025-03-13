import type {
  SendSignedTransactionErrorType as vimina_SendSignedTransactionErrorType,
  SendSignedTransactionParameters as vimina_SendSignedTransactionParameters,
  SendSignedTransactionReturnType as vimina_SendSignedTransactionReturnType,
} from 'vimina'
import { sendSignedTransaction as vimina_sendSignedTransaction } from 'vimina/actions'

import type { Config } from '../createConfig.js'
import type { BaseErrorType, ErrorType } from '../errors/base.js'
import type { NetworkIdParameter } from '../types/properties.js'
import type { Compute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'
import type { GetConnectorClientErrorType } from './getConnectorClient.js'

export type SendSignedTransactionParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  vimina_SendSignedTransactionParameters & NetworkIdParameter<config, networkId>
>

export type SendSignedTransactionReturnType =
  vimina_SendSignedTransactionReturnType

export type SendSignedTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // vimina
  | vimina_SendSignedTransactionErrorType

export async function sendSignedTransaction<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  { networkId, ...rest }: SendSignedTransactionParameters<config, networkId>,
): Promise<SendSignedTransactionReturnType> {
  const client = config.getClient({ networkId })
  const action = getAction(
    client,
    // @ts-ignore
    vimina_sendSignedTransaction,
    'sendSignedTransaction',
  )
  const hash = await action({
    ...(rest as any),
  })

  // return hash
  return hash as SendSignedTransactionReturnType
}
