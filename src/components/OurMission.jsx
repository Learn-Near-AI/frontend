import React from 'react'

function OurMission() {
  return (
    <section className="py-20 bg-[#13172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12" data-aos="fade-up">
          <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
            OUR MISSION
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            We've helped innovative developers.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Hundreds of developers of all skill levels and across all industries have made big improvements with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#0B0D1A] rounded-xl p-8" data-aos="fade-up" data-aos-delay="100">
            <div className="text-4xl font-bold text-near-primary mb-2">60+</div>
            <div className="text-lg font-semibold text-white mb-1">Interactive Examples</div>
            <p className="text-sm text-gray-400">Ready to learn from</p>
          </div>
          <div className="bg-[#0B0D1A] rounded-xl p-8" data-aos="fade-up" data-aos-delay="200">
            <div className="text-4xl font-bold text-near-primary mb-2">100%</div>
            <div className="text-lg font-semibold text-white mb-1">Free & Open Source</div>
            <p className="text-sm text-gray-400">No cost to learn</p>
          </div>
          <div className="bg-[#0B0D1A] rounded-xl p-8" data-aos="fade-up" data-aos-delay="300">
            <div className="text-4xl font-bold text-near-primary mb-2">24/7</div>
            <div className="text-lg font-semibold text-white mb-1">AI Tutor Available</div>
            <p className="text-sm text-gray-400">Learn anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurMission
