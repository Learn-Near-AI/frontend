import React from 'react'
import { Code2 } from 'lucide-react'
import DotsPattern from './DotsPattern'

function ThreeColumnFeatures() {
  return (
    <section className="py-20 bg-[#111216] relative">
      {/* <DotsPattern /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Interactive Examples */}
          <div className="bg-[#111216] rounded-xl p-8 border border-[#3e3e42]" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-xl font-bold text-white mb-4">Interactive Examples</h3>
            <p className="text-gray-400 mb-6">
              Write, edit, and run NEAR smart contracts directly in your browser. No installation, no wallet setup needed.
            </p>
            <div className="relative rounded-lg overflow-hidden border border-near-primary/30">
              <div className="bg-[#1e1e1e] p-4 min-h-[200px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Code2 className="h-12 w-12 mx-auto mb-2 text-near-primary/50" />
                  <p className="text-xs">Code Editor Placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Code Assistant */}
          <div className="bg-[#0B0D1A] rounded-xl p-8 border border-gray-800" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-xl font-bold text-white mb-4">AI Code Assistant</h3>
            <p className="text-gray-400 mb-6">
              Get instant explanations, bug fixes, and code suggestions. Your personal NEAR tutor, available 24/7.
            </p>
            <div className="relative rounded-lg overflow-hidden border border-near-primary/30">
              <div className="bg-[#1e1e1e] p-4 min-h-[200px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Code2 className="h-12 w-12 mx-auto mb-2 text-near-primary/50" />
                  <p className="text-xs">AI Assistant Placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: One-Click Deploy */}
          <div className="bg-[#0B0D1A] rounded-xl p-8 border border-gray-800" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-xl font-bold text-white mb-4">One-Click Deploy</h3>
            <p className="text-gray-400 mb-6">
              Deploy your contracts to NEAR TestNet with a single click. See your code running on a real blockchain.
            </p>
            <div className="relative rounded-lg overflow-hidden border border-near-primary/30">
              <div className="bg-[#1e1e1e] p-4 min-h-[200px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Code2 className="h-12 w-12 mx-auto mb-2 text-near-primary/50" />
                  <p className="text-xs">Deployment Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ThreeColumnFeatures
