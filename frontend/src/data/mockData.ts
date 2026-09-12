import { RepositoryData, Issue, HealthTimelineEntry, ScanCoverageData } from '../types';

export const calculateGrade = (score: number): { grade: string; desc: string } => {
  if (score >= 95) return { grade: 'A+', desc: 'Pristine Health' };
  if (score >= 90) return { grade: 'A', desc: 'Excellent Health' };
  if (score >= 80) return { grade: 'A-', desc: 'Very Good Condition' };
  if (score >= 70) return { grade: 'B', desc: 'Good with Minor Risks' };
  if (score >= 60) return { grade: 'C+', desc: 'Requires Attention' };
  if (score >= 50) return { grade: 'C', desc: 'Moderate Risk' };
  if (score >= 40) return { grade: 'D', desc: 'High Vulnerability' };
  return { grade: 'F', desc: 'Critical Risk' };
};

export const DEFAULT_HEALTH_HISTORY: HealthTimelineEntry[] = [
  { id: 'h-1', label: 'Initial Scan', score: 64, date: 'May 12', changeDescription: 'Initial baseline scan' },
  { id: 'h-2', label: 'After Security Fixes', score: 72, date: 'May 18', changeDescription: 'Eliminated hardcoded JWT secrets' },
  { id: 'h-3', label: 'After Configuration Fixes', score: 84, date: 'May 25', changeDescription: 'Configured branch rules & .gitignore' },
  { id: 'h-4', label: 'Current', score: 91, date: 'Today', changeDescription: 'Pinned CI/CD action SHAs' }
];

export const DEFAULT_SCAN_COVERAGE: ScanCoverageData = {
  totalChecks: 42,
  categories: [
    { category: 'Security', percentage: 100, status: 'complete' },
    { category: 'Code Quality', percentage: 92, status: 'complete' },
    { category: 'Git Hygiene', percentage: 100, status: 'complete' },
    { category: 'Documentation', percentage: 80, status: 'complete' },
    { category: 'Testing', percentage: 70, status: 'partial', note: 'Not enough test files detected' },
    { category: 'CI/CD', percentage: 100, status: 'complete' }
  ]
};

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISSUE-01',
    title: 'Hardcoded JWT signing secret exposed in configuration',
    severity: 'critical',
    category: 'security',
    affectedFile: 'src/auth/jwt.config.ts',
    lineNumber: 'L24-L31',
    shortExplanation: 'High-entropy JWT private secret key hardcoded into client-accessible configuration file.',
    problem: 'The JWT HMAC secret key "super-secret-production-key-2024!" is hardcoded directly into the application source tree instead of being ingested via secure environment variables or vault secrets.',
    whyItMatters: 'Anyone with read access to the repository or client bundle can forge valid authentication tokens, impersonating administrative users, bypassing role-based authorization, and gaining unrestricted access to all API endpoints.',
    affectedCode: `// src/auth/jwt.config.ts
export const authConfig = {
  algorithm: 'HS256',
  expiresIn: '7d',
  // CRITICAL: Hardcoded cryptographic key in repository
  secretKey: 'super-secret-production-key-2024!',
  issuer: 'api.acme-corp.internal',
  audience: 'acme-web-client'
};`,
    aiDiagnosis: 'Static entropy analysis flagged a 32-character static secret on line 28 of jwt.config.ts. The constant is exported without runtime environment gating, allowing secret leakage across public builds. Automated git log history indicates this token has persisted across 14 commits.',
    recommendedTreatment: 'Extract the private signing key to an environment variable with fallback guard that throws a fatal startup exception if absent. Introduce runtime schema validation with secret masking in logs.',
    beforeCode: `// src/auth/jwt.config.ts
export const authConfig = {
  algorithm: 'HS256',
  expiresIn: '7d',
  secretKey: 'super-secret-production-key-2024!',
  issuer: 'api.acme-corp.internal',
  audience: 'acme-web-client'
};`,
    afterCode: `// src/auth/jwt.config.ts
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SIGNING_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('FATAL: JWT_SIGNING_SECRET must be at least 32 characters long.');
  }
  return secret;
};

export const authConfig = {
  algorithm: 'HS256',
  expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  get secretKey() {
    return getJwtSecret();
  },
  issuer: process.env.JWT_ISSUER || 'api.acme-corp.internal',
  audience: process.env.JWT_AUDIENCE || 'acme-web-client'
};`,
    codeLanguage: 'typescript',
    targetBranch: 'repo-doctor/fix-hardcoded-jwt-secret',
    filesChanged: [
      { filename: 'src/auth/jwt.config.ts', additions: 16, deletions: 6 },
      { filename: '.env.example', additions: 3, deletions: 0 }
    ],
    treatmentExplanation: 'Refactored auth configuration to utilize dynamic getter properties querying process.env. Enforced minimum 32-character entropy validation on startup. Documented JWT_SIGNING_SECRET in .env.example with clear rotation instructions.',
    aiVerificationChecks: [
      { name: 'Secret entropy sanitizer', status: 'passed', detail: 'Zero plain-text secret strings found in commit diff.' },
      { name: 'Regression test suite', status: 'passed', detail: '38 unit & integration auth tests passed without errors.' },
      { name: 'TypeScript compile check', status: 'passed', detail: 'Type check strict mode passed with zero diagnostics.' },
      { name: 'Runtime failure guard', status: 'passed', detail: 'Verified clean exit with diagnostic code when secret is missing.' }
    ],
    scoreImpact: {
      overall: 14,
      security: 32,
      quality: 4,
      hygiene: 0,
      docs: 2,
      cicd: 0
    },
    prTitle: 'fix(security): eliminate hardcoded JWT secret and bind to process.env with startup guard',
    prNumber: 142,
    aiConfidence: 94,
    fixConfidence: 96,
    whyFlagged: [
      'A high-entropy secret-like value was detected',
      'The value appears in an authentication configuration',
      'The file is committed to the repository',
      'The value is directly used instead of an environment variable'
    ],
    prevention: {
      title: 'Prevent hardcoded credentials and token leakage',
      whyItHelps: 'Centralizing all secrets in environment variables or external secret managers ensures secrets never touch version control and can be rotated without redeploying code.',
      actionItems: [
        'Store secrets only in environment variables or a secure secrets manager',
        'Add .env to .gitignore',
        'Keep a .env.example file without real credentials',
        'Enable secret scanning in the repository',
        'Rotate any credential that was previously committed',
        'Add a pre-commit secret detection check'
      ],
      recommendedChecks: [
        { id: 'p-sec-1', label: 'Enable secret scanning in repository', enabled: true },
        { id: 'p-sec-2', label: 'Add pre-commit secret validation', enabled: true },
        { id: 'p-sec-3', label: 'Add CI security checks', enabled: true },
        { id: 'p-sec-4', label: 'Schedule regular repository scans', enabled: false }
      ]
    }
  },
  {
    id: 'ISSUE-02',
    title: 'SQL injection risk via unescaped raw parameter interpolation',
    severity: 'critical',
    category: 'security',
    affectedFile: 'src/services/user.service.ts',
    lineNumber: 'L72-L81',
    shortExplanation: 'User-controlled search query directly concatenated into database raw query string.',
    problem: 'User search parameter is passed directly into a raw template string without parameterized query binding, opening an active SQL injection attack vector.',
    whyItMatters: 'Malicious actors can craft input payloads like "\' OR 1=1 --" to extract entire customer tables, alter database records, or drop schema partitions without authentication.',
    affectedCode: `// src/services/user.service.ts
export async function searchUsers(searchTerm: string, organizationId: string) {
  // CRITICAL: Unescaped string concatenation allows SQL Injection
  const rawQuery = \`
    SELECT id, email, role, created_at 
    FROM users 
    WHERE org_id = '\${organizationId}' AND name LIKE '%\${searchTerm}%'
  \`;
  return await db.query(rawQuery);
}`,
    aiDiagnosis: 'AST taint analysis traced unsanitized HTTP query argument `searchTerm` flowing from Express route handler directly to `db.query(rawQuery)` without ORM parameterized binding or escaping.',
    recommendedTreatment: 'Refactor database query to use parameterized positional variables ($1, $2) supported by the database driver, preventing arbitrary SQL execution.',
    beforeCode: `// src/services/user.service.ts
export async function searchUsers(searchTerm: string, organizationId: string) {
  const rawQuery = \`
    SELECT id, email, role, created_at 
    FROM users 
    WHERE org_id = '\${organizationId}' AND name LIKE '%\${searchTerm}%'
  \`;
  return await db.query(rawQuery);
}`,
    afterCode: `// src/services/user.service.ts
export async function searchUsers(searchTerm: string, organizationId: string) {
  const sanitizedPattern = \`%\${searchTerm.replace(/[%_\\\\]/g, '\\\\$&')}%\`;
  const query = \`
    SELECT id, email, role, created_at 
    FROM users 
    WHERE org_id = $1 AND name ILIKE $2
    ORDER BY created_at DESC
    LIMIT 100
  \`;
  return await db.query(query, [organizationId, sanitizedPattern]);
}`,
    codeLanguage: 'typescript',
    targetBranch: 'repo-doctor/patch-sql-injection-user-search',
    filesChanged: [
      { filename: 'src/services/user.service.ts', additions: 10, deletions: 6 }
    ],
    treatmentExplanation: 'Swapped inline string interpolation for driver-native parameterized query arguments ($1, $2). Added escaping for wildcard search characters (% and _) to prevent denial of service through regex amplification.',
    aiVerificationChecks: [
      { name: 'SQL Injection fuzzer test', status: 'passed', detail: 'Tested 24 SQL injection vectors; all safely treated as string literals.' },
      { name: 'Performance benchmark', status: 'passed', detail: 'Query planner optimization confirmed parameterized cache hit.' },
      { name: 'Unit test suite', status: 'passed', detail: 'All 12 user search test assertions passing.' }
    ],
    scoreImpact: {
      overall: 12,
      security: 28,
      quality: 6,
      hygiene: 0,
      docs: 0,
      cicd: 0
    },
    prTitle: 'fix(security): parameterize searchUsers database query to eliminate SQL injection',
    prNumber: 143,
    aiConfidence: 91,
    fixConfidence: 95,
    whyFlagged: [
      'User-controlled input reaches database query execution',
      'Raw string parameter interpolation detected in SQL template',
      'No parameterized query was found in the relevant code path',
      'AST taint analysis confirmed unsanitized HTTP query string flow'
    ],
    prevention: {
      title: 'Prevent SQL injection and unescaped database queries',
      whyItHelps: 'Parameterized queries and prepared statements ensure the database driver treats user input strictly as literal data rather than executable SQL syntax, making injection attacks impossible.',
      actionItems: [
        'Always use parameterized database queries ($1, $2 or ?)',
        'Avoid constructing SQL with string interpolation or concatenation',
        'Validate and sanitize user input with schema validators (e.g. Zod)',
        'Add automated SQL injection security tests to CI pipelines',
        'Use static analysis to detect unsafe raw query patterns'
      ],
      recommendedChecks: [
        { id: 'p-sqli-1', label: 'Enforce parameterized queries rule in ESLint', enabled: true },
        { id: 'p-sqli-2', label: 'Run SAST query taint analysis in CI', enabled: true },
        { id: 'p-sqli-3', label: 'Add automated SQL fuzzing tests', enabled: false },
        { id: 'p-sqli-4', label: 'Schedule regular repository scans', enabled: false }
      ]
    }
  },
  {
    id: 'ISSUE-03',
    title: 'Unhandled promise rejection in payment webhook dispatcher',
    severity: 'high',
    category: 'quality',
    affectedFile: 'src/webhooks/stripe.handler.ts',
    lineNumber: 'L108-L125',
    shortExplanation: 'Asynchronous event handler lacks catch block, causing Node.js worker crashes on transient network failures.',
    problem: 'The payment event processor dispatches an async database transaction and third-party invoice notification without wrapping them in try/catch or returning a rejected promise handle.',
    whyItMatters: 'Unhandled rejections cause Node.js processes to terminate unexpectedly in production, leaving in-flight HTTP requests hung and causing webhook delivery retries from Stripe that lead to duplicate customer charges.',
    affectedCode: `// src/webhooks/stripe.handler.ts
export const handleInvoicePaid = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;
  
  // WARNING: Async operations without try-catch trigger unhandled rejections
  const subscription = await updateSubscriptionStatus(invoice.subscription as string, 'active');
  await sendSlackBillingAlert(invoice.customer_email, invoice.amount_paid);
  await markInvoiceSettledInLedger(invoice.id);
  
  return { received: true };
};`,
    aiDiagnosis: 'Static call graph detected three asynchronous operations with potential network failure modes inside handleInvoicePaid. No error boundary or transaction rollback mechanism is defined.',
    recommendedTreatment: 'Wrap webhook operations in an idempotent transaction block with defensive error logging, dead-letter queue fallback, and HTTP 500 error reporting so Stripe can safely retry.',
    beforeCode: `// src/webhooks/stripe.handler.ts
export const handleInvoicePaid = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscription = await updateSubscriptionStatus(invoice.subscription as string, 'active');
  await sendSlackBillingAlert(invoice.customer_email, invoice.amount_paid);
  await markInvoiceSettledInLedger(invoice.id);
  return { received: true };
};`,
    afterCode: `// src/webhooks/stripe.handler.ts
import { logger } from '../utils/logger';

export const handleInvoicePaid = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;
  
  try {
    const result = await db.transaction(async (tx) => {
      await updateSubscriptionStatus(invoice.subscription as string, 'active', tx);
      await markInvoiceSettledInLedger(invoice.id, tx);
      return true;
    });

    // Fire non-critical notification outside database transaction
    sendSlackBillingAlert(invoice.customer_email, invoice.amount_paid).catch((err) => {
      logger.warn('Non-blocking Slack alert failed:', { err: err.message });
    });

    return { received: true, processed: result };
  } catch (error) {
    logger.error('Failed processing stripe invoice.paid webhook:', {
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new WebhookProcessingError('Invoice settlement failed. Requesting retry.', error);
  }
};`,
    codeLanguage: 'typescript',
    targetBranch: 'repo-doctor/harden-stripe-webhook-handler',
    filesChanged: [
      { filename: 'src/webhooks/stripe.handler.ts', additions: 22, deletions: 7 }
    ],
    treatmentExplanation: 'Enclosed atomic state updates in an isolated database transaction. Decoupled auxiliary Slack notification with a non-blocking catch handler. Added structured logging and explicit error throwing for webhook retry.',
    aiVerificationChecks: [
      { name: 'Process crash simulation', status: 'passed', detail: 'Worker process remained healthy during simulated DB connection drops.' },
      { name: 'Idempotency validation', status: 'passed', detail: 'Repeated webhook deliveries produce deterministic state.' },
      { name: 'Linter check', status: 'passed', detail: '0 ESLint floating-promises warnings.' }
    ],
    scoreImpact: {
      overall: 8,
      security: 4,
      quality: 18,
      hygiene: 2,
      docs: 0,
      cicd: 0
    },
    prTitle: 'fix(quality): wrap stripe webhook dispatch in atomic transaction with resilient error handling',
    prNumber: 144
  },
  {
    id: 'ISSUE-04',
    title: 'GitHub Action runs with mutable git tags instead of pinned commit SHAs',
    severity: 'high',
    category: 'cicd',
    affectedFile: '.github/workflows/deploy.yml',
    lineNumber: 'L18-L26',
    shortExplanation: 'Third-party GitHub Action referenced by mutable tag @v3 exposing CI/CD to supply-chain tampering.',
    problem: 'Actions like `actions/checkout@v3` and `aws-actions/configure-aws-credentials@v2` use movable git tags that can be maliciously redirected if an upstream maintainer account is compromised.',
    whyItMatters: 'Supply chain attacks (like the Codecov breach) occur when attacker-controlled code is silently pulled into CI runners with access to production deployment keys and cloud secrets.',
    affectedCode: `# .github/workflows/deploy.yml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: \${{ secrets.AWS_DEPLOY_ROLE }}`,
    aiDiagnosis: 'CI security audit identified 3 third-party action invocations without SHA-256 commit hash pinning. OpenSSF Scorecard standard requires pinning all GitHub Actions to full immutable commit hashes.',
    recommendedTreatment: 'Pin all actions to immutable 40-character commit hashes with descriptive trailing version comments for readability.',
    beforeCode: `# .github/workflows/deploy.yml
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2`,
    afterCode: `# .github/workflows/deploy.yml
      - name: Checkout Code
        # Pin to actions/checkout@v4.1.1
        uses: actions/checkout@b4ffde65f46336ab851534716b2320b73689e00f

      - name: Setup Node.js
        # Pin to actions/setup-node@v4.0.2
        uses: actions/setup-node@60edb5dd545a775178f525247059da877284f284
        with:
          node-version: '20'

      - name: Configure AWS Credentials
        # Pin to aws-actions/configure-aws-credentials@v4.0.2
        uses: aws-actions/configure-aws-credentials@e3ddf14a3dc1f892e2fb3ebed9538464c578045f`,
    codeLanguage: 'yaml',
    targetBranch: 'repo-doctor/pin-github-actions-shas',
    filesChanged: [
      { filename: '.github/workflows/deploy.yml', additions: 9, deletions: 3 }
    ],
    treatmentExplanation: 'Replaced tag-based action references with verified immutable 40-character commit hashes. Added inline comments to retain clear semantic version visibility.',
    aiVerificationChecks: [
      { name: 'OpenSSF Scorecard evaluation', status: 'passed', detail: 'Score boosted from 4.8/10 to 8.9/10 in CI security.' },
      { name: 'Workflow syntax validation', status: 'passed', detail: 'Action YAML parsed cleanly with all input schemas validated.' }
    ],
    scoreImpact: {
      overall: 7,
      security: 12,
      quality: 2,
      hygiene: 0,
      docs: 0,
      cicd: 22
    },
    prTitle: 'ci(security): pin third-party GitHub Actions to immutable commit SHAs',
    prNumber: 145,
    isQuickFix: true,
    quickFixLabel: 'Pin Actions to Commit SHA',
    aiConfidence: 95,
    fixConfidence: 96,
    whyFlagged: [
      'Third-party GitHub Action @v3 reference uses a mutable git tag',
      'Workflow runs with elevated CI runner token and deployment secrets',
      'Upstream tag redirection could inject malicious build steps into artifacts',
      'OpenSSF Scorecard requires immutable commit SHA pinning for all external actions'
    ],
    prevention: {
      title: 'Pin third-party GitHub Actions to full commit SHAs',
      whyItHelps: 'Commit SHAs are cryptographically immutable. Even if an upstream author account is compromised, the CI runner executes only the verified code reviewed by your security team.',
      actionItems: [
        'Pin third-party GitHub Actions to full 40-character commit SHAs',
        'Review workflow dependencies regularly with automated linters like actionlint',
        'Enable Dependabot or Renovate alerts for GitHub Actions',
        'Restrict workflow runner permissions using top-level permissions: read-all'
      ],
      recommendedChecks: [
        { id: 'c-pin', label: 'Enforce action SHA pinning in CI', enabled: true },
        { id: 'c-perms', label: 'Restrict workflow runner permissions', enabled: true },
        { id: 'c-dep', label: 'Enable Dependabot version alerts', enabled: true },
        { id: 'c-audit', label: 'Schedule weekly CI workflow security scan', enabled: false }
      ]
    }
  },
  {
    id: 'ISSUE-05',
    title: 'Missing branch protection rules and unsigned commit enforcement',
    severity: 'medium',
    category: 'hygiene',
    affectedFile: '.github/settings.yml',
    lineNumber: 'L12-L30',
    shortExplanation: 'Default branch allows direct force pushes and unreviewed pull request merges.',
    problem: 'The repository allows developers to push commits directly to `main` without required code reviews, linear history, or status check enforcement.',
    whyItMatters: 'Unreviewed bugs or malicious code can bypass CI pipelines and land directly in production without teammate approval or traceability.',
    affectedCode: `# .github/settings.yml
branches:
  - name: main
    protection:
      # CURRENT: Minimal protection allows direct pushes
      required_pull_request_reviews: null
      enforce_admins: false
      required_status_checks: null
      allow_force_pushes: true`,
    aiDiagnosis: 'Git hygiene analysis detected lack of mandatory reviewer gates. Repository permits unverified commits and force-push overrides on the default branch.',
    recommendedTreatment: 'Configure branch protection requiring at least 1 peer review, strict status checks pass, signed commits, and dismissal of stale reviews upon new push.',
    beforeCode: `# .github/settings.yml
branches:
  - name: main
    protection:
      required_pull_request_reviews: null
      enforce_admins: false
      required_status_checks: null
      allow_force_pushes: true`,
    afterCode: `# .github/settings.yml
branches:
  - name: main
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
        require_code_owner_reviews: true
      enforce_admins: true
      required_status_checks:
        strict: true
        contexts:
          - 'ci/test'
          - 'ci/lint'
          - 'security/trivy-scan'
      required_signatures: true
      allow_force_pushes: false
      allow_deletions: false`,
    codeLanguage: 'yaml',
    targetBranch: 'repo-doctor/enforce-branch-protection-rules',
    filesChanged: [
      { filename: '.github/settings.yml', additions: 17, deletions: 4 }
    ],
    treatmentExplanation: 'Established GitHub Probot / Ruleset configuration mandating branch protection, signed GPG commits, status check gates, and disallowed force pushes on main.',
    aiVerificationChecks: [
      { name: 'Branch ruleset schema validator', status: 'passed', detail: 'Syntax matches GitHub Probot settings schema version 2.' },
      { name: 'Admin enforcement verification', status: 'passed', detail: 'Configured to enforce equal compliance across all roles.' }
    ],
    scoreImpact: {
      overall: 6,
      security: 8,
      quality: 4,
      hygiene: 24,
      docs: 0,
      cicd: 6
    },
    prTitle: 'chore(hygiene): mandate peer reviews and strict branch protection on main',
    prNumber: 146
  },
  {
    id: 'ISSUE-06',
    title: 'Lack of API endpoint documentation and OpenAPI / Swagger specification',
    severity: 'medium',
    category: 'docs',
    affectedFile: 'README.md',
    lineNumber: 'L45-L60',
    shortExplanation: 'Public route handlers in /api/v1 have no schema definitions, request types, or curl examples.',
    problem: 'The README and docs folder omit API request/response schemas, error code definitions, and local reproduction commands for external developers.',
    whyItMatters: 'Increases onboarding friction, leads to frontend/backend contract drift, and makes it difficult for consumers to properly integrate without reading raw source code.',
    affectedCode: `<!-- README.md -->
### API Reference
Our server runs on port 8080.
Check routes in src/routes.ts to see endpoints.`,
    aiDiagnosis: 'Documentation coverage scanner found only 18% of exported route handlers possess accompanying JSDoc comments, and no OpenAPI 3.1 contract is declared.',
    recommendedTreatment: 'Add an OpenAPI-compliant swagger documentation block to README.md and generate initial route documentation with request/response payloads.',
    beforeCode: `<!-- README.md -->
### API Reference
Our server runs on port 8080.
Check routes in src/routes.ts to see endpoints.`,
    afterCode: `<!-- README.md -->
### API Reference

Interactive OpenAPI documentation is generated and served at \`/docs\`.

#### Key Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| \`POST\` | \`/api/v1/auth/token\` | Issues HMAC signed bearer token | No |
| \`GET\` | \`/api/v1/users\` | Paginated directory of active members | Bearer |
| \`POST\` | \`/api/v1/webhooks\` | Ingests verified Stripe events | Webhook-Sig |

#### Local Testing
\`\`\`bash
curl -X GET "http://localhost:8080/api/v1/health" \\
     -H "Accept: application/json"
\`\`\``,
    codeLanguage: 'markdown',
    targetBranch: 'repo-doctor/add-api-documentation-spec',
    filesChanged: [
      { filename: 'README.md', additions: 18, deletions: 3 }
    ],
    treatmentExplanation: 'Documented core endpoints with clear HTTP methods, parameter tables, authentication headers, and copyable curl verification examples.',
    aiVerificationChecks: [
      { name: 'Markdown lint check', status: 'passed', detail: 'Passed MD001 to MD045 rules cleanly.' },
      { name: 'Link validator', status: 'passed', detail: 'All relative and anchor paths resolve.' }
    ],
    scoreImpact: {
      overall: 5,
      security: 0,
      quality: 4,
      hygiene: 2,
      docs: 26,
      cicd: 0
    },
    prTitle: 'docs: expand README with comprehensive API endpoint specifications and curl examples',
    prNumber: 147
  },
  {
    id: 'ISSUE-07',
    title: 'Residual console.log statements left in production bundle',
    severity: 'low',
    category: 'quality',
    affectedFile: 'src/analytics/telemetry.ts',
    lineNumber: 'L34-L38',
    shortExplanation: 'Development debugging console logs left in client telemetry pipeline.',
    problem: 'Debug logging statements `console.log("Telemetry payload:", payload)` pollute browser console output and could unintentionally log metadata.',
    whyItMatters: 'Clutters client console logs, leaks internal variable names, and causes tiny performance hits on high-throughput event loops.',
    affectedCode: `// src/analytics/telemetry.ts
export function trackEvent(name: string, payload: Record<string, unknown>) {
  // LOW: Leftover debugging statement
  console.log('[DEBUG-TELEMETRY] Payload emitted:', name, payload);
  sendBeacon('/analytics', { name, payload, ts: Date.now() });
}`,
    aiDiagnosis: 'Found 4 instances of console.log in non-test production modules. ESLint rule `no-console` was disabled with inline ignore comments.',
    recommendedTreatment: 'Replace raw console logging with an environment-aware logger that automatically strips debug statements in production builds.',
    beforeCode: `// src/analytics/telemetry.ts
export function trackEvent(name: string, payload: Record<string, unknown>) {
  console.log('[DEBUG-TELEMETRY] Payload emitted:', name, payload);
  sendBeacon('/analytics', { name, payload, ts: Date.now() });
}`,
    afterCode: `// src/analytics/telemetry.ts
import { logger } from '../utils/logger';

export function trackEvent(name: string, payload: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Telemetry event dispatched', { name, payload });
  }
  sendBeacon('/analytics', { name, payload, ts: Date.now() });
}`,
    codeLanguage: 'typescript',
    targetBranch: 'repo-doctor/clean-production-console-logs',
    filesChanged: [
      { filename: 'src/analytics/telemetry.ts', additions: 7, deletions: 2 }
    ],
    treatmentExplanation: 'Replaced console.log with structured logger guarded by NODE_ENV conditional check to guarantee silent execution in production.',
    aiVerificationChecks: [
      { name: 'Bundle size impact', status: 'passed', detail: '0.2 KB minified size reduction.' },
      { name: 'ESLint compliance', status: 'passed', detail: 'no-console error resolved without disable comments.' }
    ],
    scoreImpact: {
      overall: 3,
      security: 2,
      quality: 10,
      hygiene: 4,
      docs: 0,
      cicd: 0
    },
    prTitle: 'refactor(quality): remove residual console.log statements from telemetry module',
    prNumber: 148
  },
  {
    id: 'ISSUE-08',
    title: 'Missing SPDX license header declaration in core source files',
    severity: 'low',
    category: 'docs',
    affectedFile: 'package.json',
    lineNumber: 'L6-L8',
    shortExplanation: 'Missing standardized SPDX license field in package manifest.',
    problem: 'package.json lacks an explicit "license" key, leaving third-party dependency scanners unable to automate OSS compliance.',
    whyItMatters: 'Enterprise automated compliance scanners (such as FOSSA or Snyk) flag repositories with missing license fields as non-compliant.',
    affectedCode: `{
  "name": "phoenix-engine",
  "version": "1.4.0",
  "private": false
  // MISSING: "license": "Apache-2.0"
}`,
    aiDiagnosis: 'License scanner found LICENSE file present in root (Apache-2.0) but package.json metadata does not mirror this declaration.',
    recommendedTreatment: 'Add `"license": "Apache-2.0"` to package.json to align package metadata with the repository license.',
    beforeCode: `{
  "name": "phoenix-engine",
  "version": "1.4.0",
  "private": false
}`,
    afterCode: `{
  "name": "phoenix-engine",
  "version": "1.4.0",
  "license": "Apache-2.0",
  "private": false
}`,
    codeLanguage: 'json',
    targetBranch: 'repo-doctor/add-spdx-license-meta',
    filesChanged: [
      { filename: 'package.json', additions: 2, deletions: 1 }
    ],
    treatmentExplanation: 'Declared explicit SPDX Apache-2.0 license in package.json to resolve automated supply chain compliance alerts.',
    aiVerificationChecks: [
      { name: 'SPDX identifier check', status: 'passed', detail: 'Apache-2.0 confirmed as valid ISO/IEC 5962 standard string.' },
      { name: 'JSON schema validation', status: 'passed', detail: 'package.json schema validated cleanly.' }
    ],
    scoreImpact: {
      overall: 2,
      security: 0,
      quality: 2,
      hygiene: 2,
      docs: 10,
      cicd: 0
    },
    prTitle: 'chore(license): specify explicit Apache-2.0 SPDX license in package.json',
    prNumber: 149,
    isQuickFix: true,
    quickFixLabel: 'Declare Apache-2.0 License',
    aiConfidence: 98,
    fixConfidence: 99,
    whyFlagged: [
      'Missing standardized "license" field in root package manifest',
      'LICENSE file exists but is not mirrored in package metadata',
      'Automated enterprise dependency scanners flag missing license as non-compliant'
    ],
    prevention: {
      title: 'Automate open source package metadata compliance',
      whyItHelps: 'Clear SPDX identifiers prevent legal ambiguity and enable automated software bill of materials (SBOM) generators to safely ingest packages.',
      actionItems: [
        'Include an explicit SPDX license field in package.json',
        'Verify license compatibility for all external dependencies with license-checker',
        'Add automated license compliance validation to CI'
      ],
      recommendedChecks: [
        { id: 'c-lic-1', label: 'Validate SPDX license in CI', enabled: true },
        { id: 'c-lic-2', label: 'Check transitive dependency licenses', enabled: false }
      ]
    }
  },
  {
    id: 'ISSUE-09',
    title: 'Missing .gitignore file allowing untracked local artifacts into VCS',
    severity: 'medium',
    category: 'hygiene',
    affectedFile: '.gitignore',
    lineNumber: 'Root',
    shortExplanation: 'Repository lacks a root .gitignore file, risking accidental commits of node_modules and local secrets.',
    problem: 'No root .gitignore was detected. Temporary local OS files, build caches (.vite, .next, dist), and local environment configs (.env) are unprotected from being accidentally staged and pushed.',
    whyItMatters: 'Accidentally committing node_modules or local cache files bloats repository size, slows git clones, and dramatically increases the risk of leaking private API keys.',
    affectedCode: `<!-- Repository Root -->
(No .gitignore file detected in repository root)`,
    aiDiagnosis: 'Tree traversal verified absence of a root .gitignore file. Git status analysis detected 4 untracked local build folders and OS metadata files (.DS_Store).',
    recommendedTreatment: 'Generate a comprehensive, standard Node.js/TypeScript .gitignore ignoring dependencies, build artifacts, coverage reports, and environment secrets.',
    beforeCode: `<!-- Repository Root -->
(No .gitignore file present)`,
    afterCode: `# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.*.local

# Debug & Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# OS metadata
.DS_Store
Thumbs.db`,
    codeLanguage: 'bash',
    targetBranch: 'repo-doctor/add-standard-gitignore',
    filesChanged: [
      { filename: '.gitignore', additions: 22, deletions: 0 }
    ],
    treatmentExplanation: 'Created standardized root .gitignore tailored for modern TypeScript projects, blocking build artifacts, logs, and sensitive environment configs.',
    aiVerificationChecks: [
      { name: 'Git pattern compliance', status: 'passed', detail: 'Pattern syntax validated against git-ignore specs.' },
      { name: 'Secret extension coverage', status: 'passed', detail: 'Includes comprehensive wildcards for all .env variations.' }
    ],
    scoreImpact: {
      overall: 3,
      security: 4,
      quality: 2,
      hygiene: 18,
      docs: 0,
      cicd: 0
    },
    prTitle: 'chore(git): add standard .gitignore for Node.js and TypeScript',
    prNumber: 150,
    isQuickFix: true,
    quickFixLabel: 'Generate .gitignore',
    aiConfidence: 97,
    fixConfidence: 99,
    whyFlagged: [
      'No root .gitignore file found in the repository root directory',
      'Local environment files (.env) and node_modules are at risk of being staged',
      'OS metadata files (.DS_Store) have been tracked in recent commits'
    ],
    prevention: {
      title: 'Maintain strict .gitignore templates and pre-commit hooks',
      whyItHelps: 'A comprehensive .gitignore blocks temporary files, binary build outputs, and local credentials before git stages them, keeping the repository clean and leak-free.',
      actionItems: [
        'Use a language-specific .gitignore template',
        'Review staged files before committing with git diff --staged',
        'Add pre-commit checks for sensitive files',
        'Ensure local environment files are ignored'
      ],
      recommendedChecks: [
        { id: 'c-gi-1', label: 'Add pre-commit validation hook', enabled: true },
        { id: 'c-gi-2', label: 'Block committing .env and credential extensions', enabled: true },
        { id: 'c-gi-3', label: 'Automate untracked file linting in CI', enabled: false }
      ]
    }
  },
  {
    id: 'ISSUE-10',
    title: 'Missing .env.example template for secure developer onboarding',
    severity: 'low',
    category: 'quality',
    affectedFile: '.env.example',
    lineNumber: 'Root',
    shortExplanation: 'Application relies on environment variables but provides no documented template file.',
    problem: 'The codebase reads 5 runtime environment variables in auth and database services, but no .env.example is provided in the repository.',
    whyItMatters: 'New contributors have to guess variable names and formats, frequently resulting in misconfigurations, failed local startups, or unsafe hardcoded values.',
    affectedCode: `// References found across codebase:
process.env.PORT
process.env.JWT_SIGNING_SECRET
process.env.DATABASE_URL
process.env.STRIPE_WEBHOOK_SECRET
// Missing .env.example`,
    aiDiagnosis: 'Static scan identified 5 distinct process.env references across 3 services without an accompanying .env.example template in repository root.',
    recommendedTreatment: 'Create a sanitized .env.example template documenting each expected variable, required types, and non-sensitive development placeholder values.',
    beforeCode: `<!-- Repository Root -->
(No .env.example template file found)`,
    afterCode: `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Connection (PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/app_dev

# Authentication (Minimum 32 characters)
JWT_SIGNING_SECRET=your-32-character-jwt-signing-secret-here
JWT_EXPIRES_IN=2h

# Payment Processing
STRIPE_WEBHOOK_SECRET=whsec_test_mock_webhook_secret_for_local_testing`,
    codeLanguage: 'bash',
    targetBranch: 'repo-doctor/add-env-example-template',
    filesChanged: [
      { filename: '.env.example', additions: 14, deletions: 0 }
    ],
    treatmentExplanation: 'Added comprehensive .env.example with commented categories and dummy development placeholders for seamless contributor onboarding.',
    aiVerificationChecks: [
      { name: 'Environment variable audit', status: 'passed', detail: 'All 5 process.env keys documented.' },
      { name: 'Secret safety verification', status: 'passed', detail: 'No production credentials present in template.' }
    ],
    scoreImpact: {
      overall: 2,
      security: 4,
      quality: 8,
      hygiene: 6,
      docs: 8,
      cicd: 0
    },
    prTitle: 'docs(env): provide .env.example template with development placeholders',
    prNumber: 151,
    isQuickFix: true,
    quickFixLabel: 'Create .env.example',
    aiConfidence: 96,
    fixConfidence: 99,
    whyFlagged: [
      'Codebase reads 5 process.env variables without an .env.example template',
      'Developers lack explicit documentation for mandatory environment variables',
      'Increases chance of contributors committing local .env files'
    ],
    prevention: {
      title: 'Maintain a safe environment variable template',
      whyItHelps: 'A documented .env.example defines mandatory application inputs with mock sample values, preventing configuration surprises and guiding developers on safe secrets handling.',
      actionItems: [
        'Store secrets only in environment variables or a secure secrets manager',
        'Add .env to .gitignore',
        'Keep a .env.example file without real credentials',
        'Enable secret scanning in the repository',
        'Rotate any credential that was previously committed',
        'Add a pre-commit secret detection check'
      ],
      recommendedChecks: [
        { id: 'c-env-1', label: 'Enable secret scanning in repository', enabled: true },
        { id: 'c-env-2', label: 'Validate .env against .env.example on build', enabled: true },
        { id: 'c-env-3', label: 'Enforce pre-commit secrets check (gitleaks)', enabled: false }
      ]
    }
  }
];

export const DEFAULT_REPOSITORY: RepositoryData = {
  id: 'repo-1',
  owner: 'acme-corp',
  name: 'phoenix-engine',
  fullName: 'acme-corp/phoenix-engine',
  url: 'https://github.com/acme-corp/phoenix-engine',
  stars: 1240,
  forks: 185,
  branch: 'main',
  defaultBranch: 'main',
  lastScanned: 'Just now',
  commitHash: '8f4c2e1',
  language: 'TypeScript',
  initialScore: 64,
  initialGrade: 'C+',
  scores: {
    overall: 64,
    letterGrade: 'C+',
    gradeDescription: 'Requires Attention',
    security: 48,
    quality: 68,
    hygiene: 72,
    docs: 58,
    cicd: 65
  },
  healthHistory: DEFAULT_HEALTH_HISTORY,
  scanCoverage: DEFAULT_SCAN_COVERAGE,
  issues: MOCK_ISSUES
};

export const PAYMENT_SERVICE_REPOSITORY: RepositoryData = {
  id: 'repo-2',
  owner: 'acme-corp',
  name: 'payment-service',
  fullName: 'acme-corp/payment-service',
  url: 'https://github.com/acme-corp/payment-service',
  stars: 840,
  forks: 92,
  branch: 'main',
  defaultBranch: 'main',
  lastScanned: '2 hours ago',
  commitHash: '3d9f1a2',
  language: 'Node.js',
  initialScore: 71,
  initialGrade: 'B',
  scores: {
    overall: 71,
    letterGrade: 'B',
    gradeDescription: 'Good with Minor Risks',
    security: 62,
    quality: 74,
    hygiene: 78,
    docs: 65,
    cicd: 76
  },
  healthHistory: [
    { id: 'h-p1', label: 'Initial Scan', score: 58, date: '1 month ago' },
    { id: 'h-p2', label: 'After Fixes', score: 67, date: '2 weeks ago' },
    { id: 'h-p3', label: 'Current', score: 71, date: 'Today' }
  ],
  scanCoverage: DEFAULT_SCAN_COVERAGE,
  issues: [
    MOCK_ISSUES[2], // Unhandled promise rejection in payment webhook dispatcher
    MOCK_ISSUES[3], // GitHub Action runs with mutable git tags
    MOCK_ISSUES[4], // Missing branch protection rules
    MOCK_ISSUES[5], // Lack of API endpoint documentation
    MOCK_ISSUES[6], // Residual console.log statements
  ].map(issue => ({ ...issue, isResolved: false }))
};

export const MOBILE_API_REPOSITORY: RepositoryData = {
  id: 'repo-3',
  owner: 'acme-corp',
  name: 'mobile-api',
  fullName: 'acme-corp/mobile-api',
  url: 'https://github.com/acme-corp/mobile-api',
  stars: 490,
  forks: 41,
  branch: 'main',
  defaultBranch: 'main',
  lastScanned: 'Yesterday',
  commitHash: '7c2e9b0',
  language: 'Python',
  initialScore: 58,
  initialGrade: 'C',
  scores: {
    overall: 58,
    letterGrade: 'C',
    gradeDescription: 'Moderate Risk',
    security: 42,
    quality: 60,
    hygiene: 66,
    docs: 52,
    cicd: 70
  },
  healthHistory: [
    { id: 'h-m1', label: 'Initial Scan', score: 52, date: '2 weeks ago' },
    { id: 'h-m2', label: 'Current', score: 58, date: 'Yesterday' }
  ],
  scanCoverage: DEFAULT_SCAN_COVERAGE,
  issues: [
    MOCK_ISSUES[0], // Hardcoded JWT signing secret
    MOCK_ISSUES[1], // SQL injection risk
    MOCK_ISSUES[4], // Missing branch protection rules
    MOCK_ISSUES[5], // Lack of API endpoint documentation
    MOCK_ISSUES[7], // Missing SPDX license header
  ].map(issue => ({ ...issue, isResolved: false }))
};

export interface RepoSelectionItem {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  defaultBranch: string;
  lastScanned: string;
  description: string;
  overallScore?: number;
  letterGrade?: string;
  activeIssuesCount: number;
}

export const ACME_REPOSITORIES: RepoSelectionItem[] = [
  {
    id: 'repo-1',
    name: 'phoenix-engine',
    owner: 'acme-corp',
    fullName: 'acme-corp/phoenix-engine',
    url: 'https://github.com/acme-corp/phoenix-engine',
    language: 'TypeScript',
    stars: 1240,
    forks: 185,
    defaultBranch: 'main',
    lastScanned: 'Scanned 12m ago',
    description: 'Core event-driven simulation engine & distributed telemetry pipeline.',
    overallScore: 64,
    letterGrade: 'C+',
    activeIssuesCount: 8
  },
  {
    id: 'repo-2',
    name: 'payment-service',
    owner: 'acme-corp',
    fullName: 'acme-corp/payment-service',
    url: 'https://github.com/acme-corp/payment-service',
    language: 'Node.js',
    stars: 840,
    forks: 92,
    defaultBranch: 'main',
    lastScanned: 'Scanned 2h ago',
    description: 'PCI-compliant recurring billing dispatch, invoice settlements & webhooks.',
    overallScore: 71,
    letterGrade: 'B',
    activeIssuesCount: 5
  },
  {
    id: 'repo-3',
    name: 'mobile-api',
    owner: 'acme-corp',
    fullName: 'acme-corp/mobile-api',
    url: 'https://github.com/acme-corp/mobile-api',
    language: 'Python',
    stars: 490,
    forks: 41,
    defaultBranch: 'main',
    lastScanned: 'Scanned yesterday',
    description: 'FastAPI gateway service powering iOS & Android client subscriptions.',
    overallScore: 58,
    letterGrade: 'C',
    activeIssuesCount: 5
  }
];

export const SAMPLE_REPOSITORIES: { name: string; url: string; stars: string; language: string; score: number }[] = [
  { name: 'acme-corp/phoenix-engine', url: 'https://github.com/acme-corp/phoenix-engine', stars: '1.2k', language: 'TypeScript', score: 64 },
  { name: 'acme-corp/payment-service', url: 'https://github.com/acme-corp/payment-service', stars: '840', language: 'Node.js', score: 71 },
  { name: 'acme-corp/mobile-api', url: 'https://github.com/acme-corp/mobile-api', stars: '490', language: 'Python', score: 58 },
  { name: 'facebook/react', url: 'https://github.com/facebook/react', stars: '228k', language: 'JavaScript', score: 92 },
  { name: 'vercel/next.js', url: 'https://github.com/vercel/next.js', stars: '124k', language: 'TypeScript', score: 88 }
];

export function generateRepoFromUrl(inputUrl: string): RepositoryData {
  let cleaned = inputUrl.trim().replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
  cleaned = cleaned.split('?')[0].split('#')[0].replace(/\.git$/, '');
  
  let owner = 'user';
  let name = 'repository';
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/').filter(Boolean);
    if (parts.length >= 2) {
      owner = parts[0];
      name = parts[1];
    }
  } else if (cleaned) {
    name = cleaned;
  }

  // Create a randomized realistic score profile for any repo based on its characters
  const hash = (owner + name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseScore = 55 + (hash % 35); // 55 to 90
  const gradeInfo = calculateGrade(baseScore);

  return {
    id: `repo-${owner}-${name}-${Date.now()}`,
    owner,
    name,
    fullName: `${owner}/${name}`,
    branch: 'main',
    defaultBranch: 'main',
    url: inputUrl.startsWith('http') ? inputUrl : `https://github.com/${owner}/${name}`,
    stars: 120 + (hash % 3500),
    forks: 24 + (hash % 400),
    lastScanned: 'Just now',
    commitHash: Math.random().toString(16).substring(2, 9),
    language: ['TypeScript', 'Node.js', 'Python', 'Go', 'Rust'][hash % 5],
    scores: {
      overall: baseScore,
      letterGrade: gradeInfo.grade,
      gradeDescription: gradeInfo.desc,
      security: Math.min(100, Math.max(35, baseScore - 12 + (hash % 20))),
      quality: Math.min(100, Math.max(40, baseScore + 4 - (hash % 15))),
      hygiene: Math.min(100, Math.max(50, baseScore + 8 - (hash % 10))),
      docs: Math.min(100, Math.max(30, baseScore - 6 + (hash % 22))),
      cicd: Math.min(100, Math.max(45, baseScore + 2 - (hash % 18)))
    },
    issues: MOCK_ISSUES.map((issue, idx) => ({
      ...issue,
      id: `ISSUE-0${idx + 1}`,
      targetBranch: `repo-doctor/remediation-patch-${idx + 1}`,
      isResolved: false
    })),
    healthHistory: DEFAULT_HEALTH_HISTORY,
    scanCoverage: DEFAULT_SCAN_COVERAGE
  };
}
