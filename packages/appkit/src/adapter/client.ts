import {
  type Config,
  type Connector,
  type CreateConfigParameters,
  type CreateConnectorFn,
  connect,
  createConfig,
  getAccount,
  getBalance,
  getConnections,
  injected,
  reconnect,
  // signMessage,
  switchChain,
  disconnect as wagminaDisconnect,
  // writeContract as wagminaWriteContract,
  // waitForTransactionReceipt,
  watchAccount,
  watchConnections,
  watchConnectors,
} from '@wagmina/core'
import type { Hex } from 'vimina'

import type { AppKit, AppKitOptions } from '@reown/appkit'
import type { BaseNetwork, ChainNamespace } from '@reown/appkit-common'
import { ConstantsUtil as CommonConstantsUtil } from '@reown/appkit-common'
import { CoreHelperUtil, StorageUtil } from '@reown/appkit-core'
import type { ConnectorType, Provider } from '@reown/appkit-core'
import { PresetsUtil } from '@reown/appkit-utils'
import type { W3mFrameProvider } from '@reown/appkit-wallet'
import { AdapterBlueprint } from '@reown/appkit/adapters'

import { formatMina, formatUnits, parseUnits } from '@mina-js/utils'
import type UniversalProvider from '@walletconnect/universal-provider'
import type { WagminaAppKitNetwork } from '../types/network'

export class WagminaAdapter extends AdapterBlueprint {
  public wagminaConfig!: Config
  public adapterType = 'wagmina'
  public excludeWalletIds: string[] | undefined

  private balancePromises: Record<
    string,
    Promise<AdapterBlueprint.GetBalanceResult>
  > = {}

  constructor(
    configParams: Partial<CreateConfigParameters> & {
      networks: [WagminaAppKitNetwork, ...WagminaAppKitNetwork[]]
      projectId: string
      excludeWalletIds?: string[]
    },
  ) {
    super({
      projectId: configParams.projectId,
      networks: configParams.networks,
    })
    this.excludeWalletIds = configParams.excludeWalletIds

    this.namespace = 'mina' as any

    const config: any = {
      ...configParams,
      chains: configParams.networks as unknown as [
        BaseNetwork,
        ...BaseNetwork[],
      ],
    }

    this.wagminaConfig = createConfig(config)
    this.setupWatchers()
  }

  override async getAccounts(
    params: AdapterBlueprint.GetAccountsParams,
  ): Promise<AdapterBlueprint.GetAccountsResult> {
    const connector = this.getWagminaConnector(params.id)

    if (!connector) {
      return { accounts: [] }
    }

    if (connector.id === CommonConstantsUtil.CONNECTOR_ID.AUTH) {
      const provider = connector.provider as W3mFrameProvider
      const { address, accounts } = await provider.connect()

      return Promise.resolve({
        accounts: (accounts || [{ address, type: 'eoa' }]).map((account) =>
          CoreHelperUtil.createAccount('eip155', account.address, account.type),
        ),
      })
    }

    const { addresses, address } = getAccount(this.wagminaConfig)

    return Promise.resolve({
      accounts: (addresses || [address])?.map((val) =>
        CoreHelperUtil.createAccount('eip155', val || '', 'eoa'),
      ),
    })
  }

  private getWagminaConnector(id: string) {
    return this.wagminaConfig.connectors.find((c) => c.id === id)
  }

  private setupWatchers() {
    watchAccount(this.wagminaConfig, {
      onChange: (accountData, prevAccountData) => {
        if (accountData.status === 'disconnected' && prevAccountData.address) {
          this.emit('disconnect')
        }

        if (accountData.status === 'connected') {
          if (
            accountData.address !== prevAccountData?.address ||
            prevAccountData.status !== 'connected'
          ) {
            this.emit('accountChanged', {
              address: accountData.address,
            })
          }

          if (accountData.networkId !== prevAccountData?.networkId) {
            this.emit('switchNetwork', {
              address: accountData.address,
              chainId: accountData.networkId,
            })
          }
        }
      },
    })
    watchConnections(this.wagminaConfig, {
      onChange: (connections) => {
        if (connections.length === 0) {
          this.emit('disconnect')
        }
      },
    })
  }

  private async addThirdPartyConnectors(_options: AppKitOptions) {
    const thirdPartyConnectors: CreateConnectorFn[] = []
    // Add third party connectors if needed
    thirdPartyConnectors.forEach((connector) => {
      const cnctr = this.wagminaConfig._internal.connectors.setup(connector)
      this.wagminaConfig._internal.connectors.setState((prev) => [
        ...prev,
        cnctr,
      ])
    })
  }

  private addWagminaConnectors(options: AppKitOptions, _appKit: AppKit) {
    const customConnectors: CreateConnectorFn[] = []

    // if (options.enableWalletConnect !== false) {
    //   customConnectors.push(
    //     walletConnect(
    //       options,
    //       appKit,
    //       this.caipNetworks as [WagminaAppKitNetwork, ...WagminaAppKitNetwork[]],
    //     ),
    //   )
    // }

    if (options.enableInjected !== false) {
      customConnectors.push(injected({ shimDisconnect: true }))
    }

    // const emailEnabled =
    //   options.features?.email === undefined
    //     ? CoreConstantsUtil.DEFAULT_FEATURES.email
    //     : options.features?.email
    // const socialsEnabled = options.features?.socials
    //   ? options.features?.socials?.length > 0
    //   : CoreConstantsUtil.DEFAULT_FEATURES.socials
    //
    // if (emailEnabled || socialsEnabled) {
    //   customConnectors.push(
    //     authConnector({
    //       chains: this.wagminaConfig.chains,
    //       options: {
    //         projectId: options.projectId,
    //         enableAuthLogger: options.enableAuthLogger,
    //       },
    //     }),
    //   )
    // }

    customConnectors.forEach((connector) => {
      const cnctr = this.wagminaConfig._internal.connectors.setup(connector)
      this.wagminaConfig._internal.connectors.setState((prev) => [
        ...prev,
        cnctr,
      ])
    })
  }

  public async signMessage(
    _params: AdapterBlueprint.SignMessageParams,
  ): Promise<AdapterBlueprint.SignMessageResult> {
    throw new Error('not implemented')
  }

  public async sendTransaction(
    _params: AdapterBlueprint.SendTransactionParams,
  ): Promise<AdapterBlueprint.SendTransactionResult> {
    // const { chainId } = getAccount(this.wagminaConfig)
    // const txParams = {
    //   account: params.address,
    //   to: params.to as Hex,
    //   value: params.value as bigint,
    //   gas: params.gas as bigint,
    //   gasPrice: params.gasPrice as bigint,
    //   data: params.data as Hex,
    //   chainId,
    //   type: 'legacy' as const,
    // }
    //
    // await prepareTransactionRequest(this.wagminaConfig, txParams)
    // const tx = await wagminaSendTransaction(this.wagminaConfig, txParams)
    // await waitForTransactionReceipt(this.wagminaConfig, {
    //   hash: tx,
    //   timeout: 25000,
    // })
    //
    // return { hash: tx }
    throw new Error('not implemented')
  }

  public async writeContract(
    _params: AdapterBlueprint.WriteContractParams,
  ): Promise<AdapterBlueprint.WriteContractResult> {
    throw new Error('not implemented')
  }

  public async getEnsAddress(
    _params: AdapterBlueprint.GetEnsAddressParams,
  ): Promise<AdapterBlueprint.GetEnsAddressResult> {
    throw new Error('not implemented')
  }

  public async estimateGas(
    _params: AdapterBlueprint.EstimateGasTransactionArgs,
  ): Promise<AdapterBlueprint.EstimateGasTransactionResult> {
    throw new Error('not implemented')
  }

  public parseUnits(
    params: AdapterBlueprint.ParseUnitsParams,
  ): AdapterBlueprint.ParseUnitsResult {
    return parseUnits(params.value, params.decimals)
  }

  public formatUnits(
    params: AdapterBlueprint.FormatUnitsParams,
  ): AdapterBlueprint.FormatUnitsResult {
    return formatUnits(params.value, params.decimals)
  }

  private async addWagminaConnector(
    connector: Connector,
    options: AppKitOptions,
  ) {
    /*
     * We don't need to set auth connector or walletConnect connector
     * from wagmina since we already set it in chain adapter blueprint
     */
    if (
      connector.id === CommonConstantsUtil.CONNECTOR_ID.AUTH ||
      connector.id === CommonConstantsUtil.CONNECTOR_ID.WALLET_CONNECT
    ) {
      return
    }

    if (this.excludeWalletIds?.includes(connector.id)) {
      return
    }

    const provider = (await connector.getProvider().catch(() => undefined)) as
      | Provider
      | undefined

    this.addConnector({
      id: connector.id,
      explorerId: PresetsUtil.ConnectorExplorerIds[connector.id],
      imageUrl: options?.connectorImages?.[connector.id] ?? connector.icon,
      name: PresetsUtil.ConnectorNamesMap[connector.id] ?? connector.name,
      imageId: PresetsUtil.ConnectorImageIds[connector.id],
      type: PresetsUtil.ConnectorTypesMap[connector.type] ?? 'EXTERNAL',
      info:
        connector.id === CommonConstantsUtil.CONNECTOR_ID.INJECTED
          ? undefined
          : { rdns: connector.id },
      provider,
      chain: this.namespace as ChainNamespace,
      chains: [],
    })
  }

  public async syncConnectors(options: AppKitOptions, appKit: AppKit) {
    /*
     * Watch for new connectors. This is needed because some EIP6963
     * connectors are added later in the process the initial setup
     */
    watchConnectors(this.wagminaConfig, {
      onChange: (connectors) =>
        connectors.forEach((connector) =>
          this.addWagminaConnector(connector, options),
        ),
    })

    // Add current wagmina connectors to chain adapter blueprint
    await Promise.all(
      this.wagminaConfig.connectors.map((connector) =>
        this.addWagminaConnector(connector, options),
      ),
    )

    // Add wagmina connectors
    this.addWagminaConnectors(options, appKit)

    // Add third party connectors
    await this.addThirdPartyConnectors(options)
  }

  public async syncConnection(
    params: AdapterBlueprint.SyncConnectionParams,
  ): Promise<AdapterBlueprint.ConnectResult> {
    const { id } = params
    const connections = getConnections(this.wagminaConfig)
    const connection = connections.find((c) => c.connector.id === id)
    const connector = this.getWagminaConnector(id)
    const provider = (await connector?.getProvider()) as Provider

    return {
      chainId: String(connection?.networkId),
      address: connection?.accounts[0] as string,
      provider,
      type: connection?.connector.type as ConnectorType,
      id: connection?.connector.id as string,
    }
  }

  public override async connectWalletConnect(
    _chainId?: number | string,
  ): Promise<{ clientId: string } | undefined> {
    // // Attempt one click auth first, if authenticated, still connect with wagmina to store the session
    // const walletConnectConnector = this.getWalletConnectConnector()
    // await walletConnectConnector.authenticate()
    //
    // const wagminaConnector = this.getWagminaConnector('walletConnect')
    //
    // if (!wagminaConnector) {
    //   throw new Error(
    //     'UniversalAdapter:connectWalletConnect - connector not found',
    //   )
    // }
    //
    // await connect(this.wagminaConfig, {
    //   connector: wagminaConnector,
    //   chainId: chainId ? Number(chainId) : undefined,
    // })
    //
    // return {
    //   clientId:
    //     await walletConnectConnector.provider.client.core.crypto.getClientId(),
    // }
    throw new Error('not implemented')
  }

  public async connect(
    params: AdapterBlueprint.ConnectParams,
  ): Promise<AdapterBlueprint.ConnectResult> {
    const { id, provider, type, info, chainId } = params
    const connector = this.getWagminaConnector(id)

    if (!connector) {
      throw new Error(
        'connectionControllerClient:connectExternal - connector is undefined',
      )
    }

    if (
      provider &&
      info &&
      connector.id === CommonConstantsUtil.CONNECTOR_ID.EIP6963
    ) {
      // @ts-expect-error Exists on EIP6963Connector
      connector.setEip6963Wallet?.({ provider, info })
    }

    const res = await connect(this.wagminaConfig, {
      connector,
      networkId: chainId ? String(chainId) : undefined,
    })

    return {
      address: res.accounts[0],
      chainId: res.networkId,
      provider: provider as Provider,
      type: type as ConnectorType,
      id,
    }
  }

  public override async reconnect(
    params: AdapterBlueprint.ConnectParams,
  ): Promise<void> {
    const { id } = params

    const connector = this.getWagminaConnector(id)

    if (!connector) {
      throw new Error(
        'connectionControllerClient:connectExternal - connector is undefined',
      )
    }

    await reconnect(this.wagminaConfig, {
      connectors: [connector],
    })
  }

  public async getBalance(
    params: AdapterBlueprint.GetBalanceParams,
  ): Promise<AdapterBlueprint.GetBalanceResult> {
    const caipNetwork = this.caipNetworks?.find(
      (network) => network.id === params.chainId,
    )

    if (caipNetwork && this.wagminaConfig) {
      const caipAddress = `${caipNetwork.caipNetworkId}:${params.address}`
      const cachedPromise = this.balancePromises[caipAddress]
      if (cachedPromise) {
        return cachedPromise
      }

      const cachedBalance =
        StorageUtil.getNativeBalanceCacheForCaipAddress(caipAddress)
      if (cachedBalance) {
        return { balance: cachedBalance.balance, symbol: cachedBalance.symbol }
      }

      this.balancePromises[caipAddress] =
        // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
        new Promise<AdapterBlueprint.GetBalanceResult>(async (resolve) => {
          const chainId = params.chainId

          const client = this.wagminaConfig.getClient({
            networkId: String(chainId),
          })
          const chain =
            this.wagminaConfig.chains.find((x) => x.id === String(chainId)) ??
            client.chain!

          const balance = await getBalance(this.wagminaConfig, {
            address: params.address as Hex,
            networkId: chainId as string,
            tokenId: params.tokens?.[caipNetwork.caipNetworkId]?.address as Hex,
          })

          StorageUtil.updateNativeBalanceCache({
            caipAddress,
            balance: formatMina(balance),
            symbol: chain.nativeCurrency.symbol,
            timestamp: Date.now(),
          })
          resolve({
            balance: formatMina(balance),
            symbol: chain.nativeCurrency.symbol,
          })
        }).finally(() => {
          delete this.balancePromises[caipAddress]
        })

      return this.balancePromises[caipAddress] || { balance: '', symbol: '' }
    }

    return { balance: '', symbol: '' }
  }

  public async getProfile(
    _params: AdapterBlueprint.GetProfileParams,
  ): Promise<AdapterBlueprint.GetProfileResult> {
    throw new Error('not implemented')
  }

  public getWalletConnectProvider(): AdapterBlueprint.GetWalletConnectProviderResult {
    // return this.getWagminaConnector('walletConnect')
    //   ?.provider as UniversalProvider
    throw new Error('not implemented')
  }

  public async disconnect() {
    const connections = getConnections(this.wagminaConfig)
    await Promise.all(
      connections.map(async (connection) => {
        const connector = this.getWagminaConnector(connection.connector.id)

        if (connector) {
          await wagminaDisconnect(this.wagminaConfig, { connector })
        }
      }),
    )
  }

  public override async switchNetwork(
    params: AdapterBlueprint.SwitchNetworkParams,
  ) {
    return switchChain(this.wagminaConfig, {
      networkId: params.caipNetwork.id as string,
    })
  }

  public async getCapabilities(_params: string) {
    throw new Error('not implemented')
  }

  public async grantPermissions(
    params: AdapterBlueprint.GrantPermissionsParams,
  ) {
    if (!this.wagminaConfig) {
      throw new Error(
        'connectionControllerClient:grantPermissions - wagminaConfig is undefined',
      )
    }

    const connections = getConnections(this.wagminaConfig)
    const connection = connections[0]

    const connector = connection
      ? this.getWagminaConnector(connection.connector.id)
      : null

    if (!connector) {
      throw new Error(
        'connectionControllerClient:grantPermissions - connector is undefined',
      )
    }

    const provider = (await connector.getProvider()) as UniversalProvider

    if (!provider) {
      throw new Error(
        'connectionControllerClient:grantPermissions - provider is undefined',
      )
    }

    return provider.request({ method: 'wallet_grantPermissions', params })
  }

  public async revokePermissions(
    params: AdapterBlueprint.RevokePermissionsParams,
  ): Promise<`0x${string}`> {
    if (!this.wagminaConfig) {
      throw new Error(
        'connectionControllerClient:revokePermissions - wagminaConfig is undefined',
      )
    }

    const connections = getConnections(this.wagminaConfig)
    const connection = connections[0]

    const connector = connection
      ? this.getWagminaConnector(connection.connector.id)
      : null

    if (!connector) {
      throw new Error(
        'connectionControllerClient:revokePermissions - connector is undefined',
      )
    }

    const provider = (await connector.getProvider()) as UniversalProvider

    if (!provider) {
      throw new Error(
        'connectionControllerClient:revokePermissions - provider is undefined',
      )
    }

    return provider.request({ method: 'wallet_revokePermissions', params })
  }

  public async walletGetAssets(
    params: AdapterBlueprint.WalletGetAssetsParams,
  ): Promise<AdapterBlueprint.WalletGetAssetsResponse> {
    if (!this.wagminaConfig) {
      throw new Error(
        'connectionControllerClient:walletGetAssets - wagminaConfig is undefined',
      )
    }

    const connections = getConnections(this.wagminaConfig)
    const connection = connections[0]

    const connector = connection
      ? this.getWagminaConnector(connection.connector.id)
      : null

    if (!connector) {
      throw new Error(
        'connectionControllerClient:walletGetAssets - connector is undefined',
      )
    }

    const provider = (await connector.getProvider()) as UniversalProvider

    if (!provider) {
      throw new Error(
        'connectionControllerClient:walletGetAssets - provider is undefined',
      )
    }

    return provider.request({ method: 'wallet_getAssets', params: [params] })
  }

  public override setUniversalProvider(
    _universalProvider: UniversalProvider,
  ): void {
    // this.addConnector(
    //     new WalletConnectConnector({
    //       provider: universalProvider,
    //       caipNetworks: this.caipNetworks || [],
    //       namespace: 'eip155'
    //     })
    // )
  }
}
