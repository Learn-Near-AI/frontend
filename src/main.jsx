import React from 'react'
import ReactDOM from 'react-dom/client'
import { NearProvider } from 'near-connect-hooks'
import App from './App.jsx'
import './index.css'
import '@near-wallet-selector/modal-ui/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NearProvider>
      <App />
    </NearProvider>
  </React.StrictMode>,
)

