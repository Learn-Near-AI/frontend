import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { config } from '../config';
import CodeEditor from './CodeEditor';
import ConsolePanel from './ConsolePanel';
import { useStreak } from '../context/StreakContext';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const PROMPT_SNIPPETS = [
  {
    id: 'greeting',
    label: 'Greeting Contract',
    prompt:
      'Write a simple NEAR smart contract in Rust that stores and returns a greeting message.',
  },
  {
    id: 'view',
    label: 'View Methods',
    prompt:
      'Create a NEAR smart contract with view methods that read data from the blockchain without making changes.',
  },
  {
    id: 'change',
    label: 'Change Methods',
    prompt: 'Build a NEAR smart contract with change methods that modify the blockchain state.',
  },
  {
    id: 'state',
    label: 'State Management',
    prompt: 'Write a NEAR smart contract demonstrating how to manage persistent state in Rust.',
  },
  {
    id: 'nft',
    label: 'NFT Contract',
    prompt: 'Create a basic NFT (Non-Fungible Token) smart contract on NEAR using Rust.',
  },
  {
    id: 'ft',
    label: 'FT Contract',
    prompt: 'Build a fungible token (like a cryptocurrency) smart contract on NEAR.',
  },
];

function AgentPage() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { setCurrentPath } = useStreak();

  useEffect(() => {
    setCurrentPath(currentPath);
  }, [currentPath, setCurrentPath]);

  const ai = useMemo(
    () => (GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null),
    []
  );

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your Guide AI agents. Ask me anything about building on NEAR, smart contracts, and debugging",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [code, setCode] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('Rust');
  const [isRunning, setIsRunning] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [backendCLIConfigured, setBackendCLIConfigured] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [wasmSize, setWasmSize] = useState(null);
  const [deployedContractId, setDeployedContractId] = useState(null);
  const [deploymentTxHash, setDeploymentTxHash] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [isUnderstood, setIsUnderstood] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('chat');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const extractCodeFromResponse = (text) => {
    const rustMatch = text.match(/```rust\n([\s\S]*?)```/);
    const javascriptMatch = text.match(/```javascript\n([\s\S]*?)```/);

    let extractedExplanation = text;

    if (rustMatch) {
      setActiveLanguage('Rust');
      setCode(rustMatch[1].trim());
      addConsoleOutput('✓ loaded to editor (Rust)');
      extractedExplanation = text.replace(/```rust\n[\s\S]*?```/, '').trim();
    } else if (javascriptMatch) {
      setActiveLanguage('JavaScript');
      setCode(javascriptMatch[1].trim());
      addConsoleOutput('✓ loaded to editor (JavaScript)');
      extractedExplanation = text.replace(/```javascript\n[\s\S]*?```/, '').trim();
    }

    if (extractedExplanation) {
      setExplanation(extractedExplanation);
    }

    return rustMatch || javascriptMatch ? true : false;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!GEMINI_API_KEY || !ai) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input },
        {
          role: 'assistant',
          content:
            'AI feature is not configured. Please set VITE_GEMINI_API_KEY environment variable.',
        },
      ]);
      setInput('');
      return;
    }

    const userQuestion = input.trim();
    setInput('');
    setIsLoading(true);
    setExplanation(null);

    const userMessage = { role: 'user', content: userQuestion };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const context = `You are a NEAR Protocol smart contract AI assistant using **near-sdk 5.x**.

Language: ${activeLanguage}

IMPORTANT - SDK VERSION:
- Use near-sdk 5.x syntax only
- Rust: \`use near_sdk::near;\`, \`use near_sdk::collections::*;\`, \`#[near(contract_state)]\`, \`#[derive(PanicOnDefault)]\`
- JavaScript: \`import { NearBindgen, view, call, near } from "near-sdk-js";\`
- DO NOT use deprecated APIs

RULES:
- NO tests, NO comments, NO explanations inside code
- Clean production-ready code only
- Include necessary imports
- Use correct SDK 5.x patterns

EXPLANATION FORMAT:
- Keep it 2-3 short paragraphs max
- Use clear spacing between sections
- Cover: What it does, Key functions, How to use
- Be direct and concise

User: ${userQuestion}`;

      const contents = `${context}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      let text = response.text;

      const hasCode = extractCodeFromResponse(text);

      if (hasCode) {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Done', isDone: true }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addConsoleOutput = (text) => {
    setConsoleOutput((prev) => prev + '\n' + text);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput('▶ Starting compilation...');

    try {
      const compileApiUrl = config.backend;
      const compileEndpoint = activeLanguage === 'JavaScript' ? '/api/js/compile' : '/api/compile';

      const compileResponse = await fetch(`${compileApiUrl}${compileEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: activeLanguage }),
      });

      if (compileResponse.ok) {
        const compileResult = await compileResponse.json();
        if (compileResult.success) {
          addConsoleOutput('✓ Contract compiled successfully');
          addConsoleOutput(`✓ WASM size: ${(compileResult.size / 1024).toFixed(2)} KB`);
          setWasmSize(compileResult.size);
          addConsoleOutput('\n💡 Click "Deploy" to deploy and test your contract on TestNet.');
        } else {
          const errorObj = compileResult.error;
          let errorMsg =
            compileResult.stderr ||
            (typeof errorObj === 'object' ? errorObj?.message || errorObj?.error : errorObj) ||
            compileResult.message ||
            'Compilation failed';
          addConsoleOutput(`❌ Compilation failed: ${errorMsg}`);
        }
      } else {
        const errorData = await compileResponse.json().catch(() => ({}));
        const errorObj = errorData.error;
        let errorMsg =
          errorData.stderr ||
          (typeof errorObj === 'object' ? errorObj?.message || errorObj?.error : errorObj) ||
          errorData.message ||
          `HTTP ${compileResponse.status}`;
        addConsoleOutput(`❌ Error: ${errorMsg}`);
      }
    } catch (error) {
      addConsoleOutput(`❌ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setConsoleOutput('▶ Starting deployment...');

    try {
      const compileApiUrl = config.backend;
      const compileEndpoint = activeLanguage === 'JavaScript' ? '/api/js/compile' : '/api/compile';

      const compileResponse = await fetch(`${compileApiUrl}${compileEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: activeLanguage }),
      });

      const compileResult = await compileResponse.json();

      if (!compileResponse.ok || !compileResult.success) {
        const errorObj = compileResult.error;
        let errorMsg =
          compileResult.stderr ||
          (typeof errorObj === 'object' ? errorObj?.message || errorObj?.error : errorObj) ||
          compileResult.message ||
          'Compilation failed';
        addConsoleOutput(`❌ Compilation failed: ${errorMsg}`);
        setIsDeploying(false);
        return;
      }

      addConsoleOutput('✓ Contract compiled successfully');

      const deployResponse = await fetch(`${config.backend}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wasmBase64: compileResult.wasm }),
      });

      if (deployResponse.ok) {
        const deployResult = await deployResponse.json();
        if (deployResult.success) {
          addConsoleOutput('✓ Contract deployed successfully!');
          addConsoleOutput(`✓ Contract ID: ${deployResult.contractId}`);
          addConsoleOutput(`✓ Transaction hash: ${deployResult.transactionHash}`);
          setDeployedContractId(deployResult.contractId);
          setDeploymentTxHash(deployResult.transactionHash);
        } else {
          addConsoleOutput(`❌ Deployment failed: ${deployResult.error || 'Unknown error'}`);
        }
      } else {
        addConsoleOutput(`❌ Deployment failed: HTTP ${deployResponse.status}`);
      }
    } catch (error) {
      addConsoleOutput(`❌ Error: ${error.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleResetCode = () => {
    setCode(SAMPLE_CODE[activeLanguage]);
    addConsoleOutput('Code reset to original example');
  };

  const handleLanguageChange = (lang) => {
    setActiveLanguage(lang);
    setCode('');
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-[#111216]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-4">
          <div className="flex bg-gray-100 dark:bg-[#1a1b1f] rounded-lg p-1">
            <button
              onClick={() => setActiveMobileTab('chat')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeMobileTab === 'chat'
                  ? 'bg-white dark:bg-[#111216] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Bot className="h-4 w-4" />
              AI Chat
            </button>
            <button
              onClick={() => setActiveMobileTab('code')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeMobileTab === 'code'
                  ? 'bg-white dark:bg-[#111216] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-base">{`</>`}</span>
              Code
            </button>
            <button
              onClick={() => setActiveMobileTab('explain')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeMobileTab === 'explain'
                  ? 'bg-white dark:bg-[#111216] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="text-base">📖</span>
              Explain
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-4">
          {/* Left Column - Explanation */}
          <div className="basis-[20%] bg-white dark:bg-[#111216] flex flex-col rounded-xl border border-gray-200 dark:border-[#3e3e42] min-w-0 self-start">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3e3e42]">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Explanation
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {explanation ? (
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-3">
                  <div className="pb-2 border-b border-gray-200 dark:border-[#3e3e42]">
                    <a
                      href={config.links.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-near-primary hover:text-[#00D689] font-medium flex items-center gap-1 w-fit"
                    >
                      Learn More →
                    </a>
                  </div>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-sm font-bold text-gray-900 dark:text-white pt-2 pb-1 border-b border-gray-200 dark:border-[#3e3e42]">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xs font-semibold text-gray-900 dark:text-white mt-3 mb-2 flex items-center gap-2">
                          <span className="w-1 h-1 bg-near-primary rounded-full"></span>
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 ml-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 ml-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-xs text-gray-600 dark:text-gray-400">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900 dark:text-gray-200">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-500 dark:text-gray-400">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="px-1.5 py-0.5 bg-near-primary/10 text-near-primary rounded text-[0.7rem] font-mono">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {explanation}
                  </ReactMarkdown>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#3e3e42]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUnderstood}
                        onChange={(e) => setIsUnderstood(e.target.checked)}
                        className="w-6 h-6 rounded border-gray-300 dark:border-[#3e3e42] text-near-primary focus:ring-near-primary"
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        I have read and understood
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                    Every line of code you generate here is a lesson. Don't just copy — understand,
                    break, rebuild. Master the patterns, own the craft.
                  </p>
                  <p className="mt-4 text-xs font-bold text-near-primary uppercase tracking-wider">
                    Learn by Building. Own the Future.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle + Right Columns Wrapper */}
          <div className="basis-[80%] flex flex-col gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-blue-900 text-lg ">💡</span>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mt-1">
                    New: Please read the explanation and check the understood box, before compiling
                    or deploying.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              {/* Middle Column - Code Editor */}
              <div className="basis-[60%] flex flex-col gap-4 bg-white dark:bg-[#111216] rounded-xl border border-gray-200 dark:border-[#3e3e42] min-w-0 self-start">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  activeLanguage={activeLanguage}
                  setActiveLanguage={handleLanguageChange}
                  isRunning={isRunning}
                  isDeploying={isDeploying}
                  onRun={handleRun}
                  onDeploy={handleDeploy}
                  onCopy={handleCopyCode}
                  onReset={handleResetCode}
                  backendCLIConfigured={backendCLIConfigured}
                  isUnderstood={isUnderstood}
                />
                <ConsolePanel
                  consoleOutput={consoleOutput}
                  deployedContractId={deployedContractId}
                  deploymentTxHash={deploymentTxHash}
                  wasmSize={wasmSize}
                />
              </div>

              {/* Right Column - AI Chat Interface */}
              <div className="basis-[40%] flex flex-col min-w-0 self-start bg-white dark:bg-[#111216] border border-gray-200 dark:border-[#3e3e42] rounded-xl">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3e3e42]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-near-primary" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        AI Agent
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                    >
                      {message.isDone ? (
                        <div className="max-w-[85%] px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm font-medium">Done</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-near-primary text-white'
                              : 'bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e3e42]'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42] px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-[#3e3e42]">
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Quick prompts for Contracts:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {PROMPT_SNIPPETS.map((snippet) => (
                        <button
                          key={snippet.id}
                          onClick={() => setInput(snippet.prompt)}
                          className="px-2 py-1 text-xs bg-near-primary/10 hover:bg-near-primary/20 text-near-primary border border-near-primary/30 rounded-full transition-colors"
                        >
                          {snippet.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Ask about NEAR development..."
                      rows={1}
                      className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-near-primary focus:border-transparent transition-all text-sm resize-none"
                      disabled={isLoading}
                      style={{ minHeight: '40px', maxHeight: '200px' }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 bottom-3 p-1.5 bg-near-primary hover:bg-[#00D689] disabled:bg-gray-300 dark:disabled:bg-[#3e3e42] disabled:cursor-not-allowed text-white rounded-md transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Alert - always visible on mobile */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-lg ">💡</span>
              <div className="flex-1">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                  Read explanation & check box before compiling/deploying.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Tab */}
          {activeMobileTab === 'chat' && (
            <div className="flex flex-col gap-4">
              <div className="flex-1 bg-white dark:bg-[#111216] rounded-xl border border-gray-200 dark:border-[#3e3e42] min-h-[50vh]">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#3e3e42]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-near-primary" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      AI Agent
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[40vh]">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                    >
                      {message.isDone ? (
                        <div className="max-w-[85%] px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm font-medium">Done</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-near-primary text-white'
                              : 'bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white border border-gray-200 dark:border-[#3e3e42]'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42] px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-[#3e3e42]">
                  <div className="mb-2 overflow-x-auto">
                    <div className="flex gap-1.5 min-w-max">
                      {PROMPT_SNIPPETS.map((snippet) => (
                        <button
                          key={snippet.id}
                          onClick={() => setInput(snippet.prompt)}
                          className="px-2 py-1 text-xs bg-near-primary/10 hover:bg-near-primary/20 text-near-primary border border-near-primary/30 rounded-full transition-colors whitespace-nowrap"
                        >
                          {snippet.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
  <textarea
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }}
    placeholder="Ask about NEAR development..."
    className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-100 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#3e3e42] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-near-primary focus:border-transparent transition-all text-sm"
    disabled={isLoading}
  />
  <button
    onClick={handleSend}
    disabled={!input.trim() || isLoading}
    className="absolute right-2 bottom-3 p-1.5 bg-near-primary hover:bg-[#00D689] disabled:bg-gray-300 dark:disabled:bg-[#3e3e42] disabled:cursor-not-allowed text-white rounded-md transition-colors"
  >
    <Send className="h-4 w-4" />
  </button>
</div>
                </div>
              </div>
            </div>
          )}

          {/* Code Tab */}
          {activeMobileTab === 'code' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-[#111216] rounded-xl border border-gray-200 dark:border-[#3e3e42]">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  activeLanguage={activeLanguage}
                  setActiveLanguage={handleLanguageChange}
                  isRunning={isRunning}
                  isDeploying={isDeploying}
                  onRun={handleRun}
                  onDeploy={handleDeploy}
                  onCopy={handleCopyCode}
                  onReset={handleResetCode}
                  backendCLIConfigured={backendCLIConfigured}
                  isUnderstood={isUnderstood}
                />
              </div>
              <ConsolePanel
                consoleOutput={consoleOutput}
                deployedContractId={deployedContractId}
                deploymentTxHash={deploymentTxHash}
                wasmSize={wasmSize}
              />
            </div>
          )}

          {/* Explanation Tab */}
          {activeMobileTab === 'explain' && (
            <div className="bg-white dark:bg-[#111216] rounded-xl border border-gray-200 dark:border-[#3e3e42] p-4 min-h-[50vh]">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                Explanation
              </h2>
              {explanation ? (
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-3">
                  <div className="pb-2 border-b border-gray-200 dark:border-[#3e3e42]">
                    <a
                      href={config.links.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-near-primary hover:text-[#00D689] font-medium flex items-center gap-1 w-fit"
                    >
                      Learn More →
                    </a>
                  </div>
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#3e3e42]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUnderstood}
                        onChange={(e) => setIsUnderstood(e.target.checked)}
                        className="w-6 h-6 rounded border-gray-300 dark:border-[#3e3e42] text-near-primary focus:ring-near-primary"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        I have read and understood
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                    Every line of code you generate here is a lesson. Don't just copy — understand,
                    break, rebuild. Master the patterns, own the craft.
                  </p>
                  <p className="mt-4 text-xs font-bold text-near-primary uppercase tracking-wider">
                    Learn by Building. Own the Future.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentPage;
