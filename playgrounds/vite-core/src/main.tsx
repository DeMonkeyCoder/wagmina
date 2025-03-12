import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css.js'

import { Buffer } from 'buffer'

// `@coinbase-wallet/sdk` uses `Buffer`
globalThis.Buffer = Buffer

import App from './App.tsx.js'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
