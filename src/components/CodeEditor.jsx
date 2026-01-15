import React, { useState, useEffect } from 'react'
import { Play, Rocket, TimerResetIcon, CopyIcon, Loader2, Check } from 'lucide-react'

function CodeEditor({
  code,
  setCode,
  activeLanguage,
  setActiveLanguage,
  isRunning,
  isDeploying,
  onRun,
  onDeploy,
  onCopy,
  onReset,
  backendCLIConfigured,
}) {
  const [copied, setCopied] = useState(false)
  const [reset, setReset] = useState(false)
  const deploymentMethod = activeLanguage === 'Rust' ? 'CLI' : 'Wallet'

  const handleCopy = () => {
    onCopy()
    setCopied(true)
  }

  const handleReset = () => {
    onReset()
    setReset(true)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  useEffect(() => {
    if (reset) {
      const timer = setTimeout(() => setReset(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [reset])
  return (
    <div className="lg:basis-3/5 bg-[#111216] rounded-xl border border-[#3e3e42] flex flex-col overflow-hidden">
      {/* Top toolbar */}
      <div className="border-b border-[#3e3e42] px-3 md:px-4 py-2.5 md:py-3 flex flex-wrap items-center gap-2">
        {/* Language tabs */}
        <div className="inline-flex rounded-lg border border-[#3e3e42] bg-[#111216] overflow-hidden text-[0.65rem] md:text-xs">
          <button
            className={`px-3 py-1.5 font-semibold ${
              activeLanguage === 'JavaScript'
                ? 'bg-near-primary text-near-darker'
                : 'text-gray-300 hover:bg-[#1a1b1f]'
            }`}
            onClick={() => setActiveLanguage('JavaScript')}
          >
            JavaScript
          </button>
          <button
            className={`px-3 py-1.5 ${
              activeLanguage === 'Rust'
                ? 'bg-near-primary text-near-darker font-semibold'
                : 'text-gray-300 hover:bg-[#1a1b1f]'
            }`}
            onClick={() => setActiveLanguage('Rust')}
          >
            Rust
          </button>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <button
          onClick={handleReset}
          className={`px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border rounded-lg transition-all duration-200 inline-flex items-center gap-1 ${
            reset
              ? 'border-near-primary bg-near-primary/10 text-near-primary'
              : 'border-[#3e3e42] text-gray-200 hover:bg-[#1a1b1f]'
          }`}
          title={reset ? 'Reset!' : 'Reset code'}
        >
          <TimerResetIcon className="h-4 w-4" />
          {reset && <span className="hidden md:inline">Reset!</span>}
        </button>
        <button
          onClick={handleCopy}
          className={`px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border rounded-lg transition-all duration-200 inline-flex items-center gap-1 ${
            copied
              ? 'border-near-primary bg-near-primary/10 text-near-primary'
              : 'border-[#3e3e42] text-gray-200 hover:bg-[#1a1b1f]'
          }`}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="hidden md:inline">Copied!</span>
            </>
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onRun}
          disabled={isRunning || isDeploying}
          className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs bg-near-primary hover:bg-[#00D689] text-near-darker font-semibold rounded-lg inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run
            </>
          )}
        </button>
        <button
          onClick={onDeploy}
          disabled={isRunning || isDeploying || (activeLanguage === 'Rust' && backendCLIConfigured === false)}
          className="px-2.5 md:px-3 py-1.5 text-[0.65rem] md:text-xs border border-[#3e3e42] rounded-lg text-gray-100 hover:bg-[#1a1b1f] inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
          title={activeLanguage === 'Rust' && backendCLIConfigured === false ? 'Backend CLI not configured' : `Deploy via ${deploymentMethod}`}
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Deploy ({deploymentMethod})
            </>
          )}
        </button>
      </div>

      {/* Code editor area */}
      <div className="flex-1 bg-[#0d0f14] text-gray-100 font-mono text-xs md:text-sm overflow-auto p-4 space-y-3">
        <div className="flex items-center justify-between text-[0.65rem] text-gray-400">
          <span>Code Editor • {activeLanguage}</span>
          <span>NEAR SDK</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent text-gray-100 font-mono text-xs md:text-sm outline-none resize-none whitespace-pre overflow-x-auto"
          spellCheck={false}
          style={{ minHeight: '300px' }}
        />
      </div>

      {/* Bottom status bar */}
      <div className="border-t border-[#3e3e42] bg-[#0d0f14] px-3 md:px-4 py-1.5 md:py-2 text-[0.7rem] text-gray-400 flex items-center justify-between">
        <span>Lines: 10 • Chars: 180 (approx)</span>
        <span>{activeLanguage} • Ready to run ✓</span>
      </div>
    </div>
  )
}

export default CodeEditor

