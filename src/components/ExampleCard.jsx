import React from 'react';
import { Lock } from 'lucide-react';
import { difficultyColors, languageIcons } from '../data/examples';

function ExampleCard({ example, isSelected, onClick, isLocked, isCompleted }) {
  const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner'];
  const languageIcon = languageIcons[example.language] || '📄';

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`w-full text-left px-3 py-3.5 rounded border-b border-gray-200 dark:border-[#3e3e42] transition-all duration-200 ${
        isLocked
          ? 'opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-600'
          : isSelected
            ? 'border-l border-near-primary text-gray-900 dark:text-white'
            : 'hover:bg-gray-100 dark:hover:bg-[#1a1b1f] text-gray-700 dark:text-gray-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isLocked && <Lock className="h-3 w-3 flex-shrink-0 text-gray-400" />}
          <span className={`text-sm truncate ${isSelected ? 'font-semibold' : 'font-medium'}`}>
            {example.name}
          </span>
          {isCompleted && !isLocked && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 flex-shrink-0">
              ✓
            </span>
          )}
        </div>
        <span
          className={`text-[8px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${difficultyClass}`}
        >
          {example.difficulty.charAt(0)}
        </span>
      </div>
    </button>
  );
}

export default ExampleCard;
