import { useState, useEffect } from 'react'
import { config } from '../config'
import { logger } from '../lib/logger'

/**
 * Fetches and polls NEAR wallet balance for a connected account.
 * @param {string|null} accountId - The NEAR account ID
 * @returns {string|null} Formatted balance (e.g. "1.234") or null
 */
export function useWalletBalance(accountId) {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    if (!accountId) {
      setBalance(null)
      return
    }

    const fetchBalance = async () => {
      try {
        const res = await fetch(config.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        if (amountYocto) {
          const bal = Number(amountYocto) / 1e24
          setBalance(bal.toFixed(3))
        } else {
          setBalance(null)
        }
      } catch (e) {
        logger.error('Failed to fetch account balance', e)
        setBalance(null)
      }
    }

    fetchBalance()
    const intervalId = setInterval(fetchBalance, 10000)
    return () => clearInterval(intervalId)
  }, [accountId])

  return balance
}
