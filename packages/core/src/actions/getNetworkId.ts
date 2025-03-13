import type { Config } from '../createConfig.js'

export type GetNetworkIdReturnType<config extends Config = Config> =
  config['chains'][number]['id']

export function getNetworkId<config extends Config>(
  config: config,
): GetNetworkIdReturnType<config> {
  return config.state.networkId
}
