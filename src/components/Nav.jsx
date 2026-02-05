import React from 'react'
import { Menu, X, Sun, Moon, ExternalLink, Flame } from 'lucide-react'
import { config } from '../config'
import { useStreak } from '../hooks/useStreak'
import NavWallet from './nav/NavWallet'
import StreakModal from './nav/StreakModal'

function Nav({
  isDark,
  toggleTheme,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToTop,
  launchExamplesBrowser,
  currentPath,
  navigate,
}) {
  const {
    currentStreak,
    longestStreak,
    totalVisits,
    showStreakBadge,
    modalOpen,
    setModalOpen,
    closeBadge,
    reopenBadge,
    getStreakMessage,
  } = useStreak(currentPath)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111216]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#3e3e42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={scrollToTop}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src="/assets/images/vecteezy.png"
              alt="NEAR Logo"
              className="w-8 h-8 object-contain rotate-slow"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
              NEAR by Example
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={launchExamplesBrowser}
              className="text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors font-medium"
            >
              Examples
            </button>
            <a
              href={config.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors font-medium"
            >
              Docs
            </a>
            <button
              onClick={() => navigate('/roadmap')}
              className={`transition-colors font-medium ${
                currentPath === '/roadmap'
                  ? 'text-near-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:text-near-primary'
              }`}
            >
              Roadmap
            </button>
            <a
              href={config.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors font-medium flex items-center gap-1"
            >
              Learn
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {currentPath === '/' && (
              <button
                onClick={launchExamplesBrowser}
                className="hidden md:block px-4 py-2 text-sm font-semibold text-near-darker bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200"
              >
                Get started
              </button>
            )}

            {currentPath !== '/' && showStreakBadge && (
              <button
                onClick={() => setModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 relative group"
                title="View your streak"
              >
                <Flame className="h-4 w-4" />
                <span>{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</span>
              </button>
            )}

            {currentPath !== '/' && !showStreakBadge && (
              <button
                onClick={reopenBadge}
                className="hidden md:flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-[#3e3e42] text-gray-500 dark:text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
                title="Show streak"
              >
                <Flame className="h-4 w-4" />
              </button>
            )}

            <NavWallet currentPath={currentPath} />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-[#3e3e42] py-4">
            <div className="flex flex-col gap-4">
              {currentPath !== '/' && showStreakBadge && (
                <button
                  onClick={() => {
                    setModalOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5" />
                    <span className="font-semibold">{currentStreak} Day Streak</span>
                  </div>
                  <button
                    onClick={(e) => {
                      closeBadge(e)
                      setMobileMenuOpen(false)
                    }}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </button>
              )}

              {currentPath !== '/' && !showStreakBadge && (
                <button
                  onClick={reopenBadge}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-[#3e3e42] text-gray-500 dark:text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
                >
                  <Flame className="h-5 w-5" />
                  <span>Show Streak</span>
                </button>
              )}

              <button
                onClick={launchExamplesBrowser}
                className="text-left text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
              >
                Examples
              </button>
              <a
                href={config.links.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
              >
                Docs
              </a>
              <button
                onClick={() => navigate('/roadmap')}
                className={`text-left transition-colors font-medium py-2 ${
                  currentPath === '/roadmap'
                    ? 'text-near-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:text-near-primary'
                }`}
              >
                Roadmap
              </button>
              <a
                href={config.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2 flex items-center gap-1"
              >
                Learn
                <ExternalLink className="h-4 w-4" />
              </a>
              {currentPath === '/' && (
                <button
                  onClick={launchExamplesBrowser}
                  className="w-full px-4 py-2 text-sm font-semibold text-white bg-near-primary hover:bg-[#00D689] rounded-lg"
                >
                  Get started
                </button>
              )}
              <NavWallet currentPath={currentPath} mobile />
            </div>
          </div>
        )}
      </div>

      <StreakModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        totalVisits={totalVisits}
        getStreakMessage={getStreakMessage}
      />
    </nav>
  )
}

export default Nav
