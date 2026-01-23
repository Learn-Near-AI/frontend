import React, { useState, useEffect } from 'react'
import { Play, Rocket, TimerResetIcon, CopyIcon, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

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
  const [showResetDialog, setShowResetDialog] = useState(false)
  const deploymentMethod = 'CLI' // Both languages use CLI deployment

  const handleCopy = () => {
    onCopy()
    setCopied(true)
  }

  const handleResetClick = () => {
    setShowResetDialog(true)
  }

  const handleResetConfirm = () => {
    onReset()
    setReset(true)
    setShowResetDialog(false)
    toast.success('Code reset to original', {
      description: 'Your code has been reset to the default example.',
      duration: 3000,
    })
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
            className={`px-3 py-1.5 ${
              activeLanguage === 'Rust'
                ? 'bg-near-primary text-near-darker font-semibold'
                : 'text-gray-300 hover:bg-[#1a1b1f]'
            }`}
            onClick={() => setActiveLanguage('Rust')}
          >
            Rust
          </button>
          <button
            className={`px-3 py-1.5 font-semibold ${
              activeLanguage === 'JavaScript'
                ? 'bg-near-primary text-near-darker'
                : 'text-gray-300 hover:bg-[#1a1b1f]'
            }`}
            onClick={() => setActiveLanguage('JavaScript')}
          >
            <span className="md:hidden">JS</span>
            <span className="hidden md:inline">JavaScript</span>
          </button>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="tour-run-deploy flex items-center gap-2">
        <button
          onClick={handleResetClick}
          className={`px-2 py-1.5 md:px-3 text-[0.65rem] md:text-xs border rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-1 ${
            reset
              ? 'border-near-primary bg-near-primary/10 text-near-primary'
              : 'border-[#3e3e42] text-gray-200 hover:bg-[#1a1b1f]'
          }`}
          title={reset ? 'Reset!' : 'Reset code'}
        >
          <TimerResetIcon className="h-4 w-4" />
        </button>

        {/* Reset Confirmation Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="max-w-sm p-4 mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle>Reset Code</DialogTitle>
              <DialogDescription>
                Are you sure you want to reset the code to the original example? All your changes will be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <button
                onClick={() => setShowResetDialog(false)}
                className="px-4 py-2 text-sm border border-[#3e3e42] rounded-lg text-gray-300 hover:bg-[#1a1b1f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-2 text-sm bg-near-primary text-near-darker font-semibold rounded-lg hover:bg-[#00D689] transition-colors"
              >
                Reset
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <button
          onClick={handleCopy}
          className={`px-2 py-1.5 md:px-3 text-[0.65rem] md:text-xs border rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-1 ${
            copied
              ? 'border-near-primary bg-near-primary/10 text-near-primary'
              : 'border-[#3e3e42] text-gray-200 hover:bg-[#1a1b1f]'
          }`}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onRun}
          disabled={isRunning || isDeploying}
          className="px-2 py-1.5 md:px-3 text-[0.65rem] md:text-xs bg-near-primary hover:bg-[#00D689] text-near-darker font-semibold rounded-lg inline-flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
          title="Run code"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden md:inline">Compiling...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span className="hidden md:inline">Run</span>
            </>
          )}
        </button>
        <button
          onClick={onDeploy}
          disabled={isRunning || isDeploying || backendCLIConfigured === false}
          className="px-2 py-1.5 md:px-3 text-[0.65rem] md:text-xs border border-[#3e3e42] rounded-lg text-gray-100 hover:bg-[#1a1b1f] inline-flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
          title={backendCLIConfigured === false ? 'Backend CLI not configured' : `Deploy via ${deploymentMethod}`}
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden md:inline">Deploying...</span>
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              <span className="hidden md:inline">Deploy ({deploymentMethod})</span>
            </>
          )}
        </button>
        </div>
      </div>

      {/* Code editor area */}
      <div className="flex-1 bg-[#0d0f14] text-gray-500 font-mono text-xs md:text-sm overflow-auto p-4 space-y-3">
        <div className="flex items-center justify-between text-[0.65rem] text-gray-400">
          <span>Code Editor • {activeLanguage}</span>
          <span>NEAR SDK</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent text-white/90 font-mono text-xs md:text-sm outline-none resize-none whitespace-pre overflow-x-auto"
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

