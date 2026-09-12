import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Workflow
} from 'lucide-react';

const exampleFindings = [
  {
    id: 'f-1',
    title: 'Hardcoded AWS Secret Access Key in configuration',
    severity: 'CRITICAL RISK',
    category: 'SECURITY',
    filePath: 'src/config/aws.ts',
    line: 14,
    confidence: '99.4%',
    scoreImpact: '+8 pts',
    description: 'Plaintext cloud provider secret key detected in source tree. May lead to compromised AWS identity and unauthorized cloud access.',
    codeSnippet: `- const AWS_SECRET_KEY = "AKIAIOSFODNN7EXAMPLE";
+ const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;`,
    quickFix: 'Move secret key to environment variable and add .env to .gitignore'
  },
  {
    id: 'f-2',
    title: 'SQL injection risk via raw string interpolation',
    severity: 'CRITICAL RISK',
    category: 'SECURITY',
    filePath: 'src/db/queries.ts',
    line: 42,
    confidence: '98.7%',
    scoreImpact: '+6 pts',
    description: 'Raw SQL query string constructed via string concatenation with untrusted parameter input instead of parameterized binding.',
    codeSnippet: `- const query = \`SELECT * FROM users WHERE email = '\${userEmail}'\`;
+ const query = { text: 'SELECT * FROM users WHERE email = $1', values: [userEmail] };`,
    quickFix: 'Use parameterized query with parameterized placeholder syntax'
  },
  {
    id: 'f-3',
    title: 'Unhandled promise rejection in asynchronous handler',
    severity: 'REQUIRES ATTENTION',
    category: 'CODE QUALITY',
    filePath: 'src/services/api.ts',
    line: 89,
    confidence: '96.2%',
    scoreImpact: '+4 pts',
    description: 'Asynchronous fetchUserData call lacks an explicit try/catch handler or .catch() handler, potentially causing Node.js worker crashes.',
    codeSnippet: `- async function fetchUserData(id: string) {
-   const res = await client.get(\`/users/\${id}\`);
-   return res.data;
- }
+ async function fetchUserData(id: string) {
+   try {
+     const res = await client.get(\`/users/\${id}\`);
+     return res.data;
+   } catch (err) {
+     logger.error({ id, err }, 'Failed to fetch user');
+     throw new AppError('User retrieval failure', { cause: err });
+   }
+ }`,
    quickFix: 'Wrap async execution with try/catch and structured logging'
  },
  {
    id: 'f-4',
    title: 'Mutable GitHub Action tag unpinned to commit SHA',
    severity: 'REQUIRES ATTENTION',
    category: 'CI/CD',
    filePath: '.github/workflows/ci.yml',
    line: 18,
    confidence: '99.1%',
    scoreImpact: '+4 pts',
    description: 'Workflow step uses mutable reference actions/checkout@v4 instead of an immutable 40-character commit hash, introducing supply-chain risks.',
    codeSnippet: `- uses: actions/checkout@v4
+ uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`,
    quickFix: 'Pin GitHub Action to immutable SHA-256 hash with release comment'
  }
];

export const FindingsPreviewSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('f-1');

  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-[#5E3A5C]/60">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl pb-10 border-b border-[#5E3A5C]/60">
          <div className="font-urbanist text-xs font-semibold uppercase tracking-widest text-[#B47A9A] mb-2">
            Automated Diagnosis
          </div>
          <h2 className="font-urbanist text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3E9EC] uppercase leading-tight">
            DEEP REPOSITORY FINDINGS
          </h2>
          <p className="mt-3 font-urbanist text-sm sm:text-base text-[#F3E9EC]/70 font-normal leading-relaxed">
            Every finding provides exact AST line pointers, severity grading, AI confidence ratings, and score recovery projections.
          </p>
        </div>

        {/* Finding Cards List */}
        <div className="mt-10 space-y-4">
          {exampleFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;
            const isCritical = finding.severity === 'CRITICAL RISK';

            return (
              <div
                key={finding.id}
                className="rounded-3xl border border-[#5E3A5C] bg-[#0B0E1A] p-6 sm:p-7 transition-all duration-200 hover:border-[#B47A9A]"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Severity Badge in Urbanist */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-urbanist text-xs font-bold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-[#8A334E]/20 border border-[#8A334E]/50 text-[#F3E9EC]'
                          : 'bg-[#5E3A5C]/30 border border-[#5E3A5C] text-[#B47A9A]'
                      }`}
                    >
                      {isCritical ? (
                        <ShieldAlert className="h-3.5 w-3.5 text-[#8A334E]" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-[#B47A9A]" />
                      )}
                      <span>{finding.severity}</span>
                    </span>

                    {/* Category */}
                    <span className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-3 py-1 font-urbanist text-xs font-semibold uppercase tracking-wider text-[#F3E9EC]">
                      {finding.category}
                    </span>

                    {/* Impact Badge */}
                    <span className="rounded-full border border-[#5E3A5C] bg-[#2C1B2F] px-3 py-1 font-urbanist text-xs font-bold uppercase tracking-wider text-[#B47A9A]">
                      Impact {finding.scoreImpact}
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="flex items-center gap-2 font-urbanist text-xs text-[#F3E9EC]/70">
                    <Sparkles className="h-3.5 w-3.5 text-[#B47A9A]" />
                    <span>AI CONFIDENCE:</span>
                    <span className="font-bold text-[#F3E9EC]">{finding.confidence}</span>
                  </div>
                </div>

                {/* Finding Title */}
                <div className="mt-4">
                  <h3 className="font-urbanist text-lg sm:text-xl font-bold text-[#F3E9EC] tracking-tight">
                    {finding.title}
                  </h3>
                  <p className="mt-1.5 font-urbanist text-sm text-[#F3E9EC]/70 leading-relaxed">
                    {finding.description}
                  </p>
                </div>

                {/* File Location Monospace */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#5E3A5C]/40">
                  <div className="flex items-center gap-2 text-xs text-[#F3E9EC]/70 font-mono">
                    <FileCode2 className="h-4 w-4 text-[#B47A9A]" />
                    <span>{finding.filePath}</span>
                    <span className="text-[#5E3A5C]">:</span>
                    <span className="text-[#B47A9A] font-semibold">{finding.line}</span>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                    className="inline-flex items-center gap-1.5 font-urbanist text-xs font-semibold text-[#F3E9EC]/80 hover:text-[#F3E9EC] transition"
                  >
                    <span>{isExpanded ? 'Hide AST Code Diff' : 'View AST Code Diff'}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-[#B47A9A]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#B47A9A]" />
                    )}
                  </button>
                </div>

                {/* Expanded Code Diff Box */}
                {isExpanded && (
                  <div className="mt-5 rounded-2xl border border-[#5E3A5C] bg-[#00030E] p-4 sm:p-5">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#5E3A5C]/40">
                      <span className="font-urbanist text-xs font-semibold uppercase tracking-wider text-[#F3E9EC]/70">
                        Syntactic Diff Preview
                      </span>
                      <span className="font-urbanist text-xs font-semibold text-[#B47A9A]">
                        Ready for automated pull request
                      </span>
                    </div>
                    <pre className="font-mono text-xs text-[#F3E9EC] overflow-x-auto leading-relaxed whitespace-pre p-2">
                      {finding.codeSnippet}
                    </pre>
                    <div className="mt-3 pt-3 border-t border-[#5E3A5C]/40 flex items-center justify-between">
                      <span className="font-urbanist text-xs text-[#F3E9EC]/70">
                        Recommended remediation: <span className="text-[#F3E9EC] font-medium">{finding.quickFix}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
