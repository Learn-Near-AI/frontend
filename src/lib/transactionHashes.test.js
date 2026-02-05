import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { redirectToSuccessIfNeeded } from './transactionHashes'

describe('redirectToSuccessIfNeeded', () => {
  const originalLocation = window.location

  beforeEach(() => {
    delete window.location
    window.location = {
      pathname: '/examples',
      search: '',
      href: 'http://localhost/examples',
      replaceState: vi.fn(),
    }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  it('returns false when no transactionHashes in URL', () => {
    window.location.search = ''
    const result = redirectToSuccessIfNeeded()
    expect(result).toBe(false)
  })

  it('returns true when transactionHashes present and not on success page', () => {
    window.location.search = '?transactionHashes=abc123'
    window.location.pathname = '/examples'
    window.location.href = 'http://localhost/examples?transactionHashes=abc123'

    const result = redirectToSuccessIfNeeded()
    expect(result).toBe(true)
    expect(window.location.replaceState).toHaveBeenCalledWith(
      {},
      '',
      '/examples/success?transactionHashes=abc123'
    )
  })
})
