import React from 'react'
import { Rocket, CheckCircle2 } from 'lucide-react'

function WhySection() {
  return (
    <section className="py-20 bg-[#13172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12" data-aos="fade-up">
          <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
            WHY US
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Why they prefer NEAR by Example.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Stats */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800" data-aos="fade-up" data-aos-delay="100">
            <div className="text-4xl font-bold text-near-primary mb-2">60+</div>
            <div className="text-sm text-gray-400">Live Examples</div>
            <p className="text-xs text-gray-500 mt-2">Interactive smart contract examples ready to learn</p>
          </div>

          {/* Card 2 - Instant Access */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800" data-aos="fade-up" data-aos-delay="200">
            <div className="w-10 h-10 bg-near-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="h-5 w-5 text-near-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Access</h3>
            <p className="text-sm text-gray-400">Run code in your browser instantly, no setup required.</p>
          </div>

          {/* Card 3 - No Setup */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800" data-aos="fade-up" data-aos-delay="300">
            <div className="w-10 h-10 bg-near-primary/10 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="h-5 w-5 text-near-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero Setup</h3>
            <p className="text-sm text-gray-400">Start learning immediately without any installation or configuration.</p>
          </div>

          {/* Card 4 - Summary/Stats */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800" data-aos="fade-up" data-aos-delay="400">
            <div className="text-sm text-gray-500 mb-2">Summary</div>
            <div className="text-3xl font-bold text-white mb-4">100%</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-near-primary rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Free & Open Source</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhySection
