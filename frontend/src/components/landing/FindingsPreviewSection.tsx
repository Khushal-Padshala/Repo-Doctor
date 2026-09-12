import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileCode2
} from 'lucide-react';

const exampleFindings = [
  {
    id: 'f-1',
    title: 'Hardcoded AWS Secret Access Key in configuration',
    severity: 'CRITICAL',
    severityStyle: 'bg-rose-50 text-rose-700 border-rose-200',
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
    severity: 'CRITICAL',
    severityStyle: 'bg-rose-50 text-rose-700 border-rose-200',
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
    severity: 'MEDIUM',
    severityStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    category: 'CODE QUALITY',
    filePath: 'src/services/api.ts',
    line: 89,
    confidence: '96.2%',
    scoreImpact: '+4 pts',
    description: 'Asynchronous fetchUserData call lacks an explicit try/catch handler, potentially causing Node.js worker crashes.',
    codeSnippet: `- async function fetchUserData(id: string) {
-   const res = await client.get(\`/users/\${id}\`);
-   return res.data;
- }
+ async function fetchUserData(id: string) {
+   try {
+     const res = await client.get(\`/users/\${id}\`);
+     return res.data;
+   } catch (err) {
+     logger.error({ err, id }, 'Failed to fetch user');
+     throw err;
+   }
+ }`,
    quickFix: 'Wrap async network call in try-catch with contextual error logging'
  }
];

export const FindingsPreviewSection: React.FC = () => {
  const [expandedFinding, setExpandedFinding] = useState<string | null>('f-1');

  const toggleExpand = (id: string) => {
    setExpandedFinding(expandedFinding === id ? null : id);
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-12 py-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Actionable Diagnostics
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Diagnostic Findings & Fixes
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Each finding comes with AST verified explanations, exact line numbers, and AI-engineered pull requests.
            </p>
          </div>
        </div>

        {/* Findings List */}
        <div className="mt-10 space-y-4">
          {exampleFindings.map((finding) => {
            const isExpanded = expandedFinding === finding.id;

            return (
              <div
                key={finding.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-blue-300 bg-white shadow-md'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                }`}
              >
                {/* Finding Header Bar */}
                <div
                  onClick={() => toggleExpand(finding.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${finding.severityStyle}`}>
                      {finding.severity}
                    </span>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {finding.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <FileCode2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{finding.filePath}:{finding.line}</span>
                        </span>
                        <span>·</span>
                        <span className="text-slate-600 font-sans">{finding.confidence} confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                      <Sparkles className="h-3 w-3" />
                      <span>{finding.scoreImpact}</span>
                    </span>

                    <button
                      type="button"
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-5">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Vulnerability Summary
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>

                    {/* Diff Viewer Box */}
                    <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs">
                      <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{finding.filePath}</span>
                        <span className="text-emerald-400">AI Suggested Diff</span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed">
                        {finding.codeSnippet.split('\n').map((line, idx) => (
                          <div
                            key={idx}
                            className={
                              line.startsWith('+')
                                ? 'text-emerald-400 font-semibold bg-emerald-950/40 -mx-4 px-4'
                                : line.startsWith('-')
                                ? 'text-rose-400 line-through bg-rose-950/40 -mx-4 px-4'
                                : 'text-slate-300'
                            }
                          >
                            {line}
                          </div>
                        ))}
                      </pre>
                    </div>

                    {/* Recommended Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-slate-800">Recommendation:</span> {finding.quickFix}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                        <span>1-Click Patch Ready</span>
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
