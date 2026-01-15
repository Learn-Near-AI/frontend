import React from 'react'
import { Target, Coins, Link2, Shield, Database, Gamepad2 } from 'lucide-react'

function ExampleCategories() {
  return (
    <section id="examples" className="py-20 bg-[#13172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-white mb-4">Explore by Category</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From basics to advanced, find examples that match your skill level
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category 1 */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="100">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-near-primary mr-3" />
              <h3 className="text-lg font-bold text-white">Basics</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Storage, State, Methods - Master the fundamentals of NEAR smart contracts
            </p>
          </div>

          {/* Category 2 */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="200">
            <div className="flex items-center mb-4">
              <Coins className="h-8 w-8 text-near-primary mr-3" />
              <h3 className="text-lg font-bold text-white">Tokens</h3>
            </div>
            <p className="text-gray-400 text-sm">
              FT, NFT Standards - Learn token standards and implementations
            </p>
          </div>

          {/* Category 3 */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="300">
            <div className="flex items-center mb-4">
              <Link2 className="h-8 w-8 text-near-primary mr-3" />
              <h3 className="text-lg font-bold text-white">Cross-Contract Calls</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Learn how contracts interact with each other on NEAR
            </p>
          </div>

          {/* Category 4 */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="400">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-near-primary mr-3" />
              <h3 className="text-lg font-bold text-white">Chain Signatures</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Understand authentication and security on NEAR blockchain
            </p>
          </div>

          {/* Category 5 */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="500">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-near-primary mr-3" />
              <h3 className="text-lg font-bold text-white">Data & Indexing</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Explore data structures and indexing patterns for NEAR contracts
            </p>
          </div>

          {/* Category 6 */}
          <div className="bg-[#0B0D1A] rounded-xl p-6 border border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="600">
            <div className="flex items-center mb-4">
              <Gamepad2 className="h-8 w-8 text-near-primary mr-3" />
              <h3 className="text-lg font-bold text-white">Real-World Apps</h3>
            </div>
            <p className="text-gray-400 text-sm">
              See complete applications built on NEAR protocol
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExampleCategories
