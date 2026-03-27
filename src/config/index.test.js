import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { config, getCompileApiUrl } from './index';

describe('config', () => {
  it('exports near network config', () => {
    expect(config.near).toBeDefined();
    expect(config.near.networkId).toBe('testnet');
    expect(config.near.walletUrl).toContain('mynearwallet');
    expect(config.near.explorerUrl).toContain('explorer');
  });

  it('exports backend URL', () => {
    expect(config.backend).toBeDefined();
    expect(typeof config.backend).toBe('string');
    expect(config.backend).toContain('learnnearbyexample.fly.dev');
  });

  it('exports external links', () => {
    expect(config.links.docs).toContain('docs.near.org');
    expect(config.links.github).toContain('github.com');
  });
});

describe('getCompileApiUrl', () => {
  it('returns the unified backend URL', () => {
    const url = getCompileApiUrl();
    expect(url).toBe(config.backend);
  });
});
