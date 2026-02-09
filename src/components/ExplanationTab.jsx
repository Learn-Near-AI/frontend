import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MoveDiagonal } from "lucide-react";
import { getContractExplanation } from "../data/contractExplanations";
import { isAuditedExample } from "../data/examples";
import { isGuidedExample, putItToTheTest } from "../data/guidedExercises";
import { getBasicsDetailedExplanation, isBasicsExample } from "../data/basicsDetailedExplanations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const LEARNING_PATH_INTRO_MD = `**Recommended path (do this first)**

Hello World → Contract Structure → View Methods → Change Methods → State Management → Input Validation → Error Handling → Events → Collections → Security → Cross-Contract → NFTs / Chain Signatures.

*Each step builds on the previous. Use the sidebar to open the next example. The editor on the left shows this path; switch to any example to see and run code.*
`;

const markdownComponents = {
  p: ({ children }) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2 space-y-1 text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="ml-2">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-near-primary dark:text-near-primary">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <code className="block bg-gray-200 dark:bg-[#1a1b1f] px-2 py-1.5 rounded text-sm overflow-x-auto mb-2">
        {children}
      </code>
    ) : (
      <code className="bg-gray-200 dark:bg-[#1a1b1f] px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-200 dark:bg-[#1a1b1f] p-2 rounded text-sm overflow-x-auto mb-2">
      {children}
    </pre>
  ),
  h1: ({ children }) => (
    <h1 className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2 mt-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 mt-2">
      {children}
    </h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-near-primary/50 dark:border-near-primary/50 pl-3 italic text-gray-600 dark:text-gray-400 mb-2">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-near-primary dark:text-near-primary hover:underline"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border border-gray-200 dark:border-[#3e3e42] rounded text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-100 dark:bg-[#1a1b1f]">{children}</thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-gray-200 dark:divide-[#3e3e42]">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#3e3e42]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-[#2a2b30]">
      {children}
    </td>
  ),
};

function ExplanationTab({ example }) {
  const [detailedModalOpen, setDetailedModalOpen] = useState(false);
  const displayedText = useMemo(
    () => getContractExplanation(example.id) ?? "",
    [example.id]
  );
  const isIntro = example.id === "intro";
  const isGuided = isGuidedExample(example.id);
  const putItToTheTestMd = putItToTheTest[example.id];
  const isAudited = isAuditedExample(example.id);
  const isBasics = isBasicsExample(example.id);
  const detailedSections = useMemo(
    () => getBasicsDetailedExplanation(example.id),
    [example.id]
  );
  const auditLabel = isAudited ? "Audited" : "Experimental";
  const auditColor = isAudited ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";

  const markdownContent = isIntro
    ? `${LEARNING_PATH_INTRO_MD}\n\n---\n\n${displayedText}`
    : isGuided && putItToTheTestMd
      ? `${displayedText}\n\n---\n\n${putItToTheTestMd}`
      : displayedText;

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-[#0d0f14] rounded-lg p-2 h-[400px] overflow-y-auto">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {example.name}
          </h2>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {isIntro ? "Learning path" : "Contract Explanation"}{" "}
            <span className={`normal-case font-medium ${auditColor}`}>
              {!isIntro && `(${auditLabel})`}
            </span>
          </p>
        </div>
        {isBasics && detailedSections && detailedSections.length > 0 && (
          <button
            type="button"
            onClick={() => setDetailedModalOpen(true)}
            className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-[#3e3e42] bg-white dark:bg-[#1a1b1f] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#25262b] transition-colors"
            title="Open full explanation with line-by-line details"
          >
            <MoveDiagonal className="h-5 w-5" />
            
          </button>
        )}
      </div>
      <div className="relative prose prose-sm max-w-none">
        <ReactMarkdown components={markdownComponents}>
          {markdownContent}
        </ReactMarkdown>
      </div>

      {/* Detailed explanation modal (Basics only) */}
      {isBasics && detailedSections && (
        <Dialog open={detailedModalOpen} onOpenChange={setDetailedModalOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 border-gray-200 dark:border-[#3e3e42]">
            <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-200 dark:border-[#3e3e42]">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {example.name} — Detailed explanation
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {detailedSections.map((section, idx) => (
                <details
                  key={idx}
                  className="group rounded-lg border border-gray-200 dark:border-[#3e3e42] bg-gray-50/50 dark:bg-[#0d0f14]/50"
                  open={idx === 0}
                >
                  <summary className="list-none cursor-pointer px-4 py-3 font-semibold text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1a1b1f] rounded-t-lg flex items-center justify-between">
                    <span>{section.title}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 pt-1 text-gray-700 dark:text-gray-300">
                    <ReactMarkdown components={markdownComponents}>
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </details>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ExplanationTab;
