import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { 
  ChevronDown,
  LogOut
} from 'lucide-react'
import ExamplesBrowser from './components/ExamplesBrowser'
import SuccessPage from './components/SuccessPage'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ThreeColumnFeatures from './components/ThreeColumnFeatures'
import CTABanner from './components/CTABanner'
import AgentMode from './components/AgentMode'
import NextEditSuggestions from './components/NextEditSuggestions'
import CodeWithExtensions from './components/CodeWithExtensions'
import CodeInAnyLanguage from './components/CodeInAnyLanguage'
import Footer from './components/Footer'
import {
  initWalletSelector,
  openWalletSelectorModal,
  getActiveAccountId,
  getActiveAccountBalance,
  disconnectWallet,
} from './near/near'

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or default to dark mode
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })
  const [walletAccountId, setWalletAccountId] = useState(null)
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    })

    // Apply theme
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Initialize Wallet Selector (MyNearWallet) and keep active account + balance in sync
  useEffect(() => {
    ;(async () => {
      try {
        await initWalletSelector()

        const updateAccountState = async () => {
          const accountId = await getActiveAccountId()
          if (!accountId) {
            setWalletAccountId(null)
            setWalletBalance(null)
            return
          }
          setWalletAccountId(accountId)
          const balance = await getActiveAccountBalance()
          if (balance !== null) {
            setWalletBalance(balance)
          }
        }

        // Initial fetch
        await updateAccountState()
        // Poll periodically so state updates after user connects via modal
        const intervalId = setInterval(updateAccountState, 5000)
        return () => clearInterval(intervalId)
      } catch (e) {
        console.error('Failed to init wallet selector', e)
      }
    })()
  }, [])

  useEffect(() => {
    // Handle initial URL with query parameters (e.g., from wallet redirect)
    const urlParams = new URLSearchParams(window.location.search)
    const transactionHashes = urlParams.get('transactionHashes')
    
    // If we have transactionHashes and we're not on the examples path, ensure we're on examples
    if (transactionHashes && !currentPath.startsWith('/examples')) {
      const newPath = `/examples${window.location.search}`
      window.history.replaceState({}, '', newPath)
      setCurrentPath('/examples')
    }
    
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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

  const navigate = (path) => {
    if (path === currentPath) return
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const scrollToTop = () => {
    if (currentPath !== '/') {
      navigate('/')
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const launchExamplesBrowser = () => {
    navigate('/examples')
  }

  const handleWalletConnect = async () => {
    await initWalletSelector()
    openWalletSelectorModal()
  }

  const handleWalletDisconnect = async () => {
    await disconnectWallet()
    setWalletAccountId(null)
    setWalletBalance(null)
    setWalletDropdownOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#111216]">
      {/* Navbar */}
      <Nav
        isDark={isDark}
        toggleTheme={toggleTheme}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToTop={scrollToTop}
        launchExamplesBrowser={launchExamplesBrowser}
        currentPath={currentPath}
        walletAccountId={walletAccountId}
        walletBalance={walletBalance}
        walletDropdownOpen={walletDropdownOpen}
        setWalletDropdownOpen={setWalletDropdownOpen}
        handleWalletConnect={handleWalletConnect}
        handleWalletDisconnect={handleWalletDisconnect}
      />

      {currentPath.startsWith('/examples') ? (
        <ExamplesBrowser isDark={isDark} toggleTheme={toggleTheme} />
      ) : (
      <>
        <Hero launchExamplesBrowser={launchExamplesBrowser} />
        <ThreeColumnFeatures />
        {/* <CTABanner launchExamplesBrowser={launchExamplesBrowser} /> */}
        <AgentMode launchExamplesBrowser={launchExamplesBrowser} />
        <NextEditSuggestions launchExamplesBrowser={launchExamplesBrowser} />
        <CodeWithExtensions launchExamplesBrowser={launchExamplesBrowser} />
        <CodeInAnyLanguage />
        <Footer scrollToTop={scrollToTop} />
      </>
      )}
    </div>
  )
}

export default App

