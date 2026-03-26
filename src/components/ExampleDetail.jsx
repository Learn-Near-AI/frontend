import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { X, CheckCircle } from 'lucide-react';
import { exampleCode } from '../data/examples';
import { isGuidedExample, exerciseHints } from '../data/guidedExercises';
import { TOUR_AUTO_START_DELAY_MS, CONSOLE_ERROR_LINES_MAX } from '../lib/appConstants';
import { useStreak } from '../hooks/useStreak';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { getActiveAccountId } from '../near/near';
import { config, getCompileApiUrl } from '../config';
import { logger } from '../lib/logger';
import ExampleHeader from './ExampleHeader';
import CodeEditor from './CodeEditor';
import InfoPanel from './InfoPanel';
import ConsolePanel from './ConsolePanel';
import OnboardingTour from './OnboardingTour';
import TourButton from './TourButton';

const PREFERRED_LANGUAGE_KEY = 'near_examples_preferred_language';

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(PREFERRED_LANGUAGE_KEY);
    return stored === 'JavaScript' || stored === 'Rust' ? stored : 'Rust';
  } catch {
    return 'Rust';
  }
}

function ExampleDetail({ example, onBack, shouldStartTour = false, onTourStart }) {
  const location = useLocation();
  const { completeExample, completedExamples, recentlyCompleted } = useStreak(
    location.pathname || '/'
  );
  const isIntroExample = example.id === 'intro';
  const guidedExample = isGuidedExample(example.id);
  const [activeLanguage, setActiveLanguageState] = useState(getStoredLanguage);
  const setActiveLanguage = (lang) => {
    if (isIntroExample) return;
    setActiveLanguageState(lang);
    try {
      localStorage.setItem(PREFERRED_LANGUAGE_KEY, lang);
    } catch (_) {}
  };
  const effectiveLanguage = isIntroExample ? 'Intro' : activeLanguage;

  const codeForExample = exampleCode[example.id] || {};
  const exerciseKey = effectiveLanguage + 'Exercise';
  const exerciseCode = guidedExample
    ? (codeForExample[exerciseKey] ?? codeForExample[effectiveLanguage])
    : null;
  const solutionCode = guidedExample ? codeForExample[effectiveLanguage] : null;
  const initialCode = isIntroExample
    ? (codeForExample.Intro ?? '')
    : (guidedExample
        ? (codeForExample[exerciseKey] ?? codeForExample[effectiveLanguage])
        : codeForExample[effectiveLanguage]) ||
      (isIntroExample
        ? ''
        : `// No ${effectiveLanguage} code sample is available yet for "${example.name}".
// Try switching language tabs, or pick another example from the sidebar.`);

  const [activeInfoTab, setActiveInfoTab] = useState('task');
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContractId, setDeployedContractId] = useState(null);
  const [deploymentTxHash, setDeploymentTxHash] = useState(null);
  const [wasmSize, setWasmSize] = useState(null);
  const [backendCLIConfigured, setBackendCLIConfigured] = useState(null);
  const [isWarningClosed, setIsWarningClosed] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [showingSolution, setShowingSolution] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  const handleShowSolution = () => {
    if (solutionCode) setCode(solutionCode);
    setShowingSolution(true);
  };
  const handleBackToExercise = () => {
    if (exerciseCode) setCode(exerciseCode);
    setShowingSolution(false);
  };

  const addConsoleOutput = (message) => {
    setConsoleOutput((prev) => prev + message + '\n');
  };

  useEffect(() => {
    setCode(initialCode);
    setShowingSolution(false);
  }, [example.id, activeLanguage, effectiveLanguage, initialCode]);

  // Reset deploying state on mount (in case user navigated away and came back)
  useEffect(() => {
    setIsDeploying(false);
  }, []);

  useEffect(() => {
    if (shouldStartTour) {
      const timer = setTimeout(() => {
        setRunTour(true);
        if (onTourStart) {
          onTourStart();
        }
      }, TOUR_AUTO_START_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [shouldStartTour, onTourStart]);

  // Check backend CLI configuration status (deployment backend)
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${config.backend.deploy}/api/near/status`);
        if (response.ok) {
          const status = await response.json();
          setBackendCLIConfigured(status.configured);
          logger.debug('Backend CLI configured:', status.configured);
        }
      } catch (error) {
        logger.warn('Could not check backend CLI status:', error);
        setBackendCLIConfigured(false);
      }
    };

    checkBackendStatus();
  }, []);

  const clearConsole = () => {
    setConsoleOutput('');
  };

  const handleRun = async () => {
    // For guided examples, always compile the exercise (learner's code to fix), not the solution
    const codeToCompile = guidedExample && showingSolution && exerciseCode ? exerciseCode : code;
    if (!codeToCompile.trim()) {
      addConsoleOutput('❌ Error: No code to run');
      return;
    }

    setIsRunning(true);
    clearConsole();
    addConsoleOutput('▶ Compiling contract...');
    const compileStartRun = Date.now();

    try {
      const compileApiUrl = getCompileApiUrl(activeLanguage);
      logger.debug(`[FRONTEND] Sending compile request to: ${compileApiUrl}/api/compile`);
      logger.debug(`[FRONTEND] Language: ${activeLanguage}, Code length: ${codeToCompile.length}`);

      const compileResponse = await fetch(`${compileApiUrl}/api/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToCompile, language: activeLanguage }),
      });

      logger.debug(
        `[FRONTEND] Response status: ${compileResponse.status} ${compileResponse.statusText}`
      );

      if (!compileResponse.ok) {
        const errorData = await compileResponse.json().catch(() => ({ error: 'Unknown error' }));
        logger.error('[FRONTEND] Error response:', errorData);
        const errorMsg =
          errorData.stderr ||
          errorData.error ||
          errorData.message ||
          `HTTP ${compileResponse.status}: ${compileResponse.statusText}`;
        addConsoleOutput(`❌ Error: ${errorMsg}`);
        return;
      }

      const compileResult = await compileResponse.json();
      logger.debug('[FRONTEND] Compile result:', {
        success: compileResult.success,
        hasWasm: !!compileResult.wasm,
        size: compileResult.size,
      });

      if (!compileResult.success) {
        // Extract detailed error message
        let errorMsg =
          compileResult.stderr ||
          compileResult.error ||
          compileResult.message ||
          'Compilation failed';

        // If stderr is very long, extract the most relevant part
        if (errorMsg.length > 1000) {
          // Try to find the actual error line
          const errorMatch =
            errorMsg.match(/✖\s+error\s+(.+?)(\n|$)/i) ||
            errorMsg.match(/error:\s*(.+?)(\n|$)/i) ||
            errorMsg.match(/Command failed:\s*(.+?)(\n|$)/i);
          if (errorMatch) {
            errorMsg = errorMatch[1].trim();
          } else {
            // Take last 1000 chars
            errorMsg = '...' + errorMsg.slice(-1000);
          }
        }

        logger.error('[FRONTEND] Compilation failed:', errorMsg);
        addConsoleOutput(`❌ Compilation Error:`);
        const errorLines = errorMsg.split('\n').slice(0, CONSOLE_ERROR_LINES_MAX);
        errorLines.forEach((line) => {
          if (line.trim()) {
            addConsoleOutput(`   ${line.trim()}`);
          }
        });
        if (errorMsg.split('\n').length > CONSOLE_ERROR_LINES_MAX) {
          addConsoleOutput(`   ... (see browser console for full error)`);
        }
        return; // Don't throw, just show the error and return
      }

      const compileTimeRun = ((Date.now() - compileStartRun) / 1000).toFixed(2);
      addConsoleOutput('✓ Contract compiled successfully');
      addConsoleOutput(`✓ WASM size: ${(compileResult.size / 1024).toFixed(2)} KB`);
      setWasmSize(compileResult.size);
      addConsoleOutput(
        JSON.stringify({
          text: `✓ Compilation Time: ${compileTimeRun}s`,
          color: 'green',
          bold: true,
        })
      );
      addConsoleOutput('\n💡 Note: Full execution requires deployment.');
      addConsoleOutput('   Click "Deploy" to deploy and test your contract on TestNet.');
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const compileApiUrl = getCompileApiUrl(activeLanguage);
        addConsoleOutput(`❌ Error: Failed to connect to backend`);
        addConsoleOutput(`   Backend URL: ${compileApiUrl}`);
        addConsoleOutput(`   Please check if the backend is running and accessible.`);
        addConsoleOutput(`   Error details: ${error.message}`);
      } else {
        addConsoleOutput(`❌ Error: ${error.message}`);
      }
      logger.error('Run error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDeploy = async () => {
    const codeToDeploy = guidedExample && showingSolution && exerciseCode ? exerciseCode : code;
    if (!codeToDeploy.trim()) {
      addConsoleOutput('❌ Error: No code to deploy');
      return;
    }
    await handleCLIDeploy(codeToDeploy);
  };

  // CLI deployment for both Rust and JavaScript contracts
  const handleCLIDeploy = async (codeToCompile) => {
    setIsDeploying(true);
    clearConsole();
    addConsoleOutput(`▶ Starting CLI deployment (${activeLanguage} contract)...`);
    addConsoleOutput('📋 Deployment Method: NEAR CLI (Backend)');
    addConsoleOutput('   No wallet connection required\n');
    addConsoleOutput('▶ Compiling contract...');
    const compileStartCLI = Date.now();

    try {
      // Step 1: Compile the contract (exercise for guided when solution is shown)
      const compileApiUrl = getCompileApiUrl(activeLanguage);
      const compileResponse = await fetch(`${compileApiUrl}/api/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToCompile, language: activeLanguage }),
      });

      if (!compileResponse.ok) {
        const errorData = await compileResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || `HTTP ${compileResponse.status}`);
      }

      const compileResult = await compileResponse.json();

      if (!compileResult.success) {
        throw new Error(compileResult.stderr || compileResult.error || 'Compilation failed');
      }

      const compileTimeCLI =
        compileResult.compilation_time != null
          ? Number(compileResult.compilation_time).toFixed(2)
          : ((Date.now() - compileStartCLI) / 1000).toFixed(2);
      addConsoleOutput('✓ Contract compiled successfully');
      addConsoleOutput(`✓ WASM size: ${(compileResult.size / 1024).toFixed(2)} KB`);
      setWasmSize(compileResult.size);
      addConsoleOutput(
        JSON.stringify({
          text: `✓ Compilation Time: ${compileTimeCLI}s`,
          color: 'green',
          bold: true,
        })
      );

      // Step 2: Deploy using backend NEAR CLI
      addConsoleOutput(JSON.stringify({ text: '— Deploying now', color: 'red' }));
      addConsoleOutput('\n▶ Deploying via NEAR CLI...');
      addConsoleOutput('   (Using backend deployment account)');

      // Get user identifier for deployment
      const accountId = await getActiveAccountId();
      const userId = accountId ? accountId.split('.')[0] : 'anonymous';
      const projectId = example.id || 'near-example';

      const deployResponse = await fetch(`${config.backend.deploy}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasmBase64: compileResult.wasm,
          useSubaccount: true,
          userId: userId,
          projectId: projectId,
          initMethod: 'new',
          initArgs: {},
        }),
      });

      if (!deployResponse.ok) {
        const errorData = await deployResponse.json().catch(() => ({ error: 'Deployment failed' }));

        // Check if CLI is not configured
        if (deployResponse.status === 503) {
          addConsoleOutput('❌ Backend NEAR CLI not configured');
          addConsoleOutput('   The backend needs NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY');
          addConsoleOutput('   Contact the administrator to enable CLI deployments');
          throw new Error('Backend NEAR CLI not configured');
        }

        throw new Error(errorData.error || 'Deployment failed');
      }

      const deployResult = await deployResponse.json();

      if (!deployResult.success) {
        throw new Error(deployResult.error || 'Deployment failed');
      }

      addConsoleOutput('✓ Contract deployed successfully!');
      addConsoleOutput(`✓ Contract ID: ${deployResult.contractId}`);
      addConsoleOutput(`✓ Transaction hash: ${deployResult.transactionHash}`);
      addConsoleOutput(`✓ Network: ${deployResult.network}`);
      if (deployResult.deploymentTime) {
        addConsoleOutput(`✓ Deployment time: ${deployResult.deploymentTime}s`);
      }

      if (deployResult.explorerUrl) {
        addConsoleOutput(`\n🔗 View in Explorer:`);
        addConsoleOutput(`   ${deployResult.explorerUrl}`);
      }
      if (deployResult.accountUrl) {
        addConsoleOutput(`\n🔗 View Account:`);
        addConsoleOutput(`   ${deployResult.accountUrl}`);
      }

      setDeployedContractId(deployResult.contractId);
      setDeploymentTxHash(deployResult.transactionHash);

      // Optional: Test the deployed contract
      addConsoleOutput('\n▶ Testing deployed contract...');
      try {
        const testResponse = await fetch(`${config.backend.deploy}/api/contract/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contractAccountId: deployResult.contractId,
            methodName: 'hello_world',
            args: {},
          }),
        });

        if (testResponse.ok) {
          const testResult = await testResponse.json();
          if (testResult.success) {
            addConsoleOutput(`✓ Test call successful: ${JSON.stringify(testResult.result)}`);
          }
        }
      } catch (testError) {
        logger.warn('Test call failed:', testError);
      }

      // Contract deployed successfully!
      addConsoleOutput('\n🎉 Deployment complete!');
      setShowCompleteButton(true);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        addConsoleOutput(`❌ Error: Failed to connect to backend`);
        addConsoleOutput(`   Backend URL: ${config.backend.deploy}`);
        addConsoleOutput(`   Please check if the backend is running and accessible.`);
      } else {
        addConsoleOutput(`❌ Error: ${error.message}`);
      }
      logger.error('CLI Deploy error:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleResetCode = () => {
    const toCode = guidedExample ? exerciseCode : initialCode;
    if (toCode) setCode(toCode);
    setShowingSolution(false);
    clearConsole();
  };

  const handleStartTour = () => {
    setRunTour(true);
  };

  const handleTourFinish = () => {
    setRunTour(false);
  };

  return (
    <div className="pl-4 py-6 md:py-4 max-w-5xl mx-auto space-y-6">
      {/* Onboarding Tour */}
      <OnboardingTour run={runTour} onFinish={handleTourFinish} />

      {/* Floating Help Button */}
      <TourButton onStartTour={handleStartTour} />
      <ExampleHeader example={example} activeLanguage={effectiveLanguage} />

      {/* Backend CLI Status Warning */}
      {backendCLIConfigured === false && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-xl"></span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-300 mb-1">
                Backend CLI Deployment Not Configured
              </h3>
              <p className="text-sm text-yellow-400">
                Contracts require backend deployment via NEAR CLI. The backend is not currently
                configured with deployment credentials. You can still compile and test the code, but
                deployment is disabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {backendCLIConfigured === true && !isWarningClosed && (
        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 text-lg">ℹ️</span>
            <p className="text-sm text-blue-800 dark:text-blue-300 flex-1">
              <strong>Contracts</strong> will be deployed via backend NEAR CLI. No wallet connection
              required.
            </p>
            <button
              onClick={() => setIsWarningClosed(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
              aria-label="Close warning"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={isIntroExample ? 'w-full' : 'lg:basis-3/5'}>
          <CodeEditor
            code={code}
            setCode={setCode}
            activeLanguage={effectiveLanguage}
            setActiveLanguage={setActiveLanguage}
            isRunning={isRunning}
            isDeploying={isDeploying}
            onRun={handleRun}
            onDeploy={handleDeploy}
            onCopy={handleCopyCode}
            onReset={handleResetCode}
            backendCLIConfigured={backendCLIConfigured}
            isIntroExample={isIntroExample}
            isGuidedExample={guidedExample}
            exerciseHints={exerciseHints[example.id]?.[effectiveLanguage] ?? []}
            solutionCode={solutionCode}
            showingSolution={showingSolution}
            onShowSolution={handleShowSolution}
            onBackToExercise={handleBackToExercise}
            exerciseCode={exerciseCode}
          />
        </div>

        {!isIntroExample && (
          <div className="lg:basis-2/5">
            <InfoPanel
              example={example}
              activeInfoTab={activeInfoTab}
              setActiveInfoTab={setActiveInfoTab}
              code={code}
              activeLanguage={effectiveLanguage}
              deployedContractId={deployedContractId}
              isDeploying={isDeploying}
            />
          </div>
        )}
      </div>

      {!isIntroExample && (
        <>
          {showCompleteButton && !completedExamples.includes(example.id) && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-300">
                      Example Completed!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Great work! You've successfully deployed this contract.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    completeExample(example.id);
                    setShowCompleteButton(false);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Complete
                </button>
              </div>
            </div>
          )}
          {completedExamples.includes(example.id) && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    Example Completed!
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You've completed this example. The next example in the learning path is now
                    unlocked!
                  </p>
                </div>
              </div>
            </div>
          )}
          <ConsolePanel
            consoleOutput={consoleOutput}
            deployedContractId={deployedContractId}
            deploymentTxHash={deploymentTxHash}
            wasmSize={wasmSize}
          />
        </>
      )}
    </div>
  );
}

ExampleDetail.propTypes = {
  example: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  shouldStartTour: PropTypes.bool,
  onTourStart: PropTypes.func,
};

export default ExampleDetail;
