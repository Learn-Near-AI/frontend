import React, { useState, useEffect } from 'react'
import { useNearWallet } from 'near-connect-hooks'
import { 
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  ExternalLink,
  Flame,
  Trophy,
  Calendar,
  Target,
  Zap
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

function Nav({ 
  isDark, 
  toggleTheme, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  scrollToTop,
  launchExamplesBrowser,
  currentPath
}) {
  const { signedAccountId, loading, signIn, signOut } = useNearWallet()
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  const [walletBalance, setWalletBalance] = useState(null)
  
  const walletAccountId = signedAccountId
  const [streakModalOpen, setStreakModalOpen] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalVisits, setTotalVisits] = useState(0)
  const [showStreakBadge, setShowStreakBadge] = useState(true)

  // Close wallet dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (walletDropdownOpen && !event.target.closest('.wallet-dropdown-container')) {
        setWalletDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [walletDropdownOpen])

  const handleWalletConnect = () => {
    signIn()
  }

  const handleWalletDisconnect = () => {
    signOut()
    setWalletDropdownOpen(false)
    setWalletBalance(null)
  }

  // Fetch wallet balance when account is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (!signedAccountId) {
        setWalletBalance(null)
        return
      }

      try {
        const RPC_URL = 'https://rpc.testnet.near.org'
        const res = await fetch(RPC_URL, {
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
              account_id: signedAccountId,
            },
          }),
        })

        const json = await res.json()
        const amountYocto = json?.result?.amount
        if (amountYocto) {
          // Convert yoctoNEAR (1e24) to NEAR, formatted to 3 decimal places
          const balance = Number(amountYocto) / 1e24
          setWalletBalance(balance.toFixed(3))
        } else {
          setWalletBalance(null)
        }
      } catch (e) {
        console.error('Failed to fetch account balance', e)
        setWalletBalance(null)
      }
    }

    fetchBalance()
    // Poll balance every 10 seconds to keep it updated
    const intervalId = setInterval(fetchBalance, 10000)
    return () => clearInterval(intervalId)
  }, [signedAccountId])

  // Streak tracking logic
  useEffect(() => {
    const updateStreak = () => {
      const today = new Date().toDateString()
      const streakData = JSON.parse(localStorage.getItem('nearStreakData') || '{}')
      
      const lastVisit = streakData.lastVisit
      const streak = streakData.currentStreak || 0
      const longest = streakData.longestStreak || 0
      const visits = streakData.totalVisits || 0
      
      if (lastVisit === today) {
        // Already visited today
        setCurrentStreak(streak)
        setLongestStreak(longest)
        setTotalVisits(visits)
        return
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      let newStreak = 1
      if (lastVisit === yesterdayStr) {
        // Consecutive day - increase streak
        newStreak = streak + 1
      } else if (lastVisit) {
        // Streak broken - reset to 1
        newStreak = 1
      }
      
      const newLongest = Math.max(newStreak, longest)
      const newVisits = visits + 1
      
      // Save to localStorage
      localStorage.setItem('nearStreakData', JSON.stringify({
        lastVisit: today,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalVisits: newVisits,
        firstVisit: streakData.firstVisit || today
      }))
      
      setCurrentStreak(newStreak)
      setLongestStreak(newLongest)
      setTotalVisits(newVisits)
      
      // Show modal on first visit or milestone achievements
      if (newVisits === 1 || newStreak % 7 === 0 || newStreak === newLongest) {
        setTimeout(() => setStreakModalOpen(true), 1000)
      }
    }
    
    // Only track on non-landing pages
    if (currentPath !== '/') {
      updateStreak()
    }
  }, [currentPath])

  // Check if badge was closed
  useEffect(() => {
    const badgeClosed = localStorage.getItem('nearStreakBadgeClosed')
    if (badgeClosed === 'true') {
      setShowStreakBadge(false)
    }
  }, [])

  const handleCloseBadge = (e) => {
    e.stopPropagation()
    setShowStreakBadge(false)
    localStorage.setItem('nearStreakBadgeClosed', 'true')
  }

  const handleReopenBadge = () => {
    setShowStreakBadge(true)
    localStorage.removeItem('nearStreakBadgeClosed')
  }

  const getStreakMessage = () => {
    if (currentStreak === 1) return "Great start! Come back tomorrow to build your streak! 🎯"
    if (currentStreak < 7) return `Keep it up! ${7 - currentStreak} more days to your first week! 💪`
    if (currentStreak === 7) return "Amazing! You've completed a full week! 🎉"
    if (currentStreak < 30) return `Fantastic! You're on fire! ${30 - currentStreak} days to reach 30! 🔥`
    if (currentStreak === 30) return "Incredible! 30-day streak master! 🏆"
    return "You're a NEAR legend! Keep the momentum going! ⚡"
  }

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

          {/* Theme Toggle, Download & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
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

            {/* Download Button - only show on landing page */}
            {currentPath === '/' && (
              <button
                onClick={launchExamplesBrowser}
                className="hidden md:block px-4 py-2 text-sm font-semibold text-black bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200"
              >
                Get started
              </button>
            )}

            {/* Daily Streak Badge – only show in non-landing routes */}
            {currentPath !== '/' && showStreakBadge && (
              <button
                onClick={() => setStreakModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 relative group"
                title="View your streak"
              >
                <Flame className="h-4 w-4" />
                <span>{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</span>
                
              </button>
            )}

            {/* Show reopen button if badge was closed */}
            {currentPath !== '/' && !showStreakBadge && (
              <button
                onClick={handleReopenBadge}
                className="hidden md:flex items-center justify-center p-2 rounded-lg border border-[#3e3e42] text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
                title="Show streak"
              >
                <Flame className="h-4 w-4" />
              </button>
            )}

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
              {/* Daily Streak Badge - Mobile */}
              {currentPath !== '/' && showStreakBadge && (
                <button
                  onClick={() => {
                    setStreakModalOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5" />
                    <span className="font-semibold">{currentStreak} Day Streak</span>
                  </div>
                  <button
                    onClick={handleCloseBadge}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </button>
              )}

              {/* Show reopen button if badge was closed - Mobile */}
              {currentPath !== '/' && !showStreakBadge && (
                <button
                  onClick={handleReopenBadge}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#3e3e42] text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
                >
                  <Flame className="h-5 w-5" />
                  <span>Show Streak</span>
                </button>
              )}

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
              {/* Get started button - only show on landing page */}
              {currentPath === '/' && (
                <button
                  onClick={launchExamplesBrowser}
                  className="w-full px-4 py-2 text-sm font-semibold text-white bg-near-primary hover:bg-[#00D689] rounded-lg"
                >
                  Get started
                </button>
              )}
              {/* NEAR Wallet connect – only show in examples view (mobile) */}
              {currentPath.startsWith('/examples') && (
                <div className="md:hidden border-t border-[#3e3e42] pt-4 mt-2">
                  {walletAccountId ? (
                    <div className="flex flex-col gap-3">
                      <div className="p-3 rounded-lg border border-[#3e3e42] bg-[#111216]">
                        <div className="text-xs text-gray-400 mb-1">Account</div>
                        <div className="font-mono text-sm text-white break-all">
                          {walletAccountId}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-[#3e3e42] bg-[#111216]">
                        <div className="text-xs text-gray-400 mb-1">Balance</div>
                        <div className="text-lg font-semibold text-near-primary">
                          {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
                        </div>
                      </div>
                      <button
                        onClick={handleWalletDisconnect}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-red-400/20"
                      >
                        <LogOut className="h-4 w-4" />
                        Disconnect Wallet
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleWalletConnect}
                      className="w-full px-4 py-2 text-sm font-semibold rounded-lg border border-[#3e3e42] text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
                    >
                      Connect NEAR Wallet
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Streak Gamification Modal */}
      <Dialog open={streakModalOpen} onOpenChange={setStreakModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#111216] border border-[#3e3e42]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Flame className="h-6 w-6 text-orange-500" />
              Your Learning Streak
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {getStreakMessage()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Streak */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <div className="p-3 rounded-full bg-orange-500/20">
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{currentStreak}</div>
                <div className="text-sm text-gray-400">Current Streak</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-[#1a1b1f] border border-[#3e3e42]">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-gray-400">Best Streak</span>
                </div>
                <div className="text-2xl font-bold text-white">{longestStreak}</div>
              </div>

              <div className="p-4 rounded-lg bg-[#1a1b1f] border border-[#3e3e42]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-400">Total Visits</span>
                </div>
                <div className="text-2xl font-bold text-white">{totalVisits}</div>
              </div>
            </div>

            {/* Milestones */}
            <div className="p-4 rounded-lg bg-[#1a1b1f] border border-[#3e3e42]">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-near-primary" />
                <span className="text-sm font-semibold text-white">Next Milestones</span>
              </div>
              <div className="space-y-2">
                {currentStreak < 7 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">7-day streak</span>
                    <span className="text-near-primary font-semibold">{7 - currentStreak} days left</span>
                  </div>
                )}
                {currentStreak < 30 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">30-day streak</span>
                    <span className="text-near-primary font-semibold">{30 - currentStreak} days left</span>
                  </div>
                )}
                {currentStreak >= 30 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-500">
                    <Zap className="h-4 w-4" />
                    <span>You've unlocked all milestones! 🎉</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          <button
            onClick={() => setStreakModalOpen(false)}
            className="w-full px-4 py-2 text-sm font-semibold bg-near-primary text-near-darker rounded-lg hover:bg-[#00D689] transition-colors"
          >
            Keep Learning!
          </button>
        </DialogContent>
      </Dialog>
    </nav>
  )
}

export default Nav
