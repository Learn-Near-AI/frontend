import React from 'react'
import { Code2 } from 'lucide-react'
import BinaryPattern from './BinaryPattern'

function Hero({ launchExamplesBrowser }) {
  return (
    <section className="relative overflow-hidden bg-[#111216] pt-16 binary-pattern" data-aos="fade-in">
      <BinaryPattern />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20 z-10">
        <div className="text-center" data-aos="fade-up" data-aos-delay="100">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-white max-w-2xl mx-auto">
            Learn NEAR Smart Contracts by Doing
          </h1>
          
          {/* Download Button */}
          <div className="mt-8 flex justify-center" data-aos="fade-up" data-aos-delay="200">
            <button
              onClick={launchExamplesBrowser}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-[#111216] border border-[#3e3e42] rounded-lg hover:bg-[#1a1b1f] transition-all duration-200"
            >
              Launch
            </button>
          </div>

          {/* Secondary Text */}
          <div className="mt-6 text-xs text-gray-400" data-aos="fade-up" data-aos-delay="300">
            Run code in your browser. Deploy to TestNet in one click.
          </div>

          {/* Main Editor Screenshot Placeholder */}
          <div className="mt-12 max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="400">
            <div className="relative rounded-lg overflow-hidden border-2 border-near-primary shadow-2xl shadow-near-primary/20">
              <div className="bg-[#1e1e1e] p-6 min-h-[500px] flex items-center justify-center">
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

export default Hero
