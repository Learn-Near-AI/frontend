import React from 'react'
import { Play, Rocket, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { testFunctions } from '../data/testFunctions'

function TestPanel({ exampleId, testParams, setTestParams, testResults, isTesting, onTestCall, deployedContractId, walletAccountId }) {
  const functions = testFunctions[exampleId]
  if (!functions) return null

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
      {/* Deployment Status Banner */}
      {deployedContractId ? (
        <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/30">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-green-400 mb-1">
                Contract Deployed - Live Testing Mode
              </p>
              <p className="text-xs text-green-200/80 break-all font-mono">
                {deployedContractId}
              </p>
              {!walletAccountId && functions.changeMethods.length > 0 && (
                <p className="text-xs text-yellow-300 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  Connect wallet to call change methods
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-400 mb-1">
                Simulation Mode
              </p>
              <p className="text-xs text-blue-200/80">
                Deploy the contract to test with real blockchain calls
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 flex-1 overflow-auto">
        {/* View Methods */}
        {functions.viewMethods.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              View Methods (Read-Only)
            </h3>
            <div className="space-y-3">
              {functions.viewMethods.map((method) => (
                <div
                  key={method.name}
                  className="border border-[#3e3e42] rounded-lg p-3 bg-[#111216]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs font-semibold text-white">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  
                  {method.params.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {method.params.map((param) => (
                        <div key={param.name}>
                          <label className="text-xs text-gray-400 mb-1 block">
                            {param.name} ({param.type})
                          </label>
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={testParams[`${method.name}_${param.name}`] || ''}
                            onChange={(e) =>
                              setTestParams((prev) => ({
                                ...prev,
                                [`${method.name}_${param.name}`]: e.target.value,
                              }))
                            }
                            placeholder={param.placeholder}
                            className="w-full px-2 py-1.5 text-xs border border-[#3e3e42] rounded bg-[#111216] text-white outline-none focus:ring-2 focus:ring-near-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onTestCall(method, true)}
                    disabled={isTesting}
                    className="w-full px-3 py-1.5 text-xs bg-near-primary hover:bg-[#00D689] text-near-darker font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        Test {method.name}
                      </>
                    )}
                  </button>

                  {testResults[method.name] && (
                    <div
                      className={`mt-2 p-2 rounded text-xs ${
                        testResults[method.name].success
                          ? 'bg-green-900/30 text-green-200'
                          : 'bg-red-900/30 text-red-200'
                      }`}
                    >
                      {testResults[method.name].success ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">✓ Success</p>
                            {testResults[method.name].isRealCall !== undefined && (
                              <span className={`text-[0.65rem] px-1.5 py-0.5 rounded ${
                                testResults[method.name].isRealCall 
                                  ? 'bg-green-800/50 text-green-300' 
                                  : 'bg-blue-800/50 text-blue-300'
                              }`}>
                                {testResults[method.name].isRealCall ? 'Real' : 'Simulated'}
                              </span>
                            )}
                          </div>
                          <p className="font-mono mt-1 break-all">
                            {JSON.stringify(testResults[method.name].result)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">✗ Error</p>
                          <p className="mt-1">{testResults[method.name].error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Change Methods */}
        {functions.changeMethods.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              Change Methods
            </h3>
            <div className="space-y-3">
              {functions.changeMethods.map((method) => (
                <div
                  key={method.name}
                  className="border border-[#3e3e42] rounded-lg p-3 bg-[#111216]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs font-semibold text-white">
                        {method.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </div>

                  {method.params.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {method.params.map((param) => (
                        <div key={param.name}>
                          <label className="text-xs text-gray-400 mb-1 block">
                            {param.name} ({param.type})
                          </label>
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            value={testParams[`${method.name}_${param.name}`] || ''}
                            onChange={(e) =>
                              setTestParams((prev) => ({
                                ...prev,
                                [`${method.name}_${param.name}`]: e.target.value,
                              }))
                            }
                            placeholder={param.placeholder}
                            className="w-full px-2 py-1.5 text-xs border border-[#3e3e42] rounded bg-[#111216] text-white outline-none focus:ring-2 focus:ring-near-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onTestCall(method, false)}
                    disabled={isTesting || (deployedContractId && !walletAccountId)}
                    className="w-full px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    title={deployedContractId && !walletAccountId ? "Connect wallet to call change methods" : ""}
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-3 w-3" />
                        Call {method.name}
                      </>
                    )}
                  </button>
                  {deployedContractId && !walletAccountId && (
                    <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      Connect wallet to call this method
                    </p>
                  )}

                  {testResults[method.name] && (
                    <div
                      className={`mt-2 p-2 rounded text-xs ${
                        testResults[method.name].success
                          ? 'bg-green-900/30 text-green-200'
                          : 'bg-red-900/30 text-red-200'
                      }`}
                    >
                      {testResults[method.name].success ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">✓ Success</p>
                            {testResults[method.name].isRealCall !== undefined && (
                              <span className={`text-[0.65rem] px-1.5 py-0.5 rounded ${
                                testResults[method.name].isRealCall 
                                  ? 'bg-green-800/50 text-green-300' 
                                  : 'bg-blue-800/50 text-blue-300'
                              }`}>
                                {testResults[method.name].isRealCall ? 'Real' : 'Simulated'}
                              </span>
                            )}
                          </div>
                          {testResults[method.name].result?.txHash && (
                            <p className="font-mono mt-1 text-[0.65rem] break-all">
                              Tx: {testResults[method.name].result.txHash}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">✗ Error</p>
                          <p className="mt-1">{testResults[method.name].error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestPanel

