import React, { useState, useEffect } from 'react'
import { useNearWallet } from 'near-connect-hooks'
import { Loader2, CheckCircle2, AlertCircle, Info, Lock } from 'lucide-react'

// Parse code to extract methods
const parseMethodsFromCode = (code, language) => {
  const viewMethods = []
  const callMethods = []

  if (language === 'Rust') {
    // Match: pub fn method_name(&self) or pub fn method_name(&mut self, ...)
    const viewRegex = /pub fn (\w+)\(&self[^)]*\)/g
    const callRegex = /pub fn (\w+)\(&mut self[^)]*\)/g
    
    let match
    while ((match = viewRegex.exec(code)) !== null) {
      viewMethods.push({ name: match[1], args: {} })
    }
    while ((match = callRegex.exec(code)) !== null) {
      // Try to extract parameter names
      const methodName = match[1]
      const fullMatch = code.substring(code.indexOf(match[0]))
      const paramMatch = fullMatch.match(/\(&mut self(?:,\s*(\w+):\s*\w+[^)]*)?\)/)
      let args = {}
      if (paramMatch && paramMatch[1]) {
        // Simple extraction - just get first param name
        const params = fullMatch.match(/\(&mut self,\s*(\w+):/)?.[1]
        if (params) {
          args[params] = ''
        }
      }
      callMethods.push({ name: methodName, args })
    }
  } else if (language === 'JavaScript' || language === 'TypeScript') {
    // Match: @view({}) methodName() or @call({}) methodName()
    const viewRegex = /@view\([^)]*\)\s+(\w+)\([^)]*\)/g
    const callRegex = /@call\([^)]*\)\s+(\w+)\([^)]*\)/g
    
    let match
    while ((match = viewRegex.exec(code)) !== null) {
      viewMethods.push({ name: match[1], args: {} })
    }
    while ((match = callRegex.exec(code)) !== null) {
      const methodName = match[1]
      // Try to extract parameters
      const fullMatch = code.substring(code.indexOf(match[0]))
      const paramMatch = fullMatch.match(/\([^)]*\{([^}]+)\}[^)]*\)/)
      let args = {}
      if (paramMatch) {
        // Extract parameter names from destructured object
        const params = paramMatch[1].split(',').map(p => p.trim().split(':')[0].trim())
        params.forEach(param => {
          if (param) args[param] = ''
        })
      }
      callMethods.push({ name: methodName, args })
    }
  }

  return { viewMethods, callMethods }
}

function FnTestingTab({ code, example, activeLanguage, deployedContractId, isDeploying }) {
  const { signedAccountId, viewFunction, callFunction } = useNearWallet()
  
  const [contractId, setContractId] = useState('')
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [methodArgs, setMethodArgs] = useState('{}')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [parsedMethods, setParsedMethods] = useState({ viewMethods: [], callMethods: [] })

  // Parse methods from current code
  useEffect(() => {
    if (code) {
      const methods = parseMethodsFromCode(code, activeLanguage)
      setParsedMethods(methods)
    }
  }, [code, activeLanguage])

  // Update contract ID when deployment happens
  useEffect(() => {
    if (deployedContractId) {
      setContractId(deployedContractId)
    }
  }, [deployedContractId])

  const handleMethodCall = async (method, isView) => {
    if (!contractId) {
      setError('No contract deployed')
      return
    }

    if (!isView && !signedAccountId) {
      setError('Please connect your wallet in the navigation to call contract methods')
      return
    }

    setIsExecuting(true)
    setError(null)
    setResult(null)
    setSelectedMethod(method)

    try {
      // Parse args
      let parsedArgs
      try {
        parsedArgs = JSON.parse(methodArgs)
      } catch (e) {
        throw new Error('Invalid JSON arguments: ' + e.message)
      }

      let response
      if (isView) {
        // viewFunction supports args if needed
        const viewParams = {
          contractId: contractId,
          method: method.name
        }
        // Only add args if they exist and are not empty
        if (parsedArgs && Object.keys(parsedArgs).length > 0) {
          viewParams.args = parsedArgs
        }
        response = await viewFunction(viewParams)
      } else {
        response = await callFunction({
          contractId: contractId,
          method: method.name,
          args: parsedArgs
        })
      }
      
      setResult(response)
    } catch (err) {
      console.error('Function call error:', err)
      setError(err.message || 'Failed to call function')
    } finally {
      setIsExecuting(false)
    }
  }

  const selectMethod = (method, isView) => {
    setSelectedMethod(method)
    setMethodArgs(JSON.stringify(method.args, null, 2))
    setError(null)
    setResult(null)
  }

  // If no contract deployed, show deploy first message
  if (!deployedContractId) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 min-h-[300px] text-center p-6">
        <div className="p-4 rounded-full bg-[#1a1b1f] border border-[#3e3e42]">
          {isDeploying ? (
            <Loader2 className="h-8 w-8 text-near-primary animate-spin" />
          ) : (
            <Lock className="h-8 w-8 text-gray-500" />
          )}
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-base font-semibold text-gray-300">
            {isDeploying ? 'Deploying Contract...' : 'Deploy Contract First'}
          </h3>
          <p className="text-xs text-gray-500">
            {isDeploying 
              ? 'Please wait while your contract is being deployed to the NEAR network.'
              : 'Click the "Deploy" button in the code editor to deploy this contract. Once deployed, you\'ll be able to test its functions here.'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 gap-4 min-h-0 overflow-y-auto">
      {/* Contract Info */}
      <div className="bg-[#111216] rounded-lg p-3 border border-[#3e3e42]">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-gray-400">Contract:</span>
          <span className="text-near-primary font-mono font-semibold">{contractId}</span>
        </div>
        {!signedAccountId && (
          <div className="flex items-center gap-2 text-xs text-amber-400 mt-2">
            <Info className="h-4 w-4" />
            <span>Connect wallet to call contract methods</span>
          </div>
        )}
      </div>

      {/* Read-only Methods */}
      {parsedMethods.viewMethods.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400">Calling Read-only Methods</div>
          <div className="space-y-2">
            {parsedMethods.viewMethods.map((method, idx) => (
              <div
                key={`view-${idx}`}
                className="bg-[#111216] rounded-lg p-3 border border-[#3e3e42] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-300">{method.name}</span>
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Read-only
                    </span>
                  </div>
                  <button
                    onClick={() => selectMethod(method, true)}
                    className="px-2 py-1 text-[0.7rem] bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors"
                  >
                    Select
                  </button>
                </div>
                {selectedMethod?.name === method.name && (
                  <div className="space-y-2 pt-2 border-t border-[#3e3e42]">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Arguments (JSON)</label>
                      <textarea
                        value={methodArgs}
                        onChange={(e) => setMethodArgs(e.target.value)}
                        rows={2}
                        className="w-full bg-[#0d0f14] text-xs text-gray-100 px-2 py-1.5 rounded border border-[#3e3e42] outline-none focus:border-blue-500 resize-none font-mono"
                        placeholder='{}'
                      />
                    </div>
                    <button
                      onClick={() => handleMethodCall(method, true)}
                      disabled={isExecuting}
                      className="w-full px-3 py-2 text-xs bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isExecuting && selectedMethod?.name === method.name ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        'Call Method'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contract Methods (Change Methods) */}
      {parsedMethods.callMethods.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400">Calling Contract Methods</div>
          <div className="space-y-2">
            {parsedMethods.callMethods.map((method, idx) => (
              <div
                key={`call-${idx}`}
                className="bg-[#111216] rounded-lg p-3 border border-[#3e3e42] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-300">{method.name}</span>
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Change State
                    </span>
                  </div>
                  <button
                    onClick={() => selectMethod(method, false)}
                    disabled={!signedAccountId}
                    className="px-2 py-1 text-[0.7rem] bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select
                  </button>
                </div>
                {selectedMethod?.name === method.name && (
                  <div className="space-y-2 pt-2 border-t border-[#3e3e42]">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Arguments (JSON)</label>
                      <textarea
                        value={methodArgs}
                        onChange={(e) => setMethodArgs(e.target.value)}
                        rows={2}
                        className="w-full bg-[#0d0f14] text-xs text-gray-100 px-2 py-1.5 rounded border border-[#3e3e42] outline-none focus:border-purple-500 resize-none font-mono"
                        placeholder='{}'
                      />
                    </div>
                    <button
                      onClick={() => handleMethodCall(method, false)}
                      disabled={isExecuting || !signedAccountId}
                      className="w-full px-3 py-2 text-xs bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isExecuting && selectedMethod?.name === method.name ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        'Call Method'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No methods found */}
      {parsedMethods.viewMethods.length === 0 && parsedMethods.callMethods.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-xs">
          <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p>No methods found in the current contract code.</p>
        </div>
      )}

      {/* Result or Error Display */}
      {(result !== null || error) && (
        <div className="bg-[#111216] rounded-lg p-3 border border-[#3e3e42] space-y-2">
          <div className="flex items-center gap-2">
            {error ? (
              <AlertCircle className="h-4 w-4 text-red-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            <span className="text-xs font-semibold text-gray-300">
              {error ? 'Error' : 'Result'}
            </span>
          </div>
          <div className="bg-[#0d0f14] rounded p-2 overflow-auto max-h-40">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words font-mono">
              {error ? error : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default FnTestingTab
