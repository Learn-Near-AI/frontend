import React, { useState, useEffect } from 'react'
import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride'

const STORAGE_KEY = 'near_examples_tour_completed'

function OnboardingTour({ run, onFinish }) {
  const [stepIndex, setStepIndex] = useState(0)

  const steps = [
    {
      target: '.tour-wallet-connect',
      content: (
        <div>
          <h3 className="text-base font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-gray-300">
            Connect your NEAR wallet to be able to call contract functions that change state. 
            This is required for deploying contracts and testing "change" methods.
          </p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.tour-example-sidebar',
      content: (
        <div>
          <h3 className="text-base font-semibold mb-2">Select an Example</h3>
          <p className="text-sm text-gray-300">
            Browse through over 30 NEAR smart contract examples organized by category. 
            Each example demonstrates different concepts like NFTs, DeFi, DAOs, and more.
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '.tour-run-deploy',
      content: (
        <div>
          <h3 className="text-base font-semibold mb-2">Run or Deploy Your Contract</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-near-primary">Run:</strong> Compiles your contract to check for errors and verify correctness without deploying.
          </p>
          <p className="text-sm text-gray-300">
            <strong className="text-near-primary">Deploy:</strong> Compiles and deploys your contract to NEAR TestNet, making it live and testable.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.tour-explanation-tab',
      content: (
        <div>
          <h3 className="text-base font-semibold mb-2">Explanation Tab</h3>
          <p className="text-sm text-gray-300">
            Read a detailed explanation of the selected contract. This tab provides context about what the contract does, 
            key concepts it demonstrates, and how it works with an AI-powered typing animation.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.tour-ai-tab',
      content: (
        <div>
          <h3 className="text-base font-semibold mb-2">AI Assistant Tab</h3>
          <p className="text-sm text-gray-300">
            Ask questions about the contract code and get instant answers from Google Gemini AI. 
            Perfect for understanding specific functions, debugging, or learning NEAR development concepts.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.tour-fn-testing-tab',
      content: (
        <div>
          <h3 className="text-base font-semibold mb-2">Function Testing Tab</h3>
          <p className="text-sm text-gray-300">
            Test your deployed contract's functions directly in the browser. Call view methods (read-only) 
            or change methods (write operations) with custom JSON arguments and see real-time results.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.tour-console',
      content: (
        <div>
          <h3 className="text-base font-semibold mb-2">Console Output</h3>
          <p className="text-sm text-gray-300">
            View compilation logs, deployment status, contract IDs, transaction hashes, and error messages. 
            This console shows real-time feedback for all your operations with links to the NEAR Explorer.
          </p>
        </div>
      ),
      placement: 'top',
    },
  ]

  const handleJoyrideCallback = (data) => {
    const { status, action, index, type } = data

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark tour as completed
      localStorage.setItem(STORAGE_KEY, 'true')
      setStepIndex(0)
      if (onFinish) {
        onFinish()
      }
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Update step index
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#00EC97',
          textColor: '#e5e7eb',
          backgroundColor: '#1a1b1f',
          arrowColor: '#1a1b1f',
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
          fontSize: '14px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#00EC97',
          color: '#0a0c10',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '600',
        },
        buttonBack: {
          color: '#9ca3af',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#9ca3af',
        },
        spotlight: {
          borderRadius: '8px',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      floaterProps={{
        disableAnimation: false,
      }}
      disableScrolling={false}
    />
  )
}

export default OnboardingTour
