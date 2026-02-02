import React from 'react'
import { ExternalLink } from 'lucide-react'

function ConsolePanel({ consoleOutput, deployedContractId, deploymentTxHash }) {
  // Parse console output to identify styled text
  const renderConsoleOutput = () => {
    if (!consoleOutput) {
      return 'Console output will appear here when you run or deploy...'
    }

    const lines = consoleOutput.split('\n')
    return lines.map((line, idx) => {
      try {
        // Try to parse JSON-formatted styled text
        const parsed = JSON.parse(line)
        if (parsed.text && parsed.color) {
          let colorClass = ''
          if (parsed.color === 'red') colorClass = 'text-red-500'
          else if (parsed.color === 'green') colorClass = 'text-green-500'
          const boldClass = parsed.bold ? 'font-bold' : ''
          return (
            <div key={idx} className={`${colorClass} ${boldClass}`}>
              {parsed.text}
            </div>
          )
        }
      } catch {
        // Not JSON, render as plain text
      }
      return <div key={idx}>{line}</div>
    })
  }

  return (
    <div className="tour-console bg-white dark:bg-[#111216] rounded-xl border border-gray-200 dark:border-[#3e3e42] flex flex-col gap-4">
      {/* Console Output */}
      <div className="border-b border-gray-200 dark:border-[#3e3e42] pb-3 px-4 pt-4">
        <h3 className="text-sm font-semibold text-white mb-2">
          Console Output
        </h3>
        <div className="bg-gray-100 dark:bg-[#0a0c10] rounded-lg p-3 text-[0.7rem] font-mono text-gray-800 dark:text-gray-100 max-h-60 overflow-auto whitespace-pre-wrap border border-gray-200 dark:border-[#3e3e42]">
          {renderConsoleOutput()}
        </div>
      </div>

      {/* Deployment Section */}
      <div className="px-4 pb-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Deployment
        </h3>
        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          {deployedContractId ? (
            <> 
              <p>
                Status:{' '}
                <span className="inline-flex items-center gap-1 text-green-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Deployed to TestNet
                </span>
              </p>
              <p>
                Contract ID:{' '}
                <span className="font-mono text-[0.7rem] text-gray-100">
                  {deployedContractId}
                </span>
              </p>
              {deploymentTxHash && (
                <p>
                  Tx Hash:{' '}
                  <span className="font-mono text-[0.7rem] text-gray-100">
                    {deploymentTxHash}
                  </span>
                </p>
              )}
              <a
                href={`https://explorer.testnet.near.org/accounts/${deployedContractId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-near-primary hover:text-[#00D689]"
              >
                <ExternalLink className="h-3 w-3" />
                View on Explorer
              </a>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No contract deployed yet. Click "Deploy" to deploy your contract.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConsolePanel