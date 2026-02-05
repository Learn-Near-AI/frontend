/**
 * Centralized handling of transactionHashes URL parameter (wallet redirect).
 * Used when users return from wallet after signing a transaction.
 */

const SUCCESS_PATH = '/examples/success';

/**
 * Check if current URL has transactionHashes and redirect to success page if needed.
 * @returns {boolean} True if redirect was performed
 */
export function redirectToSuccessIfNeeded() {
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  const transactionHashes = urlParams.get('transactionHashes');

  if (transactionHashes && !window.location.pathname.includes(SUCCESS_PATH)) {
    const successUrl = `${SUCCESS_PATH}?transactionHashes=${transactionHashes}`;
    window.history.replaceState({}, '', successUrl);
    window.location.href = successUrl;
    return true;
  }

  return false;
}

/**
 * Check if we're on examples path and have transactionHashes - ensure we navigate to examples.
 * Call this on app init when user lands with ?transactionHashes= from wallet redirect.
 */
export function ensureExamplesPathWithTransactionHashes() {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const transactionHashes = urlParams.get('transactionHashes');

  if (transactionHashes && !window.location.pathname.startsWith('/examples')) {
    const newPath = `/examples${window.location.search}`;
    window.history.replaceState({}, '', newPath);
  }
}
