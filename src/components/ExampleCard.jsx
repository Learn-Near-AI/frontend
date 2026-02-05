import React from 'react'
import { difficultyColors, languageIcons } from '../data/examples'

function ExampleCard({ example, isSelected, onClick }) {
  const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner']
  const languageIcon = languageIcons[example.language] || '📄'

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3.5 rounded border-b border-gray-200 dark:border-[#3e3e42] transition-all duration-200 ${
        isSelected
          ? 'border-l border-near-primary text-gray-900 dark:text-white'
          : 'hover:bg-gray-100 dark:hover:bg-[#1a1b1f] text-gray-700 dark:text-gray-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`text-sm truncate ${isSelected ? 'font-semibold' : 'font-medium'}`}>
            {example.name}
          </span>
        </div>
        <span
          className={`text-[8px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${difficultyClass}`}
        >
          {example.difficulty.charAt(0)}
        </span>
      </div>
    </button>
  )
}

export default ExampleCard

