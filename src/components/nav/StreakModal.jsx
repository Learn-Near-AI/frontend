import React, { useEffect } from 'react'
import { Flame, Trophy, Calendar, Target, Zap } from 'lucide-react'
import { logger } from '../../lib/logger'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export default function StreakModal({
  open,
  onOpenChange,
  currentStreak,
  longestStreak,
  totalVisits,
  getStreakMessage,
}) {
  useEffect(() => {
    if (open) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const playNote = (frequency, startTime, duration) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          oscillator.frequency.value = frequency
          oscillator.type = 'sine'
          gainNode.gain.setValueAtTime(0, startTime)
          gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
          oscillator.start(startTime)
          oscillator.stop(startTime + duration)
        }
        const now = audioContext.currentTime
        playNote(523.25, now, 0.15)
        playNote(659.25, now + 0.1, 0.15)
        playNote(783.99, now + 0.2, 0.25)
      } catch (error) {
        logger.debug('Audio not available:', error)
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#111216] border border-gray-200 dark:border-[#3e3e42]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Flame className="h-6 w-6 text-orange-500" />
            Your Learning Streak
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {getStreakMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="p-3 rounded-full bg-orange-500/20">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{currentStreak}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-gray-400">Best Streak</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{longestStreak}</div>
            </div>

            <div className="p-4 rounded-lg bg-gray-100 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-400">Total Visits</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalVisits}</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-100 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42]">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-near-primary" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Next Milestones
              </span>
            </div>
            <div className="space-y-2">
              {currentStreak < 7 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">7-day streak</span>
                  <span className="text-near-primary font-semibold">{7 - currentStreak} days left</span>
                </div>
              )}
              {currentStreak < 30 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">30-day streak</span>
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
          onClick={() => onOpenChange(false)}
          className="w-full px-4 py-2 text-sm font-semibold bg-near-primary text-near-darker rounded-lg hover:bg-[#00D689] transition-colors"
        >
          Keep Learning!
        </button>
      </DialogContent>
    </Dialog>
  )
}
