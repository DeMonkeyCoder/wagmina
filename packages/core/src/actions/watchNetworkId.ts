import type { Config } from '../createConfig.js'
import type { GetNetworkIdReturnType } from './getNetworkId.js'

export type WatchNetworkIdParameters<config extends Config = Config> = {
  onChange(
    networkId: GetNetworkIdReturnType<config>,
    prevNetworkId: GetNetworkIdReturnType<config>,
  ): void
}

export type WatchNetworkIdReturnType = () => void

export function watchNetworkId<config extends Config>(
  config: config,
  parameters: WatchNetworkIdParameters<config>,
): WatchNetworkIdReturnType {
  const { onChange } = parameters
  return config.subscribe((state) => state.networkId, onChange)
}
