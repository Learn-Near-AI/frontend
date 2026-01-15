import React from 'react'
import { 
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Search,
  ExternalLink
} from 'lucide-react'

function Nav({ 
  isDark, 
  toggleTheme, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  scrollToTop,
  launchExamplesBrowser,
  currentPath,
  walletAccountId,
  walletBalance,
  walletDropdownOpen,
  setWalletDropdownOpen,
  handleWalletConnect,
  handleWalletDisconnect
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111216]/95 backdrop-blur-md border-b border-[#3e3e42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={scrollToTop}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img 
              src="/assets/images/vecteezy.png" 
              alt="NEAR Logo" 
              className="w-8 h-8 object-contain rotate-slow"
            />
            <span className="text-lg font-bold text-white transition-colors">
              NEAR by Example
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={launchExamplesBrowser}
              className="text-gray-300 hover:text-near-primary transition-colors font-medium"
            >
              Examples
            </button>
            <a
              href="https://docs.near.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-near-primary transition-colors font-medium"
            >
              Docs
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-near-primary transition-colors font-medium"
            >
              Community
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-near-primary transition-colors font-medium flex items-center gap-1"
            >
              Learn
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Theme Toggle, Search, Download & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              className="hidden md:block p-2 text-gray-300 hover:text-near-primary transition-colors rounded-lg hover:bg-[#1a1b1f]"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="hidden md:block p-2 text-gray-300 hover:text-near-primary transition-colors rounded-lg hover:bg-[#1a1b1f]"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button> */}

            {/* Download Button */}
            <button
              onClick={launchExamplesBrowser}
              className="hidden md:block px-4 py-2 text-sm font-semibold text-black bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200"
            >
              Get started
            </button>

            {/* NEAR Wallet connect – only show in examples view */}
            {currentPath.startsWith('/examples') && (
              <div className="hidden md:block relative wallet-dropdown-container">
                {walletAccountId ? (
                  <>
                    <button
                      onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[#3e3e42] bg-[#111216] text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <div className="font-mono text-xs text-gray-400">
                            {walletAccountId}
                          </div>
                          <div className="text-xs font-semibold text-near-primary">
                            {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {walletDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-[#111216] rounded-lg border border-[#3e3e42] shadow-lg z-50">
                        <div className="p-4 border-b border-[#3e3e42]">
                          <div className="text-xs text-gray-400 mb-1">Account</div>
                          <div className="font-mono text-sm text-white break-all">
                            {walletAccountId}
                          </div>
                        </div>
                        <div className="p-4 border-b border-[#3e3e42]">
                          <div className="text-xs text-gray-400 mb-1">Balance</div>
                          <div className="text-lg font-semibold text-near-primary">
                            {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
                          </div>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleWalletDisconnect}
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
                    onClick={handleWalletConnect}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg border border-[#3e3e42] text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
                  >
                    Connect NEAR Wallet
                  </button>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-near-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#3e3e42] py-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={launchExamplesBrowser}
                className="text-left text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
              >
                Examples
              </button>
              <a
                href="https://docs.near.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
              >
                Community
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-near-primary transition-colors font-medium py-2 flex items-center gap-1"
              >
                Learn
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={toggleTheme}
                className="text-left text-gray-300 hover:text-near-primary transition-colors font-medium py-2 flex items-center gap-2"
              >
                {isDark ? (
                  <>
                    <Sun className="h-5 w-5" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    Dark Mode
                  </>
                )}
              </button>
              <button
                onClick={launchExamplesBrowser}
                className="w-full px-4 py-2 text-sm font-semibold text-white bg-near-primary hover:bg-[#00D689] rounded-lg"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Nav
