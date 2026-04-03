import React from 'react';
import { Code2, ArrowRight } from 'lucide-react';
import DotsPattern from './DotsPattern';

function NextEditSuggestions({ launchExamplesBrowser }) {
  return (
    <section className="py-20 bg-white dark:bg-[#111216] relative">
      <DotsPattern />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Text */}
          <div className="order-2 lg:order-1" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Learn by doing</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Run code in your browser instantly. See results immediately and understand how NEAR
              smart contracts work through hands-on practice.
            </p>
            <button
              onClick={launchExamplesBrowser}
              className="inline-flex items-center text-near-primary hover:text-[#00D689] font-medium transition-colors"
            >
              Start coding now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Right - Image  */}
          <div className="relative order-1 lg:order-2" data-aos="fade-up" data-aos-delay="200">
            <div className="relative rounded-xl overflow-hidden border-2 border-near-primary h-[250px] sm:h-[350px] lg:h-[400px] w-full">
              <img
                src="/assets/images/3.png"
                alt="AI Assistant"
                className="w-full h-full object-cover object-left"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NextEditSuggestions;
