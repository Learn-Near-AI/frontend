import React from 'react'
import { Code2 } from 'lucide-react'
import DotsPattern from './DotsPattern'

function CodeInAnyLanguage() {
  return (
    <section className="py-20 bg-[#111216] relative">
      {/* <DotsPattern /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="order-2 lg:order-1" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Code in JavaScript or Rust
            </h2>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              Learn NEAR smart contracts in your preferred language. Examples available in both JavaScript/TypeScript and Rust.
            </p>

          
          </div>

          {/* Right - Placeholder */}
          <div className="order-1 lg:order-2 relative" data-aos="fade-up" data-aos-delay="200">
             {/* Language Grid */}
             <div className="grid grid-cols-3 gap-4">
              {['JavaScript', 'TypeScript', 'Rust'].map((lang, idx) => (
                <div
                  key={idx}
                  className="bg-[#111216] rounded-lg p-3 border border-[#3e3e42] flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 bg-near-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <Code2 className="h-5 w-5 text-near-primary" />
                  </div>
                  <p className="text-xs text-center text-gray-400">{lang}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CodeInAnyLanguage
