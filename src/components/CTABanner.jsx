import React from 'react'
import DotsPattern from './DotsPattern'

function CTABanner({ launchExamplesBrowser }) {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-[#111216] dark:via-[#111216] dark:to-[#111216] relative">
      <DotsPattern />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Start learning NEAR smart contracts for free
            </h2>
          </div>
          <div className="text-left md:text-right">
            <p className="text-gray-700 dark:text-white/90 mb-4 text-sm">
              No trial. No credit card required. Just start coding.
            </p>
            <button
              onClick={launchExamplesBrowser}
              className="px-6 py-3 text-base font-semibold text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white rounded-lg hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-near-primary transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTABanner
