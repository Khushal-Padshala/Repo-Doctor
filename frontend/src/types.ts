export type ScreenType = 'landing' | 'sign-in' | 'repositories' | 'dashboard' | 'issue-details' | 'treatment' | 'success';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  provider: 'github' | 'google';
  organization?: string;
}

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IssueCategory = 'security' | 'quality' | 'hygiene' | 'docs' | 'cicd';

export interface PreventiveCheck {
  id: string;
  label: string;
  enabled: boolean;
}

export interface PreventionRecommendation {
  title: string;
  whyItHelps: string;
  actionItems: string[];
  recommendedChecks: PreventiveCheck[];
}

export interface Issue {
  id: string;
  title: string;
  severity: IssueSeverity;
  category: IssueCategory;
  affectedFile: string;
  lineNumber: string;
  shortExplanation: string;
  problem: string;
  whyItMatters: string;
  affectedCode: string;
  aiDiagnosis: string;
  recommendedTreatment: string;
  beforeCode: string;
  afterCode: string;
  codeLanguage: string;
  // Treatment details
  targetBranch: string;
  filesChanged: {
    filename: string;
    additions: number;
    deletions: number;
  }[];
  treatmentExplanation: string;
  aiVerificationChecks: {
    name: string;
    status: 'passed' | 'warning' | 'skipped';
    detail: string;
  }[];
  // Score improvements when resolved
  scoreImpact: {
    overall: number;
    security: number;
    quality: number;
    hygiene: number;
    docs: number;
    cicd: number;
  };
  prTitle: string;
  prNumber?: number;
  isResolved?: boolean;
  // AI analysis and quick fix metadata
  aiConfidence?: number;
  fixConfidence?: number;
  whyFlagged?: string[];
  isQuickFix?: boolean;
  quickFixLabel?: string;
  prevention?: PreventionRecommendation;
}

export interface HealthScores {
  overall: number;
  letterGrade: string;
  gradeDescription: string;
  security: number;
  quality: number;
  hygiene: number;
  docs: number;
  cicd: number;
}

export interface HealthTimelineEntry {
  id: string;
  label: string;
  score: number;
  date: string;
  changeDescription?: string;
}

export interface ScanCoverageItem {
  category: string;
  percentage: number;
  status: 'complete' | 'partial' | 'unavailable';
  note?: string;
}

export interface ScanCoverageData {
  totalChecks: number;
  categories: ScanCoverageItem[];
}

export interface ImprovementComparison {
  beforeScore: number;
  beforeGrade: string;
  beforeActiveIssues: number;
  beforeBreakdown: { critical: number; high: number; medium: number; low: number };
  afterScore: number;
  afterGrade: string;
  afterActiveIssues: number;
  afterBreakdown: { critical: number; high: number; medium: number; low: number };
  resolvedCount: number;
  pointsGained: number;
  recentFixedTitle?: string;
}

export interface RepositoryData {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  branch: string;
  defaultBranch: string;
  lastScanned: string;
  commitHash: string;
  language: string;
  scores: HealthScores;
  issues: Issue[];
  healthHistory?: HealthTimelineEntry[];
  scanCoverage?: ScanCoverageData;
  initialScore?: number;
  initialGrade?: string;
}

export interface BackendRepoResponse {
  owner: string;
  name: string;
  full_name: string;
  branch: string;
  language: string;
  health_score: number;
  grade: string;
  findings?: Issue[];
  scan_coverage?: ScanCoverageData;
  health_history?: HealthTimelineEntry[];
}

export interface PullRequestDetails {
  prNumber: number;
  title: string;
  branchName: string;
  baseBranch: string;
  author: string;
  createdAt: string;
  scoreBefore: number;
  gradeBefore: string;
  scoreAfter: number;
  gradeAfter: string;
  issue: Issue;
  status: 'open' | 'merged';
}
