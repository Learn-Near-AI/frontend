import React from 'react'
import { Code2, ArrowRight } from 'lucide-react'
import DotsPattern from './DotsPattern'

function NextEditSuggestions({ launchExamplesBrowser }) {
  return (
    <section className="py-20 bg-[#111216] relative">
      <DotsPattern />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="order-2 lg:order-1" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Learn by doing
            </h2>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              Run code in your browser instantly. See results immediately and understand how NEAR smart contracts work through hands-on practice.
            </p>
            <button
              onClick={launchExamplesBrowser}
              className="inline-flex items-center text-near-primary hover:text-[#00D689] font-medium transition-colors"
            >
              Start coding now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Right - Image Placeholder */}
          <div className="order-1 lg:order-2 relative" data-aos="fade-up" data-aos-delay="200">
            <div className="relative rounded-lg overflow-hidden border-2 border-near-primary shadow-2xl shadow-near-primary/20">
              <div className="bg-[#1e1e1e] p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Code2 className="h-16 w-16 mx-auto mb-4 text-near-primary/50" />
                  <p className="text-sm">Code Editor Screenshot Placeholder</p>
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

export default NextEditSuggestions
