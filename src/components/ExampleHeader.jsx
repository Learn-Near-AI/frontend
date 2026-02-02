import React from 'react'
import { difficultyColors, categoryIcons } from '../data/examples'

function ExampleHeader({ example, activeLanguage }) {
  const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner']
  const categoryIcon = categoryIcons[example.category] || '📁'

  return (
    <div className="bg-white dark:bg-[#111216] rounded-xl p-5 md:p-6 border border-gray-200 dark:border-[#3e3e42]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {categoryIcon.startsWith('/') ? (
            <img 
              src={categoryIcon} 
              alt={example.category} 
              className="w-8 h-8 md:w-12 md:h-12 object-contain flex-shrink-0"
            />
          ) : (
            <div className="text-4xl flex-shrink-0">{categoryIcon}</div>
          )}
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {example.name}
            </h1> 
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {example.category} • {activeLanguage}
            </p>
          </div>
        </div>
        <span
          className={`text-xs md:text-sm px-3 py-1 md:px-4 md:py-1.5 rounded-full border ${difficultyClass} font-medium whitespace-nowrap`}
        >
          {example.difficulty}
        </span>
      </div>
    </div>
  )
}

export default ExampleHeader

