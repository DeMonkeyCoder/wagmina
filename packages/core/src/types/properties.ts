import type { Config, Connector } from '../createConfig.js'

export type NetworkIdParameter<
  config extends Config,
  networkId extends
    | config['chains'][number]['id']
    | undefined = config['chains'][number]['id'],
> = {
  networkId?:
    | (networkId extends config['chains'][number]['id'] ? networkId : undefined)
    | config['chains'][number]['id']
    | undefined
}

export type ConnectorParameter = {
  connector?: Connector | undefined
}

export type ScopeKeyParameter = { scopeKey?: string | undefined }

export type SyncConnectedChainParameter = {
  syncConnectedChain?: boolean | undefined
}
