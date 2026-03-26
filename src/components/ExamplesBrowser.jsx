import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { examplesData, categoryIcons, categoryOrder, WORKING_EXAMPLES } from '../data/examples';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOBILE_BREAKPOINT_PX, TOUR_STREAK_THRESHOLD } from '../lib/appConstants';
import CategorySidebar from './CategorySidebar';
import SearchBar from './SearchBar';
import FiltersPanel from './FiltersPanel';
import WelcomeContent from './WelcomeContent';
import ExampleDetail from './ExampleDetail';
import SuccessPage from './SuccessPage';
import { Sheet, SheetContent } from './ui/sheet';
import { useStreak } from '../hooks/useStreak';

const TOUR_STORAGE_KEY = 'near_examples_tour_completed';

function ExamplesBrowser({ isDark, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { isExampleUnlocked, completedExamples } = useStreak(currentPath);

  const [selectedExample, setSelectedExample] = useState(null);
  const [comingSoonExample, setComingSoonExample] = useState(null);
  const [shouldStartTour, setShouldStartTour] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT_PX);
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    return window.innerWidth >= MOBILE_BREAKPOINT_PX;
  });
  const [expandedCategories, setExpandedCategories] = useState(() => {
    return Object.keys(examplesData).reduce((acc, cat) => {
      acc[cat] = false;
      return acc;
    }, {});
  });

  // Flatten all examples for search
  const allExamples = useMemo(() => {
    return Object.entries(examplesData).flatMap(([category, examples]) =>
      examples.map((example) => ({ ...example, category }))
    );
  }, []);

  const handleExampleSelect = (example) => {
    if (!isExampleUnlocked(example.id)) return;
    window.history.pushState(null, '', `#${example.id}`);
    if (WORKING_EXAMPLES.includes(example.id)) {
      setSelectedExample(example);
      setComingSoonExample(null);
    } else {
      setComingSoonExample(example);
      setSelectedExample(null);
    }
  };

  // Handle window resize to update sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT_PX;
      setIsMobile(mobile);
      if (window.innerWidth >= MOBILE_BREAKPOINT_PX) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-select first example for tour if user should see it
  useEffect(() => {
    // Only run on mount and when on examples route
    if (!currentPath.startsWith('/examples') || currentPath.includes('/success')) {
      return;
    }

    // Handle URL hash navigation (e.g., /examples/#intro, /examples/#events)
    const hash = location.hash.slice(1);
    if (hash) {
      const exampleById = allExamples.find((ex) => ex.id === hash);
      if (exampleById) {
        handleExampleSelect(exampleById);
        return;
      }
    }

    const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
    const streakData = JSON.parse(localStorage.getItem('nearStreakData') || '{}');
    const currentStreak = streakData.currentStreak || 0;

    const shouldShowTour = !hasCompletedTour && currentStreak <= TOUR_STREAK_THRESHOLD;

    if (shouldShowTour && !selectedExample && !comingSoonExample) {
      // Auto-select the first working example
      const firstWorkingExampleId = WORKING_EXAMPLES[0];
      const firstExample = Object.values(examplesData)
        .flat()
        .find((ex) => ex.id === firstWorkingExampleId);

      if (firstExample) {
        setSelectedExample(firstExample);
        setShouldStartTour(true);
      }
    }
  }, [currentPath, selectedExample, comingSoonExample, allExamples, handleExampleSelect]);

  // Handle hash changes while on the page
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash && !selectedExample) {
      const exampleById = allExamples.find((ex) => ex.id === hash);
      if (exampleById) {
        handleExampleSelect(exampleById);
      }
    }
  }, [location.hash, allExamples, selectedExample]);

  // Filter examples based on search, difficulty, and categories
  const filteredExamples = useMemo(() => {
    let filtered = allExamples;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (example) =>
          example.name.toLowerCase().includes(query) ||
          example.id.toLowerCase().includes(query) ||
          example.category.toLowerCase().includes(query) ||
          example.difficulty.toLowerCase().includes(query) ||
          example.language.toLowerCase().includes(query)
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter((example) => example.difficulty === selectedDifficulty);
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
      filtered = filtered.filter((example) => selectedCategories.includes(example.category));
    }

    return filtered;
  }, [allExamples, searchQuery, selectedDifficulty, selectedCategories]);

  // Group filtered examples by category for sidebar
  const groupedExamples = useMemo(() => {
    const grouped = {};
    filteredExamples.forEach((example) => {
      if (!grouped[example.category]) {
        grouped[example.category] = [];
      }
      grouped[example.category].push(example);
    });
    return grouped;
  }, [filteredExamples]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleBackToBrowse = () => {
    setSelectedExample(null);
    setComingSoonExample(null);
    window.history.pushState(null, '', '#');
    if (currentPath.includes('/success')) {
      navigate('/examples');
    }
  };

  // Sort available categories by learning complexity order
  const availableCategories = Object.keys(examplesData).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
  const availableDifficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-[#111216]">
      {/* Top Bar with Search and Filters */}
      <div className="sticky top-16 z-40 bg-white dark:bg-[#111216] border-b border-gray-200 dark:border-[#3e3e42]">
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex-1">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <FiltersPanel
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            availableCategories={availableCategories}
            availableDifficulties={availableDifficulties}
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6 relative">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className={`absolute ${
            sidebarVisible ? 'lg:left-[calc(20%-0.5rem)] left-0' : 'left-0'
          } top-0 z-30 p-2 bg-white dark:bg-[#111216] border border-gray-200 dark:border-[#3e3e42] rounded hover:bg-gray-100 dark:hover:bg-[#1a1b1f] transition-all duration-300 shadow-lg`}
          aria-label={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarVisible ? (
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Mobile Sheet Sidebar */}
        {isMobile && (
          <Sheet open={sidebarVisible} onOpenChange={setSidebarVisible}>
            <SheetContent side="left" className="w-full p-0">
              <div className="h-full">
                <CategorySidebar
                  groupedExamples={groupedExamples}
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  selectedExample={selectedExample}
                  handleExampleSelect={(example) => {
                    handleExampleSelect(example);
                    setSidebarVisible(false);
                  }}
                  categoryIcons={categoryIcons}
                  isExampleUnlocked={isExampleUnlocked}
                  completedExamples={completedExamples}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Sidebar - 20% width */}
        <div
          className={`tour-example-sidebar hidden lg:block lg:w-1/5 border-r border-gray-200 dark:border-[#3e3e42] bg-white dark:bg-[#111216] rounded-t-xl h-[calc(100vh)] ${
            sidebarVisible ? '' : 'lg:hidden'
          }`}
        >
          <CategorySidebar
            groupedExamples={groupedExamples}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            selectedExample={selectedExample}
            handleExampleSelect={handleExampleSelect}
            categoryIcons={categoryIcons}
            isExampleUnlocked={isExampleUnlocked}
            completedExamples={completedExamples}
          />
        </div>

        {/* Main Content Area - expands when sidebar is hidden */}
        <div className="flex-1 bg-white dark:bg-[#111216] transition-all duration-300">
          {currentPath.includes('/success') ? (
            <SuccessPage onBack={handleBackToBrowse} />
          ) : selectedExample ? (
            <ExampleDetail
              example={selectedExample}
              onBack={handleBackToBrowse}
              shouldStartTour={shouldStartTour}
              onTourStart={() => setShouldStartTour(false)}
            />
          ) : comingSoonExample ? (
            <div className="p-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-[#111216] rounded-xl border border-dashed border-gray-300 dark:border-[#3e3e42] p-4 sm:p-6 text-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {comingSoonExample.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The full interactive learning interface for this example is coming soon.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This example is currently under development. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <WelcomeContent
              filteredExamples={filteredExamples}
              onExampleSelect={handleExampleSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}

ExamplesBrowser.propTypes = {
  isDark: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ExamplesBrowser;
