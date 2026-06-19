import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MoveDiagonal, ExternalLink } from 'lucide-react';
import { isAuditedExample } from '../data/examples';
import {
  getBasicsDetailedExplanation,
  isBasicsExample,
  getDetailedExplanation,
} from '../data/basicsExplanations';
import { getAdvancedDetailedExplanation, isAdvancedExample } from '../data/advancedExplanations';
import { getCollectionsDetailedExplanation, isCollectionsExample } from '../data/collectionsDataExplanations';
import { getNftsDetailedExplanation, isNftsExample } from '../data/nftsExplanations';
import { getCrossContractDetailedExplanation, isCrossContractExample } from '../data/crossContractExplanations';
import { getChainSignaturesDetailedExplanation, isChainSignaturesExample } from '../data/chainSignaturesExplanations';
import { getIndexingDetailedExplanation, isIndexingExample } from '../data/indexingExplanations';
import { getAdvancedPatternsDetailedExplanation, isAdvancedPatternsExample } from '../data/advancedPatternsExplanations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const LEARNING_PATH_INTRO_MD = `**Recommended path (do this first)**

Hello World → Contract Structure → View Methods → Change Methods → State Management → Input Validation → Error Handling → Events → Collections → Security → Cross-Contract → NFTs / Chain Signatures.

*Each step builds on the previous. Use the sidebar to open the next example. The editor on the left shows this path; switch to any example to see and run code.*
`;

const NEAR_DOCS_LINKS = {
  'hello-world': 'https://docs.near.org/build/smart-contracts/anatomy/anatomy',
  'contract-structure': 'https://docs.near.org/build/smart-contracts/anatomy/anatomy',
  'view-methods': 'https://docs.near.org/smart-contracts/quickstart#view-methods',
  'change-methods': 'https://docs.near.org/build/smart-contracts/quickstart',
  'state-management': 'https://docs.near.org/build/smart-contracts/anatomy/state',
  'input-validation': 'https://docs.near.org/build/smart-contracts/best-practices/validation',
  'error-handling': 'https://docs.near.org/build/smart-contracts/best-practices/validation',
  'collections-vector': 'https://docs.near.org/build/smart-contracts/anatomy/collections#vector',
  'collections-map': 'https://docs.near.org/build/smart-contracts/anatomy/collections',
  events: 'https://docs.near.org/build/smart-contracts/best-practices/events',
  'owner-pattern': 'https://docs.near.org/build/smart-contracts/best-practices/access-control',
  'role-based-access': 'https://docs.near.org/build/smart-contracts/best-practices/access-control',
  'pausable-contract': 'https://docs.near.org/build/smart-contracts/best-practices/pause',
  'multi-signature': 'https://docs.near.org/build/smart-contracts/best-practices/multisig',
  'upgrade-pattern': 'https://docs.near.org/build/smart-contracts/anatomy/upgrade',
};

const markdownComponents = {
  p: ({ children }) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2 last:mb-0">{children}</p>
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
    <strong className="font-semibold text-near-primary dark:text-near-primary">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-600 dark:text-gray-400">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <code className="block bg-gray-200 dark:bg-[#1a1b1f] px-2 py-1.5 rounded text-sm overflow-x-auto mb-2">
        {children}
      </code>
    ) : (
      <code className="bg-gray-200 dark:bg-[#1a1b1f] px-1.5 py-0.5 rounded text-sm break-all">
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
    <h1 className="text-base font-bold text-gray-900 dark:text-white mb-2 mt-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2 mt-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 mt-2">{children}</h3>
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
  thead: ({ children }) => <thead className="bg-gray-100 dark:bg-[#1a1b1f]">{children}</thead>,
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-[#3e3e42]">{children}</tbody>
  ),
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
  const isAudited = isAuditedExample(example.id);
  const detailedSections = useMemo(() => {
    if (isBasicsExample(example.id)) {
      return getDetailedExplanation(example.id);
    }
    if (isAdvancedExample(example.id)) {
      return getAdvancedDetailedExplanation(example.id);
    }
    if (isCollectionsExample(example.id)) {
      return getCollectionsDetailedExplanation(example.id);
    }
    if (isNftsExample(example.id)) {
      return getNftsDetailedExplanation(example.id);
    }
    if (isCrossContractExample(example.id)) {
      return getCrossContractDetailedExplanation(example.id);
    }
    if (isChainSignaturesExample(example.id)) {
      return getChainSignaturesDetailedExplanation(example.id);
    }
    if (isIndexingExample(example.id)) {
      return getIndexingDetailedExplanation(example.id);
    }
    if (isAdvancedPatternsExample(example.id)) {
      return getAdvancedPatternsDetailedExplanation(example.id);
    }
    return null;
  }, [example.id]);
  const hasDetailedExplanation = detailedSections && detailedSections.length > 0;
  const firstSection = hasDetailedExplanation ? detailedSections[0] : null;
  const hasMoreSections = hasDetailedExplanation && detailedSections.length > 1;
  const auditLabel = isAudited ? 'Audited' : 'Experimental';
  const auditColor = isAudited
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-amber-600 dark:text-amber-400';

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-[#0d0f14] rounded-lg p-2 h-[400px] overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
    {example.name}
  </h2>
  {hasMoreSections && (
    <button
      type="button"
      onClick={() => setDetailedModalOpen(true)}
      className="text-md font-medium text-near-primary hover:text-near-primary/80 cursor-pointer transition-colors shrink-0"
      title="Learn more with deep dive"
    >
      Learn More →
    </button>
  )}
</div>

      <div className="relative prose prose-sm max-w-none">
        
        {firstSection ? (
          <ReactMarkdown components={markdownComponents}>{firstSection.content}</ReactMarkdown>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No explanation available yet.</p>
        )}
        
      </div>

      {/* Hints modal */}
      {hasDetailedExplanation && (
        <Dialog open={detailedModalOpen} onOpenChange={setDetailedModalOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 border-gray-200 dark:border-[#3e3e42]">
            <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-200 dark:border-[#3e3e42]">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {example.name} — Hints
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {detailedSections
                .filter((section) => section.title === 'Hints')
                .map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-[#3e3e42]">
                      {section.title}
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300">
                      <ReactMarkdown components={markdownComponents}>
                        {section.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ExplanationTab;
