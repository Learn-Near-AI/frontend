import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { config, getCompileApiUrl } from './index'

describe('config', () => {
  it('exports near network config', () => {
    expect(config.near).toBeDefined()
    expect(config.near.networkId).toBe('testnet')
    expect(config.near.walletUrl).toContain('mynearwallet')
    expect(config.near.explorerUrl).toContain('explorer')
  })

  it('exports backend URLs', () => {
    expect(config.backend.rust).toBeDefined()
    expect(config.backend.js).toBeDefined()
    expect(config.backend.deploy).toBeDefined()
  })

  it('exports external links', () => {
    expect(config.links.docs).toContain('docs.near.org')
    expect(config.links.github).toContain('github.com')
  })
})

describe('getCompileApiUrl', () => {
  it('returns Rust backend URL for Rust language', () => {
    const url = getCompileApiUrl('Rust')
    expect(url).toBe(config.backend.rust)
  })

  it('returns JS backend URL for JavaScript language', () => {
    const url = getCompileApiUrl('JavaScript')
    expect(url).toBe(config.backend.js)
  })
})
