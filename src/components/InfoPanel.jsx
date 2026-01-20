import React from 'react'
import ExplanationTab from './ExplanationTab'
import AITab from './AITab'

function InfoPanel({
  example,
  activeInfoTab,
  setActiveInfoTab,
  code,
  activeLanguage,
}) {
  const tabs = ['Explanation', 'AI']

  return (
    <div className="lg:basis-2/5 bg-[#111216] rounded-xl border border-[#3e3e42] flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-[#3e3e42] px-3 pt-3 flex text-xs md:text-sm">
        {tabs.map((label) => {
          const key = label.toLowerCase()
          const isActive = activeInfoTab === key
          return (
            <button
              key={label}
              onClick={() => setActiveInfoTab(key)}
              className={`flex-1 px-3 py-2 rounded-t-lg border-b-2 -mb-px flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'border-near-primary text-near-primary font-semibold'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 p-4 text-sm flex flex-col bg-[#0d0f14]">
        {activeInfoTab === 'explanation' && <ExplanationTab example={example} />}
        {activeInfoTab === 'ai' && <AITab code={code} example={example} activeLanguage={activeLanguage} />}
      </div>
    </div>
  )
}

export default InfoPanel

