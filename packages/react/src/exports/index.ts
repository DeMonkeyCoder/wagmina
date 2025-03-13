////////////////////////////////////////////////////////////////////////////////
// Context
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type WagminaProviderProps,
  WagminaContext,
  WagminaProvider,
} from '../context.js'

////////////////////////////////////////////////////////////////////////////////
// Errors
////////////////////////////////////////////////////////////////////////////////

export { type BaseErrorType, BaseError } from '../errors/base.js'

export {
  type WagminaProviderNotFoundErrorType,
  WagminaProviderNotFoundError,
} from '../errors/context.js'

////////////////////////////////////////////////////////////////////////////////
// Hooks
////////////////////////////////////////////////////////////////////////////////

export {
  type UseAccountParameters,
  type UseAccountReturnType,
  useAccount,
} from '../hooks/useAccount.js'

export {
  type UseAccountEffectParameters,
  useAccountEffect,
} from '../hooks/useAccountEffect.js'

export {
  type UseBalanceParameters,
  type UseBalanceReturnType,
  useBalance,
} from '../hooks/useBalance.js'

export {
  type UseBlockHashParameters,
  type UseBlockHashReturnType,
  useBlockHash,
} from '../hooks/useBlockHash.js'

export {
  type UseFetchAccountParameters,
  type UseFetchAccountReturnType,
  useFetchAccount,
} from '../hooks/useFetchAccount.js'

export {
  type UseNetworkIdParameters,
  type UseNetworkIdReturnType,
  useNetworkId,
} from '../hooks/useNetworkId.js'

export {
  type UseChainsParameters,
  type UseChainsReturnType,
  useChains,
} from '../hooks/useChains.js'

export {
  type UseClientParameters,
  type UseClientReturnType,
  useClient,
} from '../hooks/useClient.js'

export {
  type UseConfigParameters,
  type UseConfigReturnType,
  useConfig,
} from '../hooks/useConfig.js'

export {
  type UseConnectParameters,
  type UseConnectReturnType,
  useConnect,
} from '../hooks/useConnect.js'

export {
  type UseConnectionsParameters,
  type UseConnectionsReturnType,
  useConnections,
} from '../hooks/useConnections.js'

export {
  type UseConnectorsParameters,
  type UseConnectorsReturnType,
  useConnectors,
} from '../hooks/useConnectors.js'

export {
  type UseConnectorClientParameters,
  type UseConnectorClientReturnType,
  useConnectorClient,
} from '../hooks/useConnectorClient.js'

export {
  type UseDisconnectParameters,
  type UseDisconnectReturnType,
  useDisconnect,
} from '../hooks/useDisconnect.js'

export {
  type UsePublicClientParameters,
  type UsePublicClientReturnType,
  usePublicClient,
} from '../hooks/usePublicClient.js'

export {
  type UseReconnectParameters,
  type UseReconnectReturnType,
  useReconnect,
} from '../hooks/useReconnect.js'

export {
  type UseSendTransactionParameters,
  type UseSendTransactionReturnType,
  useSendTransaction,
} from '../hooks/useSendTransaction.js'

export {
  type UseSendSignedTransactionParameters,
  type UseSendSignedTransactionReturnType,
  useSendSignedTransaction,
} from '../hooks/useSendSignedTransaction.js'

export {
  type UseSignDelegationTransactionParameters,
  type UseSignDelegationTransactionReturnType,
  useSignDelegationTransaction,
} from '../hooks/useSignDelegationTransaction.js'

export {
  type UseSignPaymentTransactionParameters,
  type UseSignPaymentTransactionReturnType,
  useSignPaymentTransaction,
} from '../hooks/useSignPaymentTransaction.js'

export {
  type UseSignZkappTransactionParameters,
  type UseSignZkappTransactionReturnType,
  useSignZkappTransaction,
} from '../hooks/useSignZkappTransaction.js'

export {
  type UseSwitchAccountParameters,
  type UseSwitchAccountReturnType,
  useSwitchAccount,
} from '../hooks/useSwitchAccount.js'

export {
  type UseSwitchChainParameters,
  type UseSwitchChainReturnType,
  useSwitchChain,
} from '../hooks/useSwitchChain.js'

export {
  type UseTransactionCountParameters,
  type UseTransactionCountReturnType,
  useTransactionCount,
} from '../hooks/useTransactionCount.js'

export {
  type UseWalletClientParameters,
  type UseWalletClientReturnType,
  useWalletClient,
} from '../hooks/useWalletClient.js'

export {
  type UseWatchBlockHashParameters,
  type UseWatchBlockHashReturnType,
  useWatchBlockHash,
} from '../hooks/useWatchBlockHash.js'

////////////////////////////////////////////////////////////////////////////////
// Hydrate
////////////////////////////////////////////////////////////////////////////////

export { type HydrateProps, Hydrate } from '../hydrate.js'

////////////////////////////////////////////////////////////////////////////////
// @wagmina/core
////////////////////////////////////////////////////////////////////////////////

export {
  // Config
  type Connection,
  type Connector,
  type Config,
  type CreateConfigParameters,
  type State,
  createConfig,
  // Connector
  type ConnectorEventMap,
  type CreateConnectorFn,
  createConnector,
  // Errors
  type ChainNotConfiguredErrorType,
  ChainNotConfiguredError,
  type ConnectorAlreadyConnectedErrorType,
  ConnectorAlreadyConnectedError,
  type ConnectorNotFoundErrorType,
  ConnectorNotFoundError,
  type ConnectorAccountNotFoundErrorType,
  ConnectorAccountNotFoundError,
  type ProviderNotFoundErrorType,
  ProviderNotFoundError,
  type SwitchChainNotSupportedErrorType,
  SwitchChainNotSupportedError,
  // Storage
  type CreateStorageParameters,
  type Storage,
  createStorage,
  noopStorage,
  // Transports
  custom,
  fallback,
  http,
  webSocket,
  unstable_connector,
  // Types
  type Register,
  type ResolvedRegister,
  // Utilities
  cookieStorage,
  cookieToInitialState,
  deepEqual,
  deserialize,
  normalizeNetworkId,
  parseCookie,
  serialize,
} from '@wagmina/core'

////////////////////////////////////////////////////////////////////////////////
// Version
////////////////////////////////////////////////////////////////////////////////

export { version } from '../version.js'
