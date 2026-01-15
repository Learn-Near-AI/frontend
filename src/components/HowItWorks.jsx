import React from 'react'

function HowItWorks() {
  return (
    <section className="py-20 bg-[#0B0D1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12" data-aos="fade-up">
          <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
            STEP
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Maximize your learning with a platform that grows.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white/5 rounded-xl p-8 border border-white/10" data-aos="fade-up" data-aos-delay="100">
            <div className="text-2xl font-bold text-near-primary mb-4">1</div>
            <h3 className="text-xl font-bold mb-3">Open your account</h3>
            <p className="text-gray-300 leading-relaxed">
              Sign up to NEAR by Example and set up your learning environment from the dashboard.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 rounded-xl p-8 border border-white/10" data-aos="fade-up" data-aos-delay="200">
            <div className="text-2xl font-bold text-near-primary mb-4">2</div>
            <h3 className="text-xl font-bold mb-3">Start learning</h3>
            <p className="text-gray-300 leading-relaxed">
              Choose an example and start coding. Run code in your browser and see results instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 rounded-xl p-8 border border-white/10" data-aos="fade-up" data-aos-delay="300">
            <div className="text-2xl font-bold text-near-primary mb-4">3</div>
            <h3 className="text-xl font-bold mb-3">Deploy to TestNet</h3>
            <p className="text-gray-300 leading-relaxed">
              Deploy your contracts when ready. One click deployment to NEAR TestNet.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
