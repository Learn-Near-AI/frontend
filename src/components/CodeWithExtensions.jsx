import React from 'react';
import { Code2, ArrowRight } from 'lucide-react';
import DotsPattern from './DotsPattern';
import { categoryIcons } from '../data/examples';

function CodeWithExtensions({ launchExamplesBrowser }) {
  const categories = Object.keys(categoryIcons).filter((cat) => cat !== 'Basics' && cat !== 'NFTs');

  return (
    <section className="py-20 bg-white dark:bg-[#111216] relative">
      {/* <DotsPattern /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className=" items-center">
          {/* Left - Text */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
              Explore by category
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-4 sm:mb-6 leading-relaxed text-center">
              Browse 60+ interactive examples organized by topic. From basics to advanced, find
              examples that match your skill level.
            </p>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const icon = categoryIcons[cat] || '📁';
                return (
                  <div
                    key={cat}
                    className="bg-white dark:bg-[#111216] rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-[#3e3e42] flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px]"
                  >
                    <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-2">
                      {icon.startsWith('/') ? (
                        <img src={icon} alt={cat} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{icon}</span>
                      )}
                    </div>
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400">{cat}</p>
                  </div>
                );
              })}
            </div>
            {/* <button
              onClick={launchExamplesBrowser}
              className="inline-flex items-center text-near-primary hover:text-[#00D689] font-medium transition-colors mt-4 text-sm"
            >
              View all categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CodeWithExtensions;
