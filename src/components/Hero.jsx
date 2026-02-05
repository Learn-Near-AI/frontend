import React from 'react'
import BinaryPattern from './BinaryPattern'

function Hero({ launchExamplesBrowser }) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#111216] pt-16 binary-pattern" data-aos="fade-in">
      <BinaryPattern />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20 z-10">
        <div className="text-center" data-aos="fade-up" data-aos-delay="100">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white max-w-2xl mx-auto">
            Learn NEAR Smart Contracts by Doing
          </h1>
          
          {/* Download Button */}
          <div className="mt-8 flex justify-center" data-aos="fade-up" data-aos-delay="200">
            <button
              onClick={launchExamplesBrowser}
              className="water-fill-button relative inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-[#111216] border border-gray-300 dark:border-[#3e3e42] rounded-lg overflow-hidden transition-all duration-200 z-10"
            >
              <span className="relative z-10 water-fill-text">Launch</span>
            </button>
          </div>
          
          <style>{`
            .water-fill-button {
              isolation: isolate;
            }
            
            .water-fill-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 0%;
              height: 100%;
              background: linear-gradient(to right, #00EC97, #00D689);
              transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              z-index: 0;
              border-radius: 0.5rem;
            }
            
            .water-fill-button:hover::before {
              width: 100%;
            }
            
            .water-fill-button:not(:hover)::before {
              transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .water-fill-button:hover {
              border-color: #00EC97;
            }
            
            .water-fill-button .water-fill-text {
              transition: color 0.3s ease;
            }
            
            .water-fill-button:hover .water-fill-text {
              color: #000;
            }
          `}</style>

          {/* Secondary Text */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400" data-aos="fade-up" data-aos-delay="300">
            Run code in your browser. Deploy to TestNet in one click.
          </div>

          {/* Main Editor Screenshot Placeholder */}
          <div className="mt-10 max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="400">
            <div className="relative rounded-xl p-[8px] bg-gradient-to-r from-near-primary via-[#00D689] to-near-primary">
              <div className="relative rounded-lg overflow-hidden">
                <img src="/assets/images/1.png" alt="Hero Screenshot" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
