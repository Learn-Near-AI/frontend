import { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../lib/logger';
import { WORKING_EXAMPLES } from '../data/examples';

const STREAK_STORAGE_KEY = 'nearStreakData';
const BADGE_CLOSED_KEY = 'nearStreakBadgeClosed';
const PROGRESS_STORAGE_KEY = 'nearProgressData';

const INITIAL_UNLOCKED = ['intro', 'greeting'];

const StreakContext = createContext(null);

export function StreakProvider({ children }) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [showStreakBadge, setShowStreakBadge] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [completedExamples, setCompletedExamples] = useState([]);
  const [recentlyCompleted, setRecentlyCompleted] = useState(null);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const badgeClosed = localStorage.getItem(BADGE_CLOSED_KEY);
    if (badgeClosed === 'true') {
      setShowStreakBadge(false);
    }
  }, []);

  useEffect(() => {
    const progressData = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || '{}');
    setCompletedExamples(progressData.completedExamples || []);
  }, []);

  useEffect(() => {
    if (currentPath === '/') return;

    const today = new Date().toDateString();
    const streakData = JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) || '{}');

    const lastVisit = streakData.lastVisit;
    const streak = streakData.currentStreak || 0;
    const longest = streakData.longestStreak || 0;
    const visits = streakData.totalVisits || 0;

    if (lastVisit === today) {
      setCurrentStreak(streak);
      setLongestStreak(longest);
      setTotalVisits(visits);
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = 1;
    if (lastVisit === yesterdayStr) {
      newStreak = streak + 1;
    } else if (lastVisit) {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, longest);
    const newVisits = visits + 1;

    localStorage.setItem(
      STREAK_STORAGE_KEY,
      JSON.stringify({
        lastVisit: today,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalVisits: newVisits,
        firstVisit: streakData.firstVisit || today,
      })
    );

    setCurrentStreak(newStreak);
    setLongestStreak(newLongest);
    setTotalVisits(newVisits);

    if (newVisits === 1 || newStreak % 7 === 0 || newStreak === newLongest) {
      setTimeout(() => setModalOpen(true), 1000);
    }
  }, [currentPath]);

  const closeBadge = (e) => {
    e?.stopPropagation();
    setShowStreakBadge(false);
    localStorage.setItem(BADGE_CLOSED_KEY, 'true');
  };

  const reopenBadge = () => {
    setShowStreakBadge(true);
    localStorage.removeItem(BADGE_CLOSED_KEY);
  };

  const isExampleUnlocked = (exampleId) => {
    if (INITIAL_UNLOCKED.includes(exampleId)) return true;
    if (!WORKING_EXAMPLES.includes(exampleId)) return false;
    const exampleIndex = WORKING_EXAMPLES.indexOf(exampleId);
    if (exampleIndex <= 0) return false;
    const previousExampleId = WORKING_EXAMPLES[exampleIndex - 1];
    return completedExamples.includes(previousExampleId);
  };

  const getUnlockedCount = () => {
    return (
      completedExamples.filter((id) => WORKING_EXAMPLES.includes(id)).length +
      INITIAL_UNLOCKED.length
    );
  };

  const completeExample = (exampleId) => {
    if (completedExamples.includes(exampleId)) return;
    const newCompleted = [...completedExamples, exampleId];
    setCompletedExamples(newCompleted);
    setRecentlyCompleted(exampleId);
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        completedExamples: newCompleted,
        lastCompleted: exampleId,
      })
    );
    setTimeout(() => setRecentlyCompleted(null), 2000);
  };

  const getStreakMessage = () => {
    if (currentStreak === 1) return 'Great start! Come back tomorrow to build your streak! 🎯';
    if (currentStreak < 7)
      return `Keep it up! ${7 - currentStreak} more days to your first week! 💪`;
    if (currentStreak === 7) return "Amazing! You've completed a full week! 🎉";
    if (currentStreak < 30)
      return `Fantastic! You're on fire! ${30 - currentStreak} days to reach 30! 🔥`;
    if (currentStreak === 30) return 'Incredible! 30-day streak master! 🏆';
    return "You're a NEAR legend! Keep the momentum going! ⚡";
  };

  const value = {
    currentStreak,
    longestStreak,
    totalVisits,
    showStreakBadge,
    modalOpen,
    setModalOpen,
    closeBadge,
    reopenBadge,
    getStreakMessage,
    completedExamples,
    isExampleUnlocked,
    getUnlockedCount,
    completeExample,
    recentlyCompleted,
    currentPath,
    setCurrentPath,
  };

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreak() {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
}
