'use client'

import type { ResolvedRegister, State } from '@wagmina/core'
import { createContext, createElement } from 'react'
import { Hydrate } from './hydrate.js'

export const WagminaContext = createContext<
  ResolvedRegister['config'] | undefined
>(undefined)

export type WagminaProviderProps = {
  config: ResolvedRegister['config']
  initialState?: State | undefined
  reconnectOnMount?: boolean | undefined
}

export function WagminaProvider(
  parameters: React.PropsWithChildren<WagminaProviderProps>,
) {
  const { children, config } = parameters

  const props = { value: config }
  return createElement(
    Hydrate,
    parameters,
    createElement(WagminaContext.Provider, props, children),
  )
}
