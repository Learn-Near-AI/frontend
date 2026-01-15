import React from 'react'
import { Code2, Sparkles, Rocket } from 'lucide-react'

function Features() {
  return (
    <section className="py-20 bg-[#13172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          <div data-aos="fade-up">
            <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
              LEARNING PLATFORM
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Experience that grows with your scale.
            </h2>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <p className="text-lg text-gray-400 leading-relaxed">
              Design a learning system that works for your skill level and streamlines smart contract development.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#0B0D1A] rounded-xl p-8 border border-gray-800 hover:border-near-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
            <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
              <Code2 className="h-6 w-6 text-near-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Interactive Examples</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Write, edit, and run NEAR smart contracts directly in your browser. No installation, no wallet setup needed.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#0B0D1A] rounded-xl p-8 border border-gray-800 hover:border-near-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
            <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-near-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">AI Code Assistant</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Get instant explanations, bug fixes, and code suggestions. Your personal NEAR tutor, available 24/7.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#0B0D1A] rounded-xl p-8 border border-gray-800 hover:border-near-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="400">
            <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
              <Rocket className="h-6 w-6 text-near-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">One-Click Deploy</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Deploy your contracts to NEAR TestNet with a single click. See your code running on a real blockchain.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
