import React from 'react'
import DotsPattern from './DotsPattern'

function CodeInAnyLanguage() {
  const languages = [
    {
      name: 'JavaScript',
      icon: (
        <div className="w-12 h-12 bg-[#F7DF1E] rounded-lg flex items-center justify-center font-bold text-[#000] text-lg">
          <span className="leading-none">
            <span className="inline-block">JS</span>
          </span>
        </div>
      ),
    },
    {
      name: 'TypeScript',
      icon: (
        <div className="w-12 h-12 bg-[#3178C6] rounded-lg flex items-center justify-center font-bold text-white text-lg">
          <span className="leading-none">
            <span className="inline-block">TS</span>
          </span>
        </div>
      ),
    },
    {
      name: 'Rust',
      icon: (
        <div className="w-12 h-12 bg-[#CE412B] rounded-lg flex items-center justify-center">
          <svg
            className="w-7 h-7"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M80.234 0C80.234 0 82.797 1.453 85.36 6.36c-11.98 2.91-20.944 8.726-26.79 17.448-5.82 8.703-8.726 20.217-8.726 34.54 0 14.34 2.906 25.854 8.726 34.557 5.846 8.703 14.81 14.519 26.79 17.43-2.563 4.907-5.126 6.36-5.126 6.36s-2.563-1.453-5.126-6.36c-11.98-2.911-20.944-8.727-26.79-17.43-2.91-4.362-4.843-9.269-6.36-14.176L19.37 64.233c-1.453 4.907-2.18 9.814-2.18 14.722 0 14.323 2.906 25.836 8.726 34.54 5.846 8.722 14.81 14.537 26.79 17.448-2.563 4.907-5.126 6.36-5.126 6.36s2.563-1.453 5.126-6.36c11.98-2.911 20.944-8.727 26.79-17.448 5.82-8.704 8.726-20.217 8.726-34.54 0-4.908-.727-9.815-2.18-14.722l13.554-13.554c1.453-4.907 2.18-9.814 2.18-14.722 0-14.323-2.906-25.837-8.726-34.54C101.178 8.726 92.214 2.91 80.234 0z"
              fill="#FFF"
            />
            <path
              d="M47.766 128c0 0-2.563-1.453-5.126-6.36 11.98-2.911 20.944-8.727 26.79-17.448 5.82-8.704 8.726-20.217 8.726-34.54 0-14.323-2.906-25.837-8.726-34.54-5.846-8.722-14.81-14.537-26.79-17.448 2.563-4.907 5.126-6.36 5.126-6.36s2.563 1.453 5.126 6.36c11.98 2.911 20.944 8.727 26.79 17.448 2.91 4.362 4.843 9.269 6.36 14.176l13.554 13.554c1.453 4.907 2.18 9.814 2.18 14.722 0 14.323-2.906 25.836-8.726 34.54-5.846 8.722-14.81 14.537-26.79 17.448 2.563 4.907 5.126 6.36 5.126 6.36z"
              fill="#FFF"
            />
          </svg>
        </div>
      ),
    },
  ]

  return (
    <section className="py-20 bg-[#111216] relative">
      {/* <DotsPattern /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="order-2 lg:order-1" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Code in any language
            </h2>
            <p className="text-base text-gray-400 mb-6 leading-relaxed">
              Learn NEAR smart contracts in your preferred language. Examples available in JavaScript, TypeScript, and Rust.
            </p>
          </div>

          {/* Right - Languages List */}
          <div className="order-1 lg:order-2 relative" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center gap-6">
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4"
                >
                  {lang.icon}
                  <span className="text-lg text-gray-300 font-medium">
                    {lang.name}
                  </span>
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
