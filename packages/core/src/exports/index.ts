////////////////////////////////////////////////////////////////////////////////
// Actions
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type ConnectErrorType,
  type ConnectParameters,
  type ConnectReturnType,
  connect,
} from '../actions/connect.js'

export {
  type DisconnectErrorType,
  type DisconnectParameters,
  type DisconnectReturnType,
  disconnect,
} from '../actions/disconnect.js'

export {
  type FetchAccountParameters,
  type FetchAccountReturnType,
  type FetchAccountErrorType,
  fetchAccount,
} from '../actions/fetchAccount.js'

export { type GetAccountReturnType, getAccount } from '../actions/getAccount.js'

export {
  type GetBalanceParameters,
  type GetBalanceReturnType,
  type GetBalanceErrorType,
  getBalance,
  /** @deprecated use `getBalance` instead */
  getBalance as fetchBalance,
} from '../actions/getBalance.js'

export {
  type GetBlockHashErrorType,
  type GetBlockHashParameters,
  type GetBlockHashReturnType,
  getBlockHash,
  /** @deprecated use `getBlockHash` instead */
  getBlockHash as fetchBlockHash,
} from '../actions/getBlockHash.js'

export {
  type GetNetworkIdReturnType,
  getNetworkId,
} from '../actions/getNetworkId.js'

export { type GetChainsReturnType, getChains } from '../actions/getChains.js'

export {
  type GetClientParameters,
  type GetClientReturnType,
  getClient,
} from '../actions/getClient.js'

export {
  type GetConnectionsReturnType,
  getConnections,
} from '../actions/getConnections.js'

export {
  type GetConnectorsReturnType,
  getConnectors,
} from '../actions/getConnectors.js'

export {
  type GetConnectorClientErrorType,
  type GetConnectorClientParameters,
  type GetConnectorClientReturnType,
  getConnectorClient,
} from '../actions/getConnectorClient.js'

export {
  type GetPublicClientParameters,
  type GetPublicClientReturnType,
  getPublicClient,
} from '../actions/getPublicClient.js'

export {
  type GetTransactionCountErrorType,
  type GetTransactionCountParameters,
  type GetTransactionCountReturnType,
  getTransactionCount,
} from '../actions/getTransactionCount.js'

export {
  type GetWalletClientErrorType,
  type GetWalletClientParameters,
  type GetWalletClientReturnType,
  getWalletClient,
} from '../actions/getWalletClient.js'

export {
  type ReconnectErrorType,
  type ReconnectParameters,
  type ReconnectReturnType,
  reconnect,
} from '../actions/reconnect.js'

export {
  type SendTransactionErrorType,
  type SendTransactionParameters,
  type SendTransactionReturnType,
  sendTransaction,
} from '../actions/sendTransaction.js'

export {
  type SendSignedTransactionErrorType,
  type SendSignedTransactionParameters,
  type SendSignedTransactionReturnType,
  sendSignedTransaction,
} from '../actions/sendSignedTransaction.js'

export {
  type SignTransactionErrorType,
  type SignTransactionParameters,
  type SignTransactionReturnType,
  signTransaction,
} from '../actions/signTransaction.js'

export {
  type SwitchAccountErrorType,
  type SwitchAccountParameters,
  type SwitchAccountReturnType,
  switchAccount,
} from '../actions/switchAccount.js'

export {
  type SwitchChainErrorType,
  type SwitchChainParameters,
  type SwitchChainReturnType,
  switchChain,
  /** @deprecated use `switchChain` instead */
  switchChain as switchNetwork,
} from '../actions/switchChain.js'

export {
  type WatchAccountParameters,
  type WatchAccountReturnType,
  watchAccount,
} from '../actions/watchAccount.js'

export {
  type WatchBlockHashParameters,
  type WatchBlockHashReturnType,
  watchBlockHash,
} from '../actions/watchBlockHash.js'

export {
  type WatchNetworkIdParameters,
  type WatchNetworkIdReturnType,
  watchNetworkId,
} from '../actions/watchNetworkId.js'

export {
  type WatchClientParameters,
  type WatchClientReturnType,
  watchClient,
} from '../actions/watchClient.js'

export {
  type WatchConnectionsParameters,
  type WatchConnectionsReturnType,
  watchConnections,
} from '../actions/watchConnections.js'

export {
  type WatchConnectorsParameters,
  type WatchConnectorsReturnType,
  watchConnectors,
} from '../actions/watchConnectors.js'

export {
  type WatchPublicClientParameters,
  type WatchPublicClientReturnType,
  watchPublicClient,
} from '../actions/watchPublicClient.js'

////////////////////////////////////////////////////////////////////////////////
// Connectors
////////////////////////////////////////////////////////////////////////////////

export {
  type ConnectorEventMap,
  type CreateConnectorFn,
  createConnector,
} from '../connectors/createConnector.js'

export { type InjectedParameters, injected } from '../connectors/injected.js'

export { type MockParameters, mock } from '../connectors/mock.js'

////////////////////////////////////////////////////////////////////////////////
// createConfig
////////////////////////////////////////////////////////////////////////////////

export {
  type Connection,
  type Connector,
  type Config,
  type CreateConfigParameters,
  type State,
  type Transport,
  createConfig,
} from '../createConfig.js'

////////////////////////////////////////////////////////////////////////////////
// createStorage
////////////////////////////////////////////////////////////////////////////////

export {
  type CreateStorageParameters,
  type Storage,
  type StorageItemMap,
  createStorage,
  noopStorage,
} from '../createStorage.js'

////////////////////////////////////////////////////////////////////////////////
// Hydrate
////////////////////////////////////////////////////////////////////////////////

export { hydrate } from '../hydrate.js'

////////////////////////////////////////////////////////////////////////////////
// Errors
////////////////////////////////////////////////////////////////////////////////

export { BaseError } from '../errors/base.js'

export {
  type ChainNotConfiguredErrorType,
  ChainNotConfiguredError,
  type ConnectorNotConnectedErrorType,
  ConnectorNotConnectedError,
  type ConnectorAlreadyConnectedErrorType,
  ConnectorAlreadyConnectedError,
  type ConnectorNotFoundErrorType,
  ConnectorNotFoundError,
  type ConnectorAccountNotFoundErrorType,
  ConnectorAccountNotFoundError,
  type ConnectorChainMismatchErrorType,
  ConnectorChainMismatchError,
} from '../errors/config.js'

export {
  type ProviderNotFoundErrorType,
  ProviderNotFoundError,
  type SwitchChainNotSupportedErrorType,
  SwitchChainNotSupportedError,
} from '../errors/connector.js'

////////////////////////////////////////////////////////////////////////////////
// Transports
////////////////////////////////////////////////////////////////////////////////

export { custom, http, webSocket } from 'vimina'

export {
  type ConnectorTransportConfig,
  type ConnectorTransport,
  unstable_connector,
} from '../transports/connector.js'

export { fallback } from '../transports/fallback.js'

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

export { type SelectChains } from '../types/chain.js'

export { type Register, type ResolvedRegister } from '../types/register.js'

////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////

export {
  cookieStorage,
  cookieToInitialState,
  parseCookie,
} from '../utils/cookie.js'

export { deepEqual } from '../utils/deepEqual.js'

export { deserialize } from '../utils/deserialize.js'

export { extractRpcUrls } from '../utils/extractRpcUrls.js'

export { normalizeNetworkId } from '../utils/normalizeNetworkId.js'

export { serialize } from '../utils/serialize.js'

////////////////////////////////////////////////////////////////////////////////
// Version
////////////////////////////////////////////////////////////////////////////////

export { version } from '../version.js'
