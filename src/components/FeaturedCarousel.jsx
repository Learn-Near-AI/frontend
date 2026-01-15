import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { difficultyColors, languageIcons } from '../data/examples'

function FeaturedCarousel({ examples, onExampleSelect }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(examples.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentExamples = examples.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )

  if (examples.length === 0) return null

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentExamples.map((example) => {
          const difficultyClass = difficultyColors[example.difficulty] || difficultyColors['Beginner']
          const languageIcon = languageIcons[example.language] || '📄'

          return (
            <button
              key={example.id}
              onClick={() => onExampleSelect(example)}
              className="bg-[#111216] rounded-xl p-6 border border-[#3e3e42] hover:border-gray-500 transition-all duration-300 transform hover:-translate-y-2 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {/* <span className="text-2xl">{languageIcon}</span> */}
                  <h3 className="text-lg font-bold text-white transition-colors">
                    {example.name}
                  </h3>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${difficultyClass}`}
                >
                  {example.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {example.category}
              </p>
              <div className="flex items-center justify-end text-near-primary text-xs font-medium group-hover:gap-2 transition-all">
                View example
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      {totalPages > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-[#111216] border border-[#3e3e42] rounded-full flex items-center justify-center hover:bg-[#1a1b1f] transition-colors shadow-lg"
            aria-label="Previous examples"
          >
            <ChevronLeft className="h-5 w-5 text-gray-300" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-[#111216] border border-[#3e3e42] rounded-full flex items-center justify-center hover:bg-[#1a1b1f] transition-colors shadow-lg"
            aria-label="Next examples"
          >
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-near-primary w-8'
                  : 'bg-[#3e3e42] hover:bg-[#4a4a4f]'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FeaturedCarousel






