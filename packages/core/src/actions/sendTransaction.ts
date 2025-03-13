import type {
  Account,
  Chain,
  Client,
  SendTransactionErrorType as vimina_SendTransactionErrorType,
  SendTransactionParameters as vimina_SendTransactionParameters,
  SendTransactionReturnType as vimina_SendTransactionReturnType,
} from 'vimina'
import { sendTransaction as vimina_sendTransaction } from 'vimina/actions'

import type { Config } from '../createConfig.js'
import type { BaseErrorType, ErrorType } from '../errors/base.js'
import type { SelectChains } from '../types/chain.js'
import type {
  ConnectorParameter,
  NetworkIdParameter,
} from '../types/properties.js'
import type { Compute } from '../types/utils.js'
import { getAction } from '../utils/getAction.js'
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from './getConnectorClient.js'

export type SendTransactionParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
  ///
  chains extends readonly Chain[] = SelectChains<config, networkId>,
> = Compute<
  {
    [key in keyof chains]: Compute<
      vimina_SendTransactionParameters<chains[key], Account, chains[key]> &
        NetworkIdParameter<config, networkId> &
        ConnectorParameter
    >
  }[number]
>

export type SendTransactionReturnType = vimina_SendTransactionReturnType

export type SendTransactionErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // vimina
  | vimina_SendTransactionErrorType

export async function sendTransaction<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: SendTransactionParameters<config, networkId>,
): Promise<SendTransactionReturnType> {
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
  const action = getAction(client, vimina_sendTransaction, 'sendTransaction')
  const hash = await action({
    ...(rest as any),
    ...(account ? { account } : {}),
    chain: networkId ? { id: networkId } : null,
    // gas: rest.gas ?? undefined,
  })

  // return hash
  return hash as SendTransactionReturnType
}
