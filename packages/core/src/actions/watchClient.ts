import type { Config } from '../createConfig.js'
import { type GetClientReturnType, getClient } from './getClient.js'

export type WatchClientParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = {
  onChange(
    publicClient: GetClientReturnType<config, networkId>,
    prevClient: GetClientReturnType<config, networkId>,
  ): void
}

export type WatchClientReturnType = () => void

export function watchClient<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: WatchClientParameters<config, networkId>,
): WatchClientReturnType {
  const { onChange } = parameters
  return config.subscribe(
    () => getClient(config) as GetClientReturnType<config, networkId>,
    onChange,
    {
      equalityFn(a, b) {
        return a?.uid === b?.uid
      },
    },
  )
}
