import React, { useMemo } from "react";
import { getContractExplanation } from "../data/contractExplanations";

function ExplanationTab({ example }) {
  const displayedText = useMemo(
    () => getContractExplanation(example.id) ?? "",
    [example.id]
  );

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-[#0d0f14] rounded-lg p-2 h-[400px] overflow-y-auto">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {example.name}
        </h2>
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Contract Explanation
        </p>
      </div>
      <div className="relative">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {displayedText}
        </p>
      </div>
    </div>
  );
}

export default ExplanationTab;
