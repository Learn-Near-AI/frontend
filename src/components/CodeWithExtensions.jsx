import React from 'react'
import { Code2, ArrowRight } from 'lucide-react'
import DotsPattern from './DotsPattern'

function CodeWithExtensions({ launchExamplesBrowser }) {
  return (
    <section className="py-20 bg-[#111216] relative">
      {/* <DotsPattern /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Explore by category
            </h2>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              Browse 60+ interactive examples organized by topic. From basics to advanced, find examples that match your skill level.
            </p>
            <button
              onClick={launchExamplesBrowser}
              className="inline-flex items-center text-near-primary hover:text-[#00D689] font-medium transition-colors mb-8"
            >
              Browse examples
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            {/* Category Grid */}
            <div className="grid grid-cols-3 gap-4">
              {['Basics', 'Tokens', 'Cross-Contract', 'Security', 'Data', 'Real-World'].map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-[#111216] rounded-lg p-4 border border-[#3e3e42] flex flex-col items-center justify-center min-h-[100px]"
                >
                  <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Code2 className="h-6 w-6 text-near-primary" />
                  </div>
                  <p className="text-xs text-center text-gray-400">{cat}</p>
                </div>
              ))}
            </div>
            <button
              onClick={launchExamplesBrowser}
              className="inline-flex items-center text-near-primary hover:text-[#00D689] font-medium transition-colors mt-4 text-sm"
            >
              View all 60+ examples
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Right - Placeholder */}
          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <div className="relative rounded-lg overflow-hidden border-2 border-near-primary shadow-2xl shadow-near-primary/20">
              <div className="bg-[#1e1e1e] p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Code2 className="h-16 w-16 mx-auto mb-4 text-near-primary/50" />
                  <p className="text-sm">Examples Browser Placeholder</p>
                  <p className="text-xs mt-2 text-gray-500">Image will be provided later</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CodeWithExtensions
