import React, { useState, useMemo, useEffect } from 'react'
import { examplesData, categoryIcons, categoryOrder, WORKING_EXAMPLES } from '../data/examples'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CategorySidebar from './CategorySidebar'
import SearchBar from './SearchBar'
import FiltersPanel from './FiltersPanel'
import WelcomeContent from './WelcomeContent'
import ExampleDetail from './ExampleDetail'
import SuccessPage from './SuccessPage'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet'

function ExamplesBrowser({ isDark, toggleTheme }) {
  const [selectedExample, setSelectedExample] = useState(null)
  const [comingSoonExample, setComingSoonExample] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedCategories, setSelectedCategories] = useState(['All'])
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    // Hide sidebar by default on mobile, show on desktop
    return window.innerWidth >= 1024
  })
  const [expandedCategories, setExpandedCategories] = useState(() => {
    // Initialize all categories as collapsed by default
    return Object.keys(examplesData).reduce((acc, cat) => {
      acc[cat] = false
      return acc
    }, {})
  })

  // Listen to path changes
  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname)
    }
    
    window.addEventListener('popstate', handlePathChange)
    // Also check on mount and when path might change
    const interval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname)
      }
    }, 100)
    
    return () => {
      window.removeEventListener('popstate', handlePathChange)
      clearInterval(interval)
    }
  }, [currentPath])

  // Handle transactionHashes URL parameter - redirect to success page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const transactionHashes = urlParams.get('transactionHashes')
    
    if (transactionHashes && !window.location.pathname.includes('/success')) {
      // Redirect to success page with transaction hash
      window.history.replaceState({}, '', `/examples/success?transactionHashes=${transactionHashes}`)
      window.location.href = `/examples/success?transactionHashes=${transactionHashes}`
    }
  }, [])

  // Handle window resize to update sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (window.innerWidth >= 1024) {
        setSidebarVisible(true)
      } else {
        setSidebarVisible(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Flatten all examples for search
  const allExamples = useMemo(() => {
    return Object.entries(examplesData).flatMap(([category, examples]) =>
      examples.map(example => ({ ...example, category }))
    )
  }, [])

  // Filter examples based on search, difficulty, and categories
  const filteredExamples = useMemo(() => {
    let filtered = allExamples

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(example =>
        example.name.toLowerCase().includes(query) ||
        example.id.toLowerCase().includes(query) ||
        example.category.toLowerCase().includes(query) ||
        example.difficulty.toLowerCase().includes(query) ||
        example.language.toLowerCase().includes(query)
      )
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(example => example.difficulty === selectedDifficulty)
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
      filtered = filtered.filter(example => selectedCategories.includes(example.category))
    }

    return filtered
  }, [allExamples, searchQuery, selectedDifficulty, selectedCategories])

  // Group filtered examples by category for sidebar
  const groupedExamples = useMemo(() => {
    const grouped = {}
    filteredExamples.forEach(example => {
      if (!grouped[example.category]) {
        grouped[example.category] = []
      }
      grouped[example.category].push(example)
    })
    return grouped
  }, [filteredExamples])

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const handleExampleSelect = (example) => {
    // Check if example has working code implementation
    if (WORKING_EXAMPLES.includes(example.id)) {
      setSelectedExample(example)
      setComingSoonExample(null)
    } else {
      setComingSoonExample(example)
      setSelectedExample(null)
    }
  }

  const handleBackToBrowse = () => {
    setSelectedExample(null)
    setComingSoonExample(null)
    // If on success page, navigate back to /examples
    if (window.location.pathname.includes('/success')) {
      // Remove /success from path and clean up URL params
      const newPath = '/examples'
      window.history.pushState({}, '', newPath)
      setCurrentPath(newPath)
    }
  }

  // Sort available categories by learning complexity order
  const availableCategories = Object.keys(examplesData).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a)
    const indexB = categoryOrder.indexOf(b)
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    return a.localeCompare(b)
  })
  const availableDifficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="min-h-screen pt-16 bg-[#111216]">
      {/* Top Bar with Search and Filters */}
      <div className="sticky top-16 z-40 bg-[#111216] border-b border-[#3e3e42]">
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex-1">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
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
          className={`absolute ${sidebarVisible ? 'lg:left-[calc(20%-0.5rem)] left-0' : 'left-0'} top-0 z-30 p-2 bg-[#111216] border border-[#3e3e42] rounded hover:bg-[#1a1b1f] transition-all duration-300 shadow-lg`}
          aria-label={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarVisible ? (
            <ChevronLeft className="h-5 w-5 text-gray-300" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-300" />
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
                    handleExampleSelect(example)
                    setSidebarVisible(false)
                  }}
                  categoryIcons={categoryIcons}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Sidebar - 20% width */}
        <div className={`hidden lg:block lg:w-1/5 border-r border-[#3e3e42] bg-[#111216] rounded-t-xl h-[calc(100vh)] ${sidebarVisible ? '' : 'lg:hidden'}`}>
          <CategorySidebar
            groupedExamples={groupedExamples}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            selectedExample={selectedExample}
            handleExampleSelect={handleExampleSelect}
            categoryIcons={categoryIcons}
          />
        </div>

        {/* Main Content Area - expands when sidebar is hidden */}
        <div className="flex-1 bg-[#111216] transition-all duration-300">
          {currentPath.includes('/success') ? (
            <SuccessPage onBack={handleBackToBrowse} />
          ) : selectedExample ? (
            <ExampleDetail example={selectedExample} onBack={handleBackToBrowse} />
          ) : comingSoonExample ? (
            <div className="p-8 max-w-3xl mx-auto">
              <button
                onClick={handleBackToBrowse}
                className="text-sm text-gray-400 hover:text-near-primary mb-4"
              >
                ← Back to examples
              </button>
              <div className="bg-[#111216] rounded-xl border border-dashed border-[#3e3e42] p-6 text-center space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  {comingSoonExample.name}
                </h2>
                <p className="text-sm text-gray-400">
                  The full interactive learning interface for this example is coming soon.
                </p>
                <p className="text-sm text-gray-400">
                  This example is currently under development. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <WelcomeContent filteredExamples={filteredExamples} onExampleSelect={handleExampleSelect} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExamplesBrowser

