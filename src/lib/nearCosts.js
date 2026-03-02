const NEAR_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd';

const GAS_FOR_CHANGE_METHOD = '300 TGas';
const GAS_FOR_VIEW_METHOD = '0.001 TGas';
const DEPLOY_COST_PER_KB = 0.01;
const MIN_DEPLOY_COST = 0.005;
const MAX_DEPLOY_COST = 0.05;

let cachedPrice = null;
let priceFetchTime = 0;
const CACHE_DURATION_MS = 60000;

export async function fetchNearPrice() {
  const now = Date.now();
  if (cachedPrice && now - priceFetchTime < CACHE_DURATION_MS) {
    return cachedPrice;
  }

  try {
    const response = await fetch(NEAR_PRICE_API);
    const data = await response.json();
    cachedPrice = data.near?.usd || 5.0;
    priceFetchTime = now;
    return cachedPrice;
  } catch (error) {
    console.warn('Failed to fetch NEAR price, using fallback:', error);
    return cachedPrice || 5.0;
  }
}

export function calculateDeploymentCost(wasmSizeBytes) {
  const sizeKB = wasmSizeBytes / 1024;
  const nearCost = Math.min(
    Math.max(sizeKB * DEPLOY_COST_PER_KB, MIN_DEPLOY_COST),
    MAX_DEPLOY_COST
  );
  return nearCost;
}

export function calculateChangeMethodCost(nearPrice) {
  const gasCostYoctos = BigInt('300000000000000');
  const nearPerYocto = BigInt('10') ** BigInt(24);
  const costNear = Number(gasCostYoctos) / Number(nearPerYocto);
  return costNear * nearPrice;
}

export function getGasInfo() {
  return {
    changeMethod: GAS_FOR_CHANGE_METHOD,
    viewMethod: GAS_FOR_VIEW_METHOD,
  };
}

export function formatNear(amount) {
  return amount.toFixed(4);
}

export function formatUsd(amount) {
  return amount.toFixed(2);
}
