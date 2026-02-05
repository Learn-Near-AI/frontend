import React from 'react'
import PropTypes from 'prop-types'
import ExplanationTab from './ExplanationTab'
import AITab from './AITab'
import FnTestingTab from './FnTestingTab'

function InfoPanel({
  example,
  activeInfoTab,
  setActiveInfoTab,
  code,
  activeLanguage,
  deployedContractId,
  isDeploying,
}) {
  const tabs = ['Explanation', 'AI', 'Fn Testing']
  
  // Determine if Fn Testing should be enabled
  const isFnTestingEnabled = !!deployedContractId

  return (
    <div className="lg:basis-2/5 bg-white dark:bg-[#111216] rounded-xl border border-gray-200 dark:border-[#3e3e42] flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-[#3e3e42] px-3 pt-3 flex text-xs md:text-sm">
        {tabs.map((label) => {
          const key = label.toLowerCase()
          const isActive = activeInfoTab === key
          const isFnTesting = label === 'Fn Testing'
          const isDisabled = isFnTesting && !isFnTestingEnabled
          
          // Add tour classes for each tab
          let tourClass = ''
          if (label === 'Explanation') tourClass = 'tour-explanation-tab'
          if (label === 'AI') tourClass = 'tour-ai-tab'
          if (label === 'Fn Testing') tourClass = 'tour-fn-testing-tab'
          
          return (
            <button
              key={label}
              onClick={() => !isDisabled && setActiveInfoTab(key)}
              disabled={isDisabled}
              className={`${tourClass} flex-1 px-3 py-2 rounded-t-lg border-b-2 -mb-px flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'border-near-primary text-near-primary font-semibold'
                  : isDisabled
                  ? 'border-transparent text-gray-600 cursor-not-allowed opacity-50'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer'
              }`}
              title={isDisabled ? 'Deploy contract first to enable function testing' : ''}
            >
              {label}
              {isFnTesting && !isFnTestingEnabled && (
                <span className="text-[0.6rem] px-1 py-0.5 rounded bg-gray-700 text-gray-400">
                  🔒
                </span>
              )}
              {isFnTesting && isDeploying && (
                <span className="text-[0.6rem] px-1 py-0.5 rounded bg-amber-900/30 text-amber-400">
                  ⏳
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex-1 p-4 text-sm flex flex-col bg-gray-50 dark:bg-[#0d0f14]">
        {activeInfoTab === 'explanation' && <ExplanationTab example={example} />}
        {activeInfoTab === 'ai' && <AITab code={code} example={example} activeLanguage={activeLanguage} />}
        {activeInfoTab === 'fn testing' && (
          <FnTestingTab 
            code={code} 
            example={example} 
            activeLanguage={activeLanguage}
            deployedContractId={deployedContractId}
            isDeploying={isDeploying}
          />
        )}
      </div>
    </div>
  )
}

InfoPanel.propTypes = {
  example: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  activeInfoTab: PropTypes.string.isRequired,
  setActiveInfoTab: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  activeLanguage: PropTypes.oneOf(['Rust', 'JavaScript']).isRequired,
  deployedContractId: PropTypes.string,
  isDeploying: PropTypes.bool.isRequired,
}

export default InfoPanel

