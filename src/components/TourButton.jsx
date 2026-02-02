import React, { useState, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'

const STORAGE_KEY = 'near_examples_tour_completed'

function TourButton({ onStartTour }) {
  const [isPulsing, setIsPulsing] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Check if user has completed the tour
    const hasCompletedTour = localStorage.getItem(STORAGE_KEY)
    
    // Get streak data
    const streakData = JSON.parse(localStorage.getItem('nearStreakData') || '{}')
    const currentStreak = streakData.currentStreak || 0
    
    // Show pulsing animation for users with 0-5 day streak (including first-time users) who haven't completed tour
    if (!hasCompletedTour && currentStreak <= 5) {
      setIsPulsing(true)
      setShowTooltip(true)
      
      // Auto-hide tooltip after 10 seconds
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(false)
      }, 10000)

      return () => clearTimeout(tooltipTimer)
    }
  }, [])

  const handleStartTour = () => {
    setIsPulsing(false)
    setShowTooltip(false)
    if (onStartTour) {
      onStartTour()
    }
  }

  const handleDismissTooltip = () => {
    setShowTooltip(false)
    setIsPulsing(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip for first-time users */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42] rounded-lg shadow-xl p-4 animate-in slide-in-from-bottom-2">
          <button
            onClick={handleDismissTooltip}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Dismiss tooltip"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="pr-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              👋 First time here?
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Take a quick tour to learn how to use NEAR examples!
            </p>
            <button
              onClick={handleStartTour}
              className="w-full px-3 py-2 text-xs bg-near-primary text-near-darker font-semibold rounded-lg hover:bg-[#00D689] transition-colors"
            >
              Start Tour
            </button>
          </div>
          {/* Arrow pointing to button */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-[#1a1b1f] border-r border-b border-gray-200 dark:border-[#3e3e42] transform rotate-45" />
        </div>
      )}

      {/* Floating help button */}
      <button
        onClick={handleStartTour}
        className={`group relative bg-near-primary hover:bg-[#00D689] text-near-darker rounded-full p-4 shadow-lg transition-all duration-300 ${
          isPulsing ? 'animate-pulse' : ''
        }`}
        title="Start guided tour"
        aria-label="Start guided tour"
      >
        <HelpCircle className="h-6 w-6" />
        
        {/* Ripple effect for first-time users */}
        {isPulsing && (
          <>
            <span className="absolute inset-0 rounded-full bg-near-primary animate-ping opacity-75" />
            <span className="absolute inset-0 rounded-full bg-near-primary animate-pulse" />
          </>
        )}

        {/* Hover tooltip */}
        <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-gray-200 dark:border-[#3e3e42]">
          Take a guided tour
          <span className="absolute -bottom-1 right-4 w-2 h-2 bg-white dark:bg-[#1a1b1f] border-r border-b border-gray-200 dark:border-[#3e3e42] transform rotate-45" />
        </span>
      </button>
    </div>
  )
}

export default TourButton
