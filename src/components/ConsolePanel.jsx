import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink, DollarSign, Zap, Eye } from 'lucide-react';
import { config } from '../config';
import {
  fetchNearPrice,
  calculateDeploymentCost,
  formatNear,
  formatUsd,
  getGasInfo,
} from '../lib/nearCosts';

function ConsolePanel({ consoleOutput, deployedContractId, deploymentTxHash, wasmSize }) {
  const [nearPrice, setNearPrice] = useState(null);
  const [deploymentCost, setDeploymentCost] = useState(null);

  useEffect(() => {
    fetchNearPrice().then(setNearPrice);
  }, []);

  useEffect(() => {
    if (wasmSize && nearPrice) {
      const cost = calculateDeploymentCost(wasmSize);
      setDeploymentCost({ near: cost, usd: cost * nearPrice });
    }
  }, [wasmSize, nearPrice]);

  const gasInfo = getGasInfo();

  const renderConsoleOutput = () => {
    if (!consoleOutput) {
      return 'Console output will appear here when you run or deploy...';
    }

    const lines = consoleOutput.split('\n');
    return lines.map((line, idx) => {
      try {
        // Try to parse JSON-formatted styled text
        const parsed = JSON.parse(line);
        if (parsed.text && parsed.color) {
          let colorClass = '';
          if (parsed.color === 'red') colorClass = 'text-red-500';
          else if (parsed.color === 'green') colorClass = 'text-green-500';
          const boldClass = parsed.bold ? 'font-bold' : '';
          return (
            <div key={idx} className={`${colorClass} ${boldClass}`}>
              {parsed.text}
            </div>
          );
        }
      } catch {
        // Not JSON, render as plain text
      }
      return <div key={idx}>{line}</div>;
    });
  };

  return (
    <div className="tour-console bg-white dark:bg-[#111216] rounded-xl border border-gray-200 dark:border-[#3e3e42] flex flex-col gap-4">
      {/* Console Output */}
      <div className="border-b border-gray-200 dark:border-[#3e3e42] pb-3 px-4 pt-4">
        <h3 className="text-sm font-semibold text-white mb-2">Console Output</h3>
        <div className="bg-gray-100 dark:bg-[#0a0c10] rounded-lg p-3 text-[0.7rem] font-mono text-gray-800 dark:text-gray-100 max-h-60 overflow-auto whitespace-pre-wrap border border-gray-200 dark:border-[#3e3e42]">
          {renderConsoleOutput()}
        </div>
      </div>

      {/* Cost Information */}
      <div className="px-4 pb-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Cost Information
        </h3>

        {/* NEAR Price */}
        <div className="text-xs bg-gray-50 dark:bg-[#1a1b1f] rounded-lg p-3 border border-gray-200 dark:border-[#3e3e42]">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">NEAR Price (RealTime) </span>
            <span className="text-green-400 font-semibold">
              {nearPrice ? `$${formatUsd(nearPrice)}` : 'Loading...'}
            </span>
          </div>
        </div>

        {/* Deployment Cost */}
        <div className="text-xs bg-gray-50 dark:bg-[#1a1b1f] rounded-lg p-3 border border-gray-200 dark:border-[#3e3e42] space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="h-3 w-3" />
            <span>Deployment Cost</span>
          </div>
          {deploymentCost ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{formatNear(deploymentCost.near)} NEAR</span>
              <span className="text-amber-400">≈ ${formatUsd(deploymentCost.usd)}</span>
            </div>
          ) : (
            <div className="text-gray-500 italic">Deploy a contract to see estimated cost</div>
          )}
        </div>

        
      </div>

      {/* Deployment Section */}
      <div className="px-4 pb-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Deployment</h3>
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
                <span className="font-mono text-[0.7rem] text-gray-100">{deployedContractId}</span>
              </p>
              {deploymentTxHash && (
                <p>
                  Tx Hash:{' '}
                  <span className="font-mono text-[0.7rem] text-gray-100">{deploymentTxHash}</span>
                </p>
              )}
              <a
                href={`${config.links.explorer}/accounts/${deployedContractId}`}
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
  );
}

ConsolePanel.propTypes = {
  consoleOutput: PropTypes.string,
  deployedContractId: PropTypes.string,
  deploymentTxHash: PropTypes.string,
  wasmSize: PropTypes.number,
};

export default ConsolePanel;
