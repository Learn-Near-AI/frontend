import React from 'react';

function ThreeColumnFeatures() {
  return (
    <section className="py-20 bg-white dark:bg-[#111216] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Interactive Examples */}
          <div
            className="bg-white dark:bg-[#111216] rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-[#3e3e42]"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Examples
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Write, edit, and run NEAR smart contracts directly in your browser. No installation,
              no wallet setup needed.
            </p>
            <div className="relative rounded-lg overflow-hidden aspect-video w-full">
              <img
                src="/assets/images/1a.png"
                alt="Interactive Examples"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: AI Code Assistant */}
          <div
            className="bg-white dark:bg-[#111216] rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-[#3e3e42]"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              AI Code Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get instant explanations, bug fixes, and code suggestions. Your personal NEAR tutor,
              available 24/7.
            </p>
            <div className="relative rounded-lg overflow-hidden aspect-video w-full">
              <img
                src="/assets/images/1b.png"
                alt="AI Code Assistant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 3: One-Click Deploy */}
          <div
            className="bg-white dark:bg-[#111216] rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-[#3e3e42]"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              One-Click Deploy
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Deploy your contracts to NEAR TestNet with a single click. See your code running on a
              real blockchain.
            </p>
            <div className="relative rounded-lg overflow-hidden aspect-video w-full">
              <img
                src="/assets/images/1c.png"
                alt="One-Click Deploy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThreeColumnFeatures;
