import { Buffer } from 'buffer'
import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'

// Polyfill Buffer for any deps that still expect it (near-api-js, etc.)
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}

const TESTNET_NETWORK = 'testnet'
const CONTRACT_ID = 'example-contract.testnet' // you can change this later

let selectorPromise = null
let modal = null

// Use Vite proxy in development to avoid CORS issues
const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'
const RPC_URL = isDev ? '/api/near-rpc' : 'https://test.rpc.fastnear.com'

export const getNearConfig = () => ({
  networkId: TESTNET_NETWORK,
  nodeUrl: RPC_URL,
  walletUrl: 'https://testnet.mynearwallet.com',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
})

export async function initWalletSelector() {
  if (!selectorPromise) {
    selectorPromise = setupWalletSelector({
      network: TESTNET_NETWORK,
      debug: false,
      modules: [
        setupMyNearWallet(),
        setupMeteorWallet(),
      ],
    }).then((selector) => {
      if (!modal) {
        modal = setupModal(selector, {
          contractId: CONTRACT_ID,
          theme: 'dark',
        })
      }
      return selector
    })
  }

  return selectorPromise
}

export function openWalletSelectorModal() {
  if (modal) {
    modal.show()
  }
}

export async function getActiveAccountId() {
  const selector = await initWalletSelector()
  const state = selector.store.getState()
  const active = state.accounts.find((it) => it.active)
  return active?.accountId || null
}

export async function getActiveAccountBalance() {
  const accountId = await getActiveAccountId()
  if (!accountId) return null

  const { nodeUrl } = getNearConfig()

  try {
    const res = await fetch(nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: accountId,
        },
      }),
    })

    const json = await res.json()
    const amountYocto = json?.result?.amount
    if (!amountYocto) return null

    // Convert yoctoNEAR (1e24) to NEAR, formatted to 3 decimal places
    const balance = Number(amountYocto) / 1e24
    return balance.toFixed(3)
  } catch (e) {
    console.error('Failed to fetch account balance', e)
    return null
  }
}

export async function disconnectWallet() {
  try {
    const selector = await initWalletSelector()
    const wallet = await selector.wallet()
    await wallet.signOut()
  } catch (e) {
    console.error('Failed to disconnect wallet', e)
  }
}

/**
 * Validates a NEAR account ID format
 * @param {string} accountId - The account ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidAccountId(accountId) {
  if (!accountId || typeof accountId !== 'string') return false
  
  // NEAR account ID rules:
  // - 2-64 characters
  // - Lowercase alphanumeric or separators (._-)
  // - Cannot start or end with separator
  // - Cannot have consecutive separators
  if (accountId.length < 2 || accountId.length > 64) return false
  
  const accountIdRegex = /^[a-z0-9]+([._-][a-z0-9]+)*$/
  return accountIdRegex.test(accountId)
}

/**
 * Validates contract WASM size
 * NEAR has a maximum contract size limit
 * @param {number} sizeInBytes - Contract size in bytes
 * @returns {{valid: boolean, error?: string, warning?: string}} - Validation result
 */
export function validateContractSize(sizeInBytes) {
  const MAX_CONTRACT_SIZE = 4 * 1024 * 1024 // 4 MB (NEAR's limit)
  const MIN_VALID_WASM_SIZE = 8 // Absolute minimum for WASM (magic number + version)
  const MIN_RECOMMENDED_SIZE = 100 // Minimum recommended size for a real contract
  
  // Allow minimal WASM files (for testing/placeholder contracts)
  if (sizeInBytes < MIN_VALID_WASM_SIZE) {
    return { 
      valid: false, 
      error: 'Contract is too small. A valid WASM file must be at least 8 bytes.' 
    }
  }
  
  // Warn if contract is suspiciously small (likely a placeholder)
  if (sizeInBytes < MIN_RECOMMENDED_SIZE) {
    return { 
      valid: true, 
      warning: 'Contract is very small. This may be a placeholder. Real contracts are typically larger.' 
    }
  }
  
  if (sizeInBytes > MAX_CONTRACT_SIZE) {
    return { 
      valid: false, 
      error: `Contract exceeds maximum size of ${MAX_CONTRACT_SIZE / 1024 / 1024} MB` 
    }
  }
  
  return { valid: true }
}

/**
 * Securely deploys a contract to NEAR TestNet using MyNearWallet
 * @param {string|Uint8Array|Array} wasmCode - The compiled WASM contract code (base64 string, Uint8Array, or Array)
 * @param {Object} options - Deployment options
 * @param {string} options.accountId - The account ID to deploy to (must be the connected account)
 * @param {number} options.gasLimit - Gas limit for deployment (default: 300 TGas)
 * @param {string} options.attachedDeposit - NEAR to attach (default: 0)
 * @returns {Promise<{success: boolean, transactionHash?: string, contractId?: string, error?: string}>}
 */
export async function deployContract(wasmCode, options = {}) {
  try {
    const { accountId, gasLimit = '300000000000000', attachedDeposit = '0' } = options
    
    // Security validations
    if (!accountId) {
      return { success: false, error: 'Account ID is required' }
    }
    
    if (!isValidAccountId(accountId)) {
      return { success: false, error: 'Invalid account ID format' }
    }
    
    // Verify network is testnet (safety check)
    const config = getNearConfig()
    if (config.networkId !== 'testnet') {
      return { success: false, error: 'Deployment is only allowed on TestNet for safety' }
    }
    
    // Get wallet selector and verify connection
    const selector = await initWalletSelector()
    const state = selector.store.getState()
    const activeAccount = state.accounts.find((it) => it.active)
    
    if (!activeAccount) {
      return { success: false, error: 'No wallet connected. Please connect your wallet first.' }
    }
    
    // Security: Only allow deploying to the connected account
    if (activeAccount.accountId !== accountId) {
      return { 
        success: false, 
        error: 'Security: You can only deploy to your own connected account.' 
      }
    }
    
    // Convert WASM code to Uint8Array
    let wasmUint8Array
    if (typeof wasmCode === 'string') {
      // Base64 string
      const wasmBuffer = Buffer.from(wasmCode, 'base64')
      wasmUint8Array = new Uint8Array(wasmBuffer)
    } else if (Array.isArray(wasmCode)) {
      // Array of numbers
      wasmUint8Array = new Uint8Array(wasmCode)
    } else if (wasmCode instanceof Uint8Array) {
      wasmUint8Array = wasmCode
    } else {
      return { success: false, error: 'Invalid WASM code format' }
    }
    
    // Validate contract size
    const sizeValidation = validateContractSize(wasmUint8Array.length)
    if (!sizeValidation.valid) {
      return { success: false, error: sizeValidation.error }
    }
    
    // Store warning if present (for informational purposes)
    const warning = sizeValidation.warning
    
    // Get wallet instance
    const wallet = await selector.wallet()
    
    // Use wallet-selector action format (not near-api-js action objects)
    // The wallet selector expects actions with type and params properties
    const deployAction = {
      type: "DeployContract",
      params: {
        code: wasmUint8Array,
      }
    }
    
    // Deploy to user's own account (signerId === receiverId)
    // This is the standard and safe way to deploy contracts
    // MyNearWallet will not block this since you're deploying to your own account
    const result = await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: accountId, // Deploy to your own account (required for security)
      actions: [deployAction],
    })
    
    // Extract transaction hash from result
    let transactionHash = null
    if (result?.transaction?.hash) {
      transactionHash = result.transaction.hash
    } else if (result?.transactionHash) {
      transactionHash = result.transactionHash
    } else if (result?.receipts_outcome?.[0]?.id) {
      transactionHash = result.receipts_outcome[0].id
    } else if (typeof result === 'string') {
      transactionHash = result
    }
    
    return {
      success: true,
      transactionHash,
      contractId: accountId,
      warning, // Include warning if present
    }
  } catch (error) {
    // Handle specific error types
    let errorMessage = 'Deployment failed'
    
    if (error.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    // Common error patterns
    if (errorMessage.includes('User rejected')) {
      errorMessage = 'Transaction was rejected by user'
    } else if (errorMessage.includes('network')) {
      errorMessage = 'Network error. Please check your connection and try again.'
    } else if (errorMessage.includes('insufficient')) {
      errorMessage = 'Insufficient balance. Please ensure you have enough NEAR for deployment.'
    }
    
    console.error('Deployment error:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Calls a view method on a deployed contract via backend API
 * Similar to viewFunction from near-connect-hooks
 * @param {Object} options - View method options
 * @param {string} options.contractId - The contract account ID
 * @param {string} options.method - The method name to call
 * @param {Object} options.args - Method arguments (optional)
 * @returns {Promise<any>} - The result of the view method
 */
export async function viewFunction({ contractId, method, args = {} }) {
  if (!isValidAccountId(contractId)) {
    throw new Error('Invalid contract ID format')
  }
  
  // Use backend API for view methods
  const backendUrl = isDev ? '/api/backend-rust' : 'https://rustendpoint.fly.dev'
  
  console.log(`[NEAR] Calling view method: ${method} on ${contractId}`)
  console.log(`[NEAR] Using backend: ${backendUrl}`)
  
  const response = await fetch(`${backendUrl}/api/contract/view`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contractAccountId: contractId,
      methodName: method,
      args: args,
    }),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  const json = await response.json()
  
  if (!json.success) {
    throw new Error(json.error || 'View method call failed')
  }
  
  return json.result
}

/**
 * Legacy wrapper for backward compatibility
 */
export async function callViewMethod(contractId, methodName, args = {}) {
  try {
    const result = await viewFunction({ contractId, method: methodName, args })
    return { success: true, result }
  } catch (error) {
    console.error('View method call error:', error)
    return { success: false, error: error.message || 'Failed to call view method' }
  }
}

/**
 * Calls a change method on a deployed contract (requires wallet signature)
 * Similar to callFunction from near-connect-hooks
 * @param {Object} options - Call options
 * @param {string} options.contractId - The contract account ID
 * @param {string} options.method - The method name to call
 * @param {Object} options.args - Method arguments (optional)
 * @param {string} options.gas - Gas limit (default: 30 TGas)
 * @param {string} options.deposit - NEAR to attach (default: 0)
 * @returns {Promise<any>} - The transaction result
 */
export async function callFunction({ contractId, method, args = {}, gas = '30000000000000', deposit = '0' }) {
  if (!isValidAccountId(contractId)) {
    throw new Error('Invalid contract ID format')
  }
  
  const accountId = await getActiveAccountId()
  if (!accountId) {
    throw new Error('Please connect your wallet first')
  }
  
  const selector = await initWalletSelector()
  const wallet = await selector.wallet()
  
  // Use signAndSendTransactions (plural) which has better wallet compatibility
  // This format works consistently across MyNearWallet, Meteor, and other wallets
  const result = await wallet.signAndSendTransactions({
    transactions: [
      {
        receiverId: contractId,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: method,
              args: args || {},
              gas: gas,
              deposit: deposit,
            },
          },
        ],
      },
    ],
  })
  
  // Extract transaction hash from result array
  let transactionHash = null
  const txResult = Array.isArray(result) ? result[0] : result
  
  if (txResult?.transaction?.hash) {
    transactionHash = txResult.transaction.hash
  } else if (txResult?.transactionHash) {
    transactionHash = txResult.transactionHash
  } else if (txResult?.receipts_outcome?.[0]?.id) {
    transactionHash = txResult.receipts_outcome[0].id
  } else if (typeof txResult === 'string') {
    transactionHash = txResult
  }
  
  return { ...txResult, transactionHash }
}

/**
 * Legacy wrapper for backward compatibility
 */
export async function callChangeMethod(contractId, methodName, args = {}, options = {}) {
  try {
    const { gasLimit = '30000000000000', attachedDeposit = '0' } = options
    const result = await callFunction({ 
      contractId, 
      method: methodName, 
      args, 
      gas: gasLimit, 
      deposit: attachedDeposit 
    })
    return { success: true, transactionHash: result.transactionHash }
  } catch (error) {
    let errorMessage = 'Method call failed'
    
    if (error.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    if (errorMessage.includes('User rejected')) {
      errorMessage = 'Transaction was rejected by user'
    }
    
    console.error('Change method call error:', error)
    return { success: false, error: errorMessage }
  }
}


