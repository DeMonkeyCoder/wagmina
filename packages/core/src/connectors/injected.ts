import {
  type Address,
  type JSAPIStandardProvider,
  type ProviderConnectInfo,
  type ProviderRpcError,
  ResourceUnavailableRpcError,
  type RpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getAddress,
  withRetry,
  withTimeout,
} from 'vimina'

import type { Connector } from '../createConfig.js'
import { ChainNotConfiguredError } from '../errors/config.js'
import { ProviderNotFoundError } from '../errors/connector.js'
import type { Compute } from '../types/utils.js'
import { createConnector } from './createConnector.js'

export type InjectedParameters = {
  /**
   * Some injected providers do not support programmatic disconnect.
   * This flag simulates the disconnect behavior by keeping track of connection status in storage.
   * @default true
   */
  shimDisconnect?: boolean | undefined
  /**
   * [JavaScriptAPIStandard] Mina Provider to target
   */
  target?: TargetId | Target | (() => Target | undefined) | undefined
  unstable_shimAsyncInject?: boolean | number | undefined
}

// Regex of wallets/providers that can accurately simulate contract calls & display contract revert reasons.
const supportsSimulationIdRegex = /(rabby|trustwallet)/

injected.type = 'injected' as const

export function injected(parameters: InjectedParameters = {}) {
  const { shimDisconnect = true, unstable_shimAsyncInject } = parameters

  function getTarget(): Compute<Target & { id: string }> {
    const target = parameters.target
    if (typeof target === 'function') {
      const result = target()
      if (result) return result
    }
    if (typeof target === 'object') {
      if (target.id === 'co.pallad' && typeof target.provider === 'object') {
        return {
          ...target,
          provider: {
            ...target.provider,
            request: async (...args) =>
              // @ts-ignore
              (await target.provider.request(...args)).result,
          },
        }
      }
      return target
    }

    return {
      id: 'injected',
      name: 'Injected',
      provider(window) {
        return window?.mina
      },
    }
  }

  type Provider = WalletProvider | undefined
  type Properties = {
    onConnect(connectInfo: ProviderConnectInfo): void
  }
  type StorageItem = {
    [_ in 'injected.connected' | `${string}.disconnected`]: true
  }

  let accountsChanged: Connector['onAccountsChanged'] | undefined
  let chainChanged: Connector['onChainChanged'] | undefined
  let connect: Connector['onConnect'] | undefined
  let disconnect: Connector['onDisconnect'] | undefined

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    get icon() {
      return getTarget().icon
    },
    get id() {
      return getTarget().id
    },
    get name() {
      return getTarget().name
    },
    get supportsSimulation() {
      return supportsSimulationIdRegex.test(this.id.toLowerCase())
    },
    type: injected.type,
    async setup() {
      const provider = await this.getProvider()
      // Only start listening for events if `target` is set, otherwise `injected()` will also receive events
      if (provider && parameters.target) {
        if (!connect) {
          connect = this.onConnect.bind(this)
          provider.on('connect', connect)
        }

        // We shouldn't need to listen for `'accountsChanged'` here since the `'connect'` event should suffice (and wallet shouldn't be connected yet).
        // Some wallets, like MetaMask, do not implement the `'connect'` event and overload `'accountsChanged'` instead.
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this)
          provider.on('accountsChanged', accountsChanged)
        }
      }
    },
    async connect({ networkId, isReconnecting } = {}) {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()

      let accounts: readonly Address[] = []
      if (isReconnecting) accounts = await this.getAccounts().catch(() => [])
      // else if (shimDisconnect) {
      //   // Attempt to show another prompt for selecting account if `shimDisconnect` flag is enabled
      //   try {
      //     const permissions = await provider.request({
      //       method: 'wallet_requestPermissions',
      //       params: [{ mina_accounts: {} }],
      //     })
      //     accounts = (permissions[0]?.caveats?.[0]?.value as string[])?.map(
      //       (x) => getAddress(x),
      //     )
      //     // `'wallet_requestPermissions'` can return a different order of accounts than `'mina_accounts'`
      //     // switch to `'mina_accounts'` ordering if more than one account is connected
      //     // https://github.com/DeMonkeyCoder/wagmina/issues/4140
      //     if (accounts.length > 0) {
      //       const sortedAccounts = await this.getAccounts()
      //       accounts = sortedAccounts
      //     }
      //   } catch (err) {
      //     const error = err as RpcError
      //     // Not all injected providers support `wallet_requestPermissions` (e.g. MetaMask iOS).
      //     // Only bubble up error if user rejects request
      //     if (error.code === UserRejectedRequestError.code)
      //       throw new UserRejectedRequestError(error)
      //     // Or prompt is already open
      //     if (error.code === ResourceUnavailableRpcError.code) throw error
      //   }
      // }
      try {
        if (!accounts?.length && !isReconnecting) {
          const requestedAccounts = await provider.request({
            method: 'mina_requestAccounts',
          })
          accounts = requestedAccounts.map((x) => getAddress(x))
        }

        // Manage [JavaScriptAPIStandard] event listeners
        if (connect) {
          provider.removeListener('connect', connect)
          connect = undefined
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this)
          provider.on('accountsChanged', accountsChanged)
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this)
          provider.on('chainChanged', (arg) => {
            // TODO: Remove this hotfix once the method mismatch between wallets is resolved
            let newNetworkId = arg
            if (getTarget().id === 'com.aurowallet') {
              newNetworkId = (arg as any).networkID
            }
            chainChanged?.(newNetworkId.split(':')[1]!)
          })
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this)
          provider.on('disconnect', disconnect)
        }

        // Switch to chain if provided
        let currentNetworkId = await this.getNetworkId()
        if (networkId && currentNetworkId !== networkId) {
          const chain = await this.switchChain!({ networkId }).catch(
            (error) => {
              if (error.code === UserRejectedRequestError.code) throw error
              return { id: currentNetworkId }
            },
          )
          currentNetworkId = chain?.id ?? currentNetworkId
        }

        // Remove disconnected shim if it exists
        if (shimDisconnect)
          await config.storage?.removeItem(`${this.id}.disconnected`)

        // Add connected shim if no target exists
        if (!parameters.target)
          await config.storage?.setItem('injected.connected', true)

        return { accounts, networkId: currentNetworkId }
      } catch (err) {
        const error = err as RpcError
        if (error.code === UserRejectedRequestError.code)
          throw new UserRejectedRequestError(error)
        if (error.code === ResourceUnavailableRpcError.code)
          throw new ResourceUnavailableRpcError(error)
        throw error
      }
    },
    async disconnect() {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()

      // Manage [JavaScriptAPIStandard] event listeners
      if (chainChanged) {
        provider.removeListener('chainChanged', chainChanged)
        chainChanged = undefined
      }
      if (disconnect) {
        provider.removeListener('disconnect', disconnect)
        disconnect = undefined
      }
      if (!connect) {
        connect = this.onConnect.bind(this)
        provider.on('connect', connect)
      }

      // Experimental support for MetaMask disconnect
      // https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-2.md
      try {
        // Adding timeout as not all wallets support this method and can hang
        // https://github.com/DeMonkeyCoder/wagmina/issues/4064
        await withTimeout(
          () =>
            // TODO: Remove explicit type for vimina@3
            provider.request<{
              Method: 'wallet_revokePermissions'
              Parameters: [permissions: { mina_accounts: Record<string, any> }]
              ReturnType: null
            }>({
              // `'wallet_revokePermissions'` added in `vimina@2.10.3`
              method: 'wallet_revokePermissions',
              params: [{ mina_accounts: {} }],
            }),
          { timeout: 100 },
        )
      } catch {}

      // Add shim signalling connector is disconnected
      if (shimDisconnect) {
        await config.storage?.setItem(`${this.id}.disconnected`, true)
      }

      if (!parameters.target)
        await config.storage?.removeItem('injected.connected')
    },
    async getAccounts() {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()
      const accounts = await provider.request({ method: 'mina_accounts' })
      return accounts.map((x) => getAddress(x))
    },
    async getNetworkId() {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()
      // TODO: Remove this hotfix once the method mismatch between wallets is resolved
      if (getTarget().id === 'com.aurowallet') {
        const response: string =
          // @ts-ignore
          (await provider.request({ method: 'mina_requestNetwork' })).networkID
            // @ts-ignore
            .split(':')[1]
        return response
      }
      return (await provider.request({ method: 'mina_networkId' })).split(
        ':',
      )[1]!
    },
    async getProvider() {
      if (typeof window === 'undefined') return undefined

      let provider: Provider
      const target = getTarget()
      if (typeof target.provider === 'function')
        provider = target.provider(window as Window | undefined)
      else if (typeof target.provider === 'string')
        provider = findProvider(window, target.provider)
      else provider = target.provider

      // Some wallets do not conform to [JavaScriptAPIStandard]
      if (provider && !provider.removeListener) {
        // Try using `off` handler if it exists, otherwise noop
        if ('off' in provider && typeof provider.off === 'function')
          provider.removeListener =
            provider.off as typeof provider.removeListener
        else provider.removeListener = () => {}
      }

      return provider
    },
    async isAuthorized() {
      try {
        const isDisconnected =
          shimDisconnect &&
          // If shim exists in storage, connector is disconnected
          (await config.storage?.getItem(`${this.id}.disconnected`))
        if (isDisconnected) return false

        // Don't allow injected connector to connect if no target is set and it hasn't already connected
        // (e.g. flag in storage is not set). This prevents a targetless injected connector from connecting
        // automatically whenever there is a targeted connector configured.
        if (!parameters.target) {
          const connected = await config.storage?.getItem('injected.connected')
          if (!connected) return false
        }

        const provider = await this.getProvider()
        if (!provider) {
          if (
            unstable_shimAsyncInject !== undefined &&
            unstable_shimAsyncInject !== false
          ) {
            // If no provider is found, check for async injection
            const handleMina = async () => {
              if (typeof window !== 'undefined')
                window.removeEventListener('mina#initialized', handleMina)
              const provider = await this.getProvider()
              return !!provider
            }
            const timeout =
              typeof unstable_shimAsyncInject === 'number'
                ? unstable_shimAsyncInject
                : 1_000
            const res = await Promise.race([
              ...(typeof window !== 'undefined'
                ? [
                    new Promise<boolean>((resolve) =>
                      window.addEventListener(
                        'mina#initialized',
                        () => resolve(handleMina()),
                        { once: true },
                      ),
                    ),
                  ]
                : []),
              new Promise<boolean>((resolve) =>
                setTimeout(() => resolve(handleMina()), timeout),
              ),
            ])
            if (res) return true
          }

          throw new ProviderNotFoundError()
        }

        // Use retry strategy as some injected wallets (e.g. MetaMask) fail to
        // immediately resolve JSON-RPC requests on page load.
        const accounts = await withRetry(() => this.getAccounts())
        return !!accounts.length
      } catch {
        return false
      }
    },
    async switchChain({ networkId }) {
      const provider = await this.getProvider()
      if (!provider) throw new ProviderNotFoundError()

      const chain = config.chains.find((x) => x.id === networkId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())

      try {
        const caipNetworkId = `mina:${networkId}`
        await Promise.all([
          // TODO: Remove this hotfix once the method mismatch between wallets is resolved
          (getTarget().id === 'com.aurowallet'
            ? provider.request({
                method: 'mina_switchChain',
                params: {
                  // @ts-ignore
                  networkID: caipNetworkId,
                },
              })
            : provider.request({
                method: 'mina_switchChain',
                params: [caipNetworkId],
              })
          )
            // During `'mina_switchChain'`, MetaMask makes a `'net_version'` RPC call to the target chain.
            // If this request fails, MetaMask does not emit the `'chainChanged'` event, but will still switch the chain.
            // To counter this behavior, we request and emit the current chain ID to confirm the chain switch either via
            // this callback or an externally emitted `'chainChanged'` event.
            // https://github.com/MetaMask/metamask-extension/issues/24247
            .then(async () => {
              const currentNetworkId = await this.getNetworkId()
              if (currentNetworkId === networkId)
                config.emitter.emit('change', { networkId })
            }),
          new Promise<void>((resolve) =>
            config.emitter.once('change', ({ networkId: currentNetworkId }) => {
              if (currentNetworkId === networkId) resolve()
            }),
          ),
        ])
        return chain
      } catch (err) {
        const error = err as RpcError

        // Indicates chain is not added to provider
        if (
          error.code === 20004 ||
          // Unwrapping for MetaMask Mobile
          // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
          (error as ProviderRpcError<{ originalError?: { code: number } }>)
            ?.data?.originalError?.code === 20004
        ) {
          try {
            // @ts-ignore
            await provider.request({
              // @ts-ignore
              method: 'mina_addChain',
              // @ts-ignore
              params: { url: chain.rpcUrls.default.http[0], name: chain.id },
            })

            const currentNetworkId = await this.getNetworkId()
            if (currentNetworkId !== networkId)
              throw new UserRejectedRequestError(
                new Error('User rejected switch after adding network.'),
              )

            return chain
          } catch (error) {
            throw new UserRejectedRequestError(error as Error)
          }
        }
        if (
          error.code === UserRejectedRequestError.code ||
          // for AuroWallet
          error.code === 1002
        )
          throw new UserRejectedRequestError(error)
        throw new SwitchChainError(error)
      }
    },
    async onAccountsChanged(accounts) {
      // Disconnect if there are no accounts
      if (accounts.length === 0) this.onDisconnect()
      // Connect if emitter is listening for connect event (e.g. is disconnected and connects through wallet interface)
      else if (config.emitter.listenerCount('connect')) {
        const networkId = (await this.getNetworkId()).toString()
        this.onConnect({ networkId })
        // Remove disconnected shim if it exists
        if (shimDisconnect)
          await config.storage?.removeItem(`${this.id}.disconnected`)
      }
      // Regular change event
      else
        config.emitter.emit('change', {
          accounts: accounts.map((x) => getAddress(x)),
        })
    },
    onChainChanged(networkId) {
      config.emitter.emit('change', { networkId })
    },
    async onConnect(connectInfo) {
      const accounts = await this.getAccounts()
      if (accounts.length === 0) return

      const networkId = connectInfo.networkId
      config.emitter.emit('connect', { accounts, networkId })

      // Manage [JavaScriptAPIStandard] event listeners
      const provider = await this.getProvider()
      if (provider) {
        if (connect) {
          provider.removeListener('connect', connect)
          connect = undefined
        }
        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this)
          provider.on('accountsChanged', accountsChanged)
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this)
          provider.on('chainChanged', (arg) => {
            // TODO: Remove this hotfix once the method mismatch between wallets is resolved
            let newNetworkId = arg
            if (getTarget().id === 'com.aurowallet') {
              newNetworkId = (arg as any).networkID
            }
            chainChanged?.(newNetworkId.split(':')[1]!)
          })
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this)
          provider.on('disconnect', disconnect)
        }
      }
    },
    async onDisconnect(error) {
      const provider = await this.getProvider()

      // If MetaMask emits a `code: 1013` error, wait for reconnection before disconnecting
      // https://github.com/MetaMask/providers/pull/120
      if (error && (error as RpcError<1013>).code === 1013) {
        if (provider && !!(await this.getAccounts()).length) return
      }

      // No need to remove `${this.id}.disconnected` from storage because `onDisconnect` is typically
      // only called when the wallet is disconnected through the wallet's interface, meaning the wallet
      // actually disconnected and we don't need to simulate it.
      config.emitter.emit('disconnect')

      // Manage [JavaScriptAPIStandard] event listeners
      if (provider) {
        if (chainChanged) {
          provider.removeListener('chainChanged', chainChanged)
          chainChanged = undefined
        }
        if (disconnect) {
          provider.removeListener('disconnect', disconnect)
          disconnect = undefined
        }
        if (!connect) {
          connect = this.onConnect.bind(this)
          provider.on('connect', connect)
        }
      }
    },
  }))
}

type Target = {
  icon?: string | undefined
  id: string
  name: string
  provider:
    | WalletProviderFlags
    | WalletProvider
    | ((window?: Window | undefined) => WalletProvider | undefined)
}

/** @deprecated */
type TargetId = Compute<WalletProviderFlags> extends `is${infer name}`
  ? name extends `${infer char}${infer rest}`
    ? `${Lowercase<char>}${rest}`
    : never
  : never

/** @deprecated */
type WalletProviderFlags =
  | 'isAuro'
  | 'isPallad'
  | 'isApexWallet'
  | 'isAvalanche'
  | 'isBackpack'
  | 'isBifrost'
  | 'isBitKeep'
  | 'isBitski'
  | 'isBlockWallet'
  | 'isBraveWallet'
  | 'isCoinbaseWallet'
  | 'isDawn'
  | 'isEnkrypt'
  | 'isExodus'
  | 'isFrame'
  | 'isFrontier'
  | 'isGamestop'
  | 'isHyperPay'
  | 'isImToken'
  | 'isKuCoinWallet'
  | 'isMathWallet'
  | 'isMetaMask'
  | 'isOkxWallet'
  | 'isOKExWallet'
  | 'isOneInchAndroidWallet'
  | 'isOneInchIOSWallet'
  | 'isOpera'
  | 'isPhantom'
  | 'isPortal'
  | 'isRabby'
  | 'isRainbow'
  | 'isStatus'
  | 'isTally'
  | 'isTokenPocket'
  | 'isTokenary'
  | 'isTrust'
  | 'isTrustWallet'
  | 'isXDEFI'
  | 'isZerion'

type WalletProvider = Compute<
  JSAPIStandardProvider & {
    [key in WalletProviderFlags]?: true | undefined
  } & {
    providers?: WalletProvider[] | undefined
    /** Only exists in MetaMask as of 2022/04/03 */
    _events?: { connect?: (() => void) | undefined } | undefined
    /** Only exists in MetaMask as of 2022/04/03 */
    _state?:
      | {
          accounts?: string[]
          initialized?: boolean
          isConnected?: boolean
          isPermanentlyDisconnected?: boolean
          isUnlocked?: boolean
        }
      | undefined
  }
>

type Window = {
  mina?: WalletProvider | undefined
}

function findProvider(
  window: globalThis.Window | Window | undefined,
  select?: WalletProviderFlags | ((provider: WalletProvider) => boolean),
) {
  function isProvider(provider: WalletProvider) {
    if (typeof select === 'function') return select(provider)
    if (typeof select === 'string') return provider[select]
    return true
  }

  const mina = (window as Window).mina
  if (mina?.providers)
    return mina.providers.find((provider) => isProvider(provider))
  if (mina && isProvider(mina)) return mina
  return undefined
}
