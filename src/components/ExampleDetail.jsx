import React, { useState, useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";
import { exampleCode } from "../data/examples";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { getActiveAccountId } from "../near/near";
import ExampleHeader from "./ExampleHeader";
import CodeEditor from "./CodeEditor";
import InfoPanel from "./InfoPanel";
import ConsolePanel from "./ConsolePanel";
import OnboardingTour from "./OnboardingTour";
import TourButton from "./TourButton";

// Backend URLs - use proxy in development to avoid CORS issues
const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const RUST_COMPILE_URL = import.meta.env.VITE_RUST_COMPILE_URL || 
  (isDev ? '/api/backend-rust' : 'https://rustendpoint.fly.dev');
const JS_COMPILE_URL = import.meta.env.VITE_JS_COMPILE_URL || 
  (isDev ? '/api/backend-js' : 'https://learn-near-backend.fly.dev');
const DEPLOY_URL = import.meta.env.VITE_DEPLOY_URL || 
  (isDev ? '/api/backend-rust' : 'https://rustendpoint.fly.dev');

const TOUR_STORAGE_KEY = 'near_examples_tour_completed';
const PREFERRED_LANGUAGE_KEY = 'near_examples_preferred_language';

// Helper function to get the appropriate compile API URL based on language
const getCompileApiUrl = (language) => {
  return language === "Rust" ? RUST_COMPILE_URL : JS_COMPILE_URL;
};

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(PREFERRED_LANGUAGE_KEY);
    return stored === "JavaScript" || stored === "Rust" ? stored : "Rust";
  } catch {
    return "Rust";
  }
}

function ExampleDetail({ example, onBack, shouldStartTour = false, onTourStart }) {
  const [activeLanguage, setActiveLanguageState] = useState(getStoredLanguage);
  const setActiveLanguage = (lang) => {
    setActiveLanguageState(lang);
    try {
      localStorage.setItem(PREFERRED_LANGUAGE_KEY, lang);
    } catch (_) {}
  };
  const [activeInfoTab, setActiveInfoTab] = useState("explanation");
  const [code, setCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContractId, setDeployedContractId] = useState(null);
  const [deploymentTxHash, setDeploymentTxHash] = useState(null);
  const [backendCLIConfigured, setBackendCLIConfigured] = useState(null);
  const [isWarningClosed, setIsWarningClosed] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const initialCode =
    exampleCode[example.id]?.[activeLanguage] ||
    `// No ${activeLanguage} code sample is available yet for "${example.name}".
// Try switching language tabs, or pick another example from the sidebar.`;

  const addConsoleOutput = (message) => {
    setConsoleOutput((prev) => prev + message + "\n");
  };

  useEffect(() => {
    setCode(initialCode);
  }, [example.id, activeLanguage, initialCode]);

  // Reset deploying state on mount (in case user navigated away and came back)
  useEffect(() => {
    setIsDeploying(false);
  }, []);

  // Start tour if triggered from ExamplesBrowser
  useEffect(() => {
    if (shouldStartTour) {
      // Auto-start tour after a short delay
      const timer = setTimeout(() => {
        setRunTour(true);
        if (onTourStart) {
          onTourStart();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldStartTour, onTourStart]);

  // Check backend CLI configuration status (deployment backend)
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${DEPLOY_URL}/api/near/status`);
        if (response.ok) {
          const status = await response.json();
          setBackendCLIConfigured(status.configured);
          console.log("Backend CLI configured:", status.configured);
        }
      } catch (error) {
        console.warn("Could not check backend CLI status:", error);
        setBackendCLIConfigured(false);
      }
    };

    checkBackendStatus();
  }, []);

  // Handle transactionHashes URL parameter - redirect to success page
  useEffect(() => {
    // Check URL parameter on mount (for page reloads)
    const urlParams = new URLSearchParams(window.location.search);
    const transactionHashes = urlParams.get("transactionHashes");

    if (transactionHashes && !window.location.pathname.includes("/success")) {
      // Reset deploying state before redirect
      setIsDeploying(false);
      // Redirect to success page with transaction hash
      window.history.replaceState(
        {},
        "",
        `/examples/success?transactionHashes=${transactionHashes}`
      );
      window.location.href = `/examples/success?transactionHashes=${transactionHashes}`;
    }
  }, []); // Only run on mount

  // Handle transactionHashes URL parameter - check continuously for new transactions and redirect
  useEffect(() => {
    let previousUrl = window.location.href;

    const checkAndRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const transactionHashes = urlParams.get("transactionHashes");
      const currentUrl = window.location.href;

      // If URL changed, reset deploying state
      if (currentUrl !== previousUrl) {
        setIsDeploying(false);
        previousUrl = currentUrl;
      }

      if (transactionHashes && !window.location.pathname.includes("/success")) {
        // Reset deploying state before redirect
        setIsDeploying(false);
        // Redirect to success page
        window.history.replaceState(
          {},
          "",
          `/examples/success?transactionHashes=${transactionHashes}`
        );
        window.location.href = `/examples/success?transactionHashes=${transactionHashes}`;
      }
    };

    // Check immediately
    checkAndRedirect();

    // Check periodically to catch URL changes
    const interval = setInterval(checkAndRedirect, 500);

    // Listen to popstate events
    window.addEventListener("popstate", checkAndRedirect);

    return () => {
      clearInterval(interval);
      window.removeEventListener("popstate", checkAndRedirect);
    };
  }, []);

  const clearConsole = () => {
    setConsoleOutput("");
  };

  const handleRun = async () => {
    if (!code.trim()) {
      addConsoleOutput("❌ Error: No code to run");
      return;
    }

    setIsRunning(true);
    clearConsole();
    addConsoleOutput("▶ Compiling contract...");
    const compileStartRun = Date.now();

    try {
      const compileApiUrl = getCompileApiUrl(activeLanguage);
      console.log(
        `[FRONTEND] Sending compile request to: ${compileApiUrl}/api/compile`
      );
      console.log(
        `[FRONTEND] Language: ${activeLanguage}, Code length: ${code.length}`
      );

      const compileResponse = await fetch(`${compileApiUrl}/api/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: activeLanguage }),
      });

      console.log(
        `[FRONTEND] Response status: ${compileResponse.status} ${compileResponse.statusText}`
      );

      if (!compileResponse.ok) {
        const errorData = await compileResponse
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("[FRONTEND] Error response:", errorData);
        const errorMsg =
          errorData.stderr ||
          errorData.error ||
          errorData.message ||
          `HTTP ${compileResponse.status}: ${compileResponse.statusText}`;
        addConsoleOutput(`❌ Error: ${errorMsg}`);
        return;
      }

      const compileResult = await compileResponse.json();
      console.log("[FRONTEND] Compile result:", {
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
          "Compilation failed";

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
            errorMsg = "..." + errorMsg.slice(-1000);
          }
        }

        console.error("[FRONTEND] Compilation failed:", errorMsg);
        addConsoleOutput(`❌ Compilation Error:`);
        // Split long error messages into multiple lines
        const errorLines = errorMsg.split("\n").slice(0, 10); // Show first 10 lines
        errorLines.forEach((line) => {
          if (line.trim()) {
            addConsoleOutput(`   ${line.trim()}`);
          }
        });
        if (errorMsg.split("\n").length > 10) {
          addConsoleOutput(`   ... (see browser console for full error)`);
        }
        return; // Don't throw, just show the error and return
      }

      const compileTimeRun = ((Date.now() - compileStartRun) / 1000).toFixed(2);
      addConsoleOutput("✓ Contract compiled successfully");
      addConsoleOutput(
        `✓ WASM size: ${(compileResult.size / 1024).toFixed(2)} KB`
      );
      addConsoleOutput(JSON.stringify({ text: `✓ Compilation Time: ${compileTimeRun}s`, color: "green", bold: true }));
      addConsoleOutput("\n💡 Note: Full execution requires deployment.");
      addConsoleOutput(
        '   Click "Deploy" to deploy and test your contract on TestNet.'
      );
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        const compileApiUrl = getCompileApiUrl(activeLanguage);
        addConsoleOutput(`❌ Error: Failed to connect to backend`);
        addConsoleOutput(`   Backend URL: ${compileApiUrl}`);
        addConsoleOutput(
          `   Please check if the backend is running and accessible.`
        );
        addConsoleOutput(`   Error details: ${error.message}`);
      } else {
        addConsoleOutput(`❌ Error: ${error.message}`);
      }
      console.error("Run error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDeploy = async () => {
    if (!code.trim()) {
      addConsoleOutput("❌ Error: No code to deploy");
      return;
    }
    await handleCLIDeploy();
  };

  // CLI deployment for both Rust and JavaScript contracts
  const handleCLIDeploy = async () => {
    setIsDeploying(true);
    clearConsole();
    addConsoleOutput(`▶ Starting CLI deployment (${activeLanguage} contract)...`);
    addConsoleOutput("📋 Deployment Method: NEAR CLI (Backend)");
    addConsoleOutput("   No wallet connection required\n");
    addConsoleOutput("▶ Compiling contract...");
    const compileStartCLI = Date.now();

    try {
      // Step 1: Compile the contract
      const compileApiUrl = getCompileApiUrl(activeLanguage);
      const compileResponse = await fetch(`${compileApiUrl}/api/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: activeLanguage }),
      });

      if (!compileResponse.ok) {
        const errorData = await compileResponse
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP ${compileResponse.status}`
        );
      }

      const compileResult = await compileResponse.json();

      if (!compileResult.success) {
        throw new Error(
          compileResult.stderr || compileResult.error || "Compilation failed"
        );
      }

      const compileTimeCLI = compileResult.compilation_time != null
        ? Number(compileResult.compilation_time).toFixed(2)
        : ((Date.now() - compileStartCLI) / 1000).toFixed(2);
      addConsoleOutput("✓ Contract compiled successfully");
      addConsoleOutput(
        `✓ WASM size: ${(compileResult.size / 1024).toFixed(2)} KB`
      );
      addConsoleOutput(JSON.stringify({ text: `✓ Compilation Time: ${compileTimeCLI}s`, color: "green", bold: true }));

      // Step 2: Deploy using backend NEAR CLI
      addConsoleOutput(JSON.stringify({ text: "— Deploying now", color: "red" }));
      addConsoleOutput("\n▶ Deploying via NEAR CLI...");
      addConsoleOutput("   (Using backend deployment account)");

      // Get user identifier for deployment
      const accountId = await getActiveAccountId();
      const userId = accountId ? accountId.split('.')[0] : 'anonymous';
      const projectId = example.id || 'near-example';

      const deployResponse = await fetch(`${DEPLOY_URL}/api/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasmBase64: compileResult.wasm,
          useSubaccount: true,
          userId: userId,
          projectId: projectId,
          initMethod: "new",
          initArgs: {},
        }),
      });

      if (!deployResponse.ok) {
        const errorData = await deployResponse
          .json()
          .catch(() => ({ error: "Deployment failed" }));

        // Check if CLI is not configured
        if (deployResponse.status === 503) {
          addConsoleOutput("❌ Backend NEAR CLI not configured");
          addConsoleOutput(
            "   The backend needs NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY"
          );
          addConsoleOutput(
            "   Contact the administrator to enable CLI deployments"
          );
          throw new Error("Backend NEAR CLI not configured");
        }

        throw new Error(errorData.error || "Deployment failed");
      }

      const deployResult = await deployResponse.json();

      if (!deployResult.success) {
        throw new Error(deployResult.error || "Deployment failed");
      }

      addConsoleOutput("✓ Contract deployed successfully!");
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
      addConsoleOutput("\n▶ Testing deployed contract...");
      try {
        const testResponse = await fetch(`${DEPLOY_URL}/api/contract/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractAccountId: deployResult.contractId,
            methodName: "hello_world",
            args: {},
          }),
        });

        if (testResponse.ok) {
          const testResult = await testResponse.json();
          if (testResult.success) {
            addConsoleOutput(
              `✓ Test call successful: ${JSON.stringify(testResult.result)}`
            );
          }
        }
      } catch (testError) {
        // Ignore test errors - deployment was successful
        console.warn("Test call failed:", testError);
      }

      // Contract deployed successfully!
      addConsoleOutput("\n🎉 Deployment complete!");
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        addConsoleOutput(`❌ Error: Failed to connect to backend`);
        addConsoleOutput(`   Backend URL: ${DEPLOY_URL}`);
        addConsoleOutput(
          `   Please check if the backend is running and accessible.`
        );
      } else {
        addConsoleOutput(`❌ Error: ${error.message}`);
      }
      console.error("CLI Deploy error:", error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleResetCode = () => {
    setCode(initialCode);
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
      <ExampleHeader example={example} activeLanguage={activeLanguage} />

      {/* Backend CLI Status Warning */}
      {backendCLIConfigured === false && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-300 mb-1">
                Backend CLI Deployment Not Configured
              </h3>
              <p className="text-sm text-yellow-400">
                Contracts require backend deployment via NEAR CLI. The
                backend is not currently configured with deployment credentials.
                You can still compile and test the code, but deployment is
                disabled.
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
              <strong>Contracts</strong> will be deployed via backend NEAR
              CLI. No wallet connection required.
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
        <CodeEditor
          code={code}
          setCode={setCode}
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
          isRunning={isRunning}
          isDeploying={isDeploying}
          onRun={handleRun}
          onDeploy={handleDeploy}
          onCopy={handleCopyCode}
          onReset={handleResetCode}
          backendCLIConfigured={backendCLIConfigured}
        />

        <InfoPanel
          example={example}
          activeInfoTab={activeInfoTab}
          setActiveInfoTab={setActiveInfoTab}
          code={code}
          activeLanguage={activeLanguage}
          deployedContractId={deployedContractId}
          isDeploying={isDeploying}
        />
      </div>

      <ConsolePanel
        consoleOutput={consoleOutput}
        deployedContractId={deployedContractId}
        deploymentTxHash={deploymentTxHash}
      />
    </div>
  );
}

export default ExampleDetail;
