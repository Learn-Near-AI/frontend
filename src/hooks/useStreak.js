import { useState, useEffect } from 'react'
import { logger } from '../lib/logger'

const STREAK_STORAGE_KEY = 'nearStreakData'
const BADGE_CLOSED_KEY = 'nearStreakBadgeClosed'

export function useStreak(currentPath) {
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalVisits, setTotalVisits] = useState(0)
  const [showStreakBadge, setShowStreakBadge] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const badgeClosed = localStorage.getItem(BADGE_CLOSED_KEY)
    if (badgeClosed === 'true') {
      setShowStreakBadge(false)
    }
  }, [])

  useEffect(() => {
    if (currentPath === '/') return

    const today = new Date().toDateString()
    const streakData = JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) || '{}')

    const lastVisit = streakData.lastVisit
    const streak = streakData.currentStreak || 0
    const longest = streakData.longestStreak || 0
    const visits = streakData.totalVisits || 0

    if (lastVisit === today) {
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
      newStreak = streak + 1
    } else if (lastVisit) {
      newStreak = 1
    }

    const newLongest = Math.max(newStreak, longest)
    const newVisits = visits + 1

    localStorage.setItem(
      STREAK_STORAGE_KEY,
      JSON.stringify({
        lastVisit: today,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalVisits: newVisits,
        firstVisit: streakData.firstVisit || today,
      })
    )

    setCurrentStreak(newStreak)
    setLongestStreak(newLongest)
    setTotalVisits(newVisits)

    if (newVisits === 1 || newStreak % 7 === 0 || newStreak === newLongest) {
      setTimeout(() => setModalOpen(true), 1000)
    }
  }, [currentPath])

  const closeBadge = (e) => {
    e?.stopPropagation()
    setShowStreakBadge(false)
    localStorage.setItem(BADGE_CLOSED_KEY, 'true')
  }

  const reopenBadge = () => {
    setShowStreakBadge(true)
    localStorage.removeItem(BADGE_CLOSED_KEY)
  }

  const getStreakMessage = () => {
    if (currentStreak === 1) return "Great start! Come back tomorrow to build your streak! 🎯"
    if (currentStreak < 7) return `Keep it up! ${7 - currentStreak} more days to your first week! 💪`
    if (currentStreak === 7) return "Amazing! You've completed a full week! 🎉"
    if (currentStreak < 30) return `Fantastic! You're on fire! ${30 - currentStreak} days to reach 30! 🔥`
    if (currentStreak === 30) return "Incredible! 30-day streak master! 🏆"
    return "You're a NEAR legend! Keep the momentum going! ⚡"
  }

  return {
    currentStreak,
    longestStreak,
    totalVisits,
    showStreakBadge,
    modalOpen,
    setModalOpen,
    closeBadge,
    reopenBadge,
    getStreakMessage,
  }
}
