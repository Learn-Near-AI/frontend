import React, { useState, useEffect } from 'react';
import { useNearWallet } from 'near-connect-hooks';
import { ChevronDown, LogOut } from 'lucide-react';
import { useWalletBalance } from '../../hooks/useWalletBalance';

export default function NavWallet({ currentPath, mobile = false }) {
  const { signedAccountId, signIn, signOut } = useNearWallet();
  const walletBalance = useWalletBalance(signedAccountId);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (mobile) return;
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.wallet-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, mobile]);

  const handleDisconnect = () => {
    signOut();
    setDropdownOpen(false);
  };

  const showWallet =
    currentPath.startsWith('/examples') || currentPath === '/roadmap' || currentPath === '/agent';

  if (!showWallet) return null;

  if (mobile) {
    return (
      <div className="md:hidden border-t border-gray-200 dark:border-[#3e3e42] pt-4 mt-2">
        {signedAccountId ? (
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg border border-[#3e3e42] bg-[#111216]">
              <div className="text-xs text-gray-400 mb-1">Account</div>
              <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
                {signedAccountId}
              </div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-[#3e3e42] bg-gray-50 dark:bg-[#111216]">
              <div className="text-xs text-gray-400 mb-1">Balance</div>
              <div className="text-lg font-semibold text-near-primary">
                {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-red-400/20"
            >
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-[#3e3e42] text-gray-900 dark:text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="hidden md:block relative wallet-dropdown-container tour-wallet-connect">
      {signedAccountId ? (
        <>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-[#3e3e42] bg-white dark:bg-[#111216] text-gray-900 dark:text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-left">
                <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {signedAccountId}
                </div>
                <div className="text-xs font-semibold text-near-primary">
                  {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111216] rounded-lg border border-gray-200 dark:border-[#3e3e42] shadow-lg z-50">
              <div className="p-4 border-b border-gray-200 dark:border-[#3e3e42]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account</div>
                <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
                  {signedAccountId}
                </div>
              </div>
              <div className="p-4 border-b border-gray-200 dark:border-[#3e3e42]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Balance</div>
                <div className="text-lg font-semibold text-near-primary">
                  {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={signIn}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-[#3e3e42] text-gray-900 dark:text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
