import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  RepositoryData,
  Issue,
  PullRequestDetails,
  UserProfile,
  ImprovementComparison
} from './types';
import {
  calculateGrade
} from './data/mockData';
import { createRepositoryFromInput, fetchRealRepositoryAnalysis } from './services/repositoryService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SignInPage } from './components/SignInPage';
import { RepositorySelectionPage } from './components/RepositorySelectionPage';
import { CheckupScanner } from './components/CheckupScanner';
import { Dashboard } from './components/Dashboard';
import { IssueDetails } from './components/IssueDetails';
import { TreatmentPage } from './components/TreatmentPage';
import { SuccessState } from './components/SuccessState';
import { PullRequestModal } from './components/PullRequestModal';

export default function App() {
  // Authentication state - Starts logged out
  const [user, setUser] = useState<UserProfile | null>(null);

  // Screen routing state - Starts on landing page
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/sign-in') return 'sign-in';
      if (path === '/repositories') return 'repositories';
      if (path === '/dashboard') return 'dashboard';
    }
    return 'landing';
  });

  const [repository, setRepository] = useState<RepositoryData | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('repo_doctor_active_repo');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return createRepositoryFromInput('https://github.com/Khushal-Padshala/Repo-Doctor');
  });
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [activePR, setActivePR] = useState<PullRequestDetails | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isCreatingPR, setIsCreatingPR] = useState<boolean>(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState<boolean>(false);
  const [pendingRepoUrl, setPendingRepoUrl] = useState<string>('https://github.com/Khushal-Padshala/Repo-Doctor');
  const [isGitHubAuthenticating, setIsGitHubAuthenticating] = useState<boolean>(false);
  const [recentComparison, setRecentComparison] = useState<ImprovementComparison | null>(null);

  // Sync state with browser URL
  const navigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof window !== 'undefined' && window.history) {
      let targetPath = '/';
      if (screen === 'sign-in') targetPath = '/sign-in';
      else if (screen === 'repositories') targetPath = '/repositories';
      else if (
        screen === 'dashboard' ||
        screen === 'issue-details' ||
        screen === 'treatment' ||
        screen === 'success'
      ) {
        targetPath = '/dashboard';
      }

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ screen }, '', targetPath);
      }
    }
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/sign-in') {
        setCurrentScreen('sign-in');
      } else if (path === '/repositories') {
        setCurrentScreen('repositories');
      } else if (path === '/dashboard') {
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 1. Authenticate with GitHub (simulated)
  const handleContinueWithGitHub = () => {
    setIsGitHubAuthenticating(true);
    setTimeout(() => {
      setIsGitHubAuthenticating(false);
      const simulatedUser: UserProfile = {
        id: 'user-gh-1',
        name: 'Developer',
        username: '@developer',
        email: 'developer@acme.corp',
        avatarUrl: '',
        provider: 'github',
        organization: 'acme-corp'
      };
      setUser(simulatedUser);
      navigate('repositories');
    }, 400);
  };

  // 2. Authenticate with Google (simulated)
  const handleContinueWithGoogle = () => {
    const simulatedUser: UserProfile = {
      id: 'user-google-1',
      name: 'Developer',
      username: '@developer.google',
      email: 'developer@gmail.com',
      avatarUrl: '',
      provider: 'google',
      organization: 'acme-corp'
    };
    setUser(simulatedUser);
    navigate('repositories');
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    navigate('landing');
  };

  // Switch Account
  const handleSwitchAccount = () => {
    setUser(null);
    navigate('sign-in');
  };

  // 3. Analyze Custom Repository URL scan
  const handleCustomRepoSubmit = (repoUrl: string) => {
    const targetUrl = repoUrl?.trim() || 'https://github.com/Khushal-Padshala/Repo-Doctor';
    setPendingRepoUrl(targetUrl);
    // Guarantee instant repository availability with deterministic calculation
    const instantRepo = createRepositoryFromInput(targetUrl);
    setRepository(instantRepo);
    try {
      localStorage.setItem('repo_doctor_active_repo', JSON.stringify(instantRepo));
    } catch (e) {}
    setIsScanning(false);
    navigate('dashboard');

    // Fetch live backend data if available in background
    fetchRealRepositoryAnalysis(targetUrl)
      .then((realRepo) => {
        if (realRepo) {
          setRepository(realRepo);
          try {
            localStorage.setItem('repo_doctor_active_repo', JSON.stringify(realRepo));
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.warn('Using baseline repository data:', err);
      });
  };

  // Scanner Completion -> Loads selected repository into the Dashboard
  const handleScanComplete = () => {
    const targetUrl = pendingRepoUrl || repository?.url || 'https://github.com/Khushal-Padshala/Repo-Doctor';
    const finalRepo = repository || createRepositoryFromInput(targetUrl);
    setRepository(finalRepo);
    try {
      localStorage.setItem('repo_doctor_active_repo', JSON.stringify(finalRepo));
    } catch (e) {}
    setIsScanning(false);
    navigate('dashboard');
  };

  // Re-run checkup from Dashboard
  const handleReScan = () => {
    if (repository) {
      setPendingRepoUrl(repository.url);
      setIsScanning(true);
    }
  };

  // View Fix clicked from Dashboard -> Go to Issue Details
  const handleViewFix = (issue: Issue) => {
    setSelectedIssue(issue);
    navigate('issue-details');
  };

  // Apply Fix clicked from Issue Details -> Go to Treatment page
  const handleApplyFix = (issue: Issue) => {
    setSelectedIssue(issue);
    navigate('treatment');
  };

  // Create Pull Request clicked from Treatment page
  const handleCreatePullRequest = (issue: Issue) => {
    setIsCreatingPR(true);

    setTimeout(() => {
      setIsCreatingPR(false);

      const currentRepo = repository || {
        id: 'repo-demo',
        owner: 'developer',
        name: 'repository',
        fullName: 'developer/repository',
        url: 'https://github.com/developer/repository',
        stars: 120,
        forks: 34,
        branch: 'main',
        defaultBranch: 'main',
        lastScanned: 'Just now',
        commitHash: '8f92a1c',
        language: 'TypeScript',
        scores: { overall: 70, letterGrade: 'B', gradeDescription: 'Good with Minor Risks', security: 65, quality: 75, hygiene: 80, docs: 70, cicd: 60 },
        issues: [issue],
        healthHistory: []
      };

      const scoreBefore = currentRepo.scores?.overall ?? 70;
      const gradeBefore = currentRepo.scores?.letterGrade ?? 'B';
      const overallImpact = issue.scoreImpact?.overall ?? 12;
      const newScore = Math.min(100, scoreBefore + overallImpact);
      const gradeAfterInfo = calculateGrade(newScore);

      const prDetails: PullRequestDetails = {
        prNumber: issue.prNumber || Math.floor(100 + Math.random() * 900),
        title: issue.prTitle || `fix: ${issue.title}`,
        branchName: issue.targetBranch || `repo-doctor/remediation-patch-${issue.id || '1'}`,
        baseBranch: currentRepo.defaultBranch || 'main',
        author: 'repo-doctor[bot]',
        createdAt: 'Just now',
        scoreBefore,
        gradeBefore,
        scoreAfter: newScore,
        gradeAfter: gradeAfterInfo.grade,
        issue,
        status: 'open',
      };

      // Mark the issue as resolved and update scores in repository state
      const repoIssues = currentRepo.issues || [issue];
      const updatedIssues = repoIssues.map((i) =>
        i.id === issue.id ? { ...i, isResolved: true } : i
      );

      const updatedScores = {
        ...(currentRepo.scores || {}),
        overall: newScore,
        letterGrade: gradeAfterInfo.grade,
        gradeDescription: gradeAfterInfo.desc,
        security: Math.min(100, (currentRepo.scores?.security ?? 70) + (issue.scoreImpact?.security ?? 0)),
        quality: Math.min(100, (currentRepo.scores?.quality ?? 70) + (issue.scoreImpact?.quality ?? 0)),
        hygiene: Math.min(100, (currentRepo.scores?.hygiene ?? 70) + (issue.scoreImpact?.hygiene ?? 0)),
        docs: Math.min(100, (currentRepo.scores?.docs ?? 70) + (issue.scoreImpact?.docs ?? 0)),
        cicd: Math.min(100, (currentRepo.scores?.cicd ?? 70) + (issue.scoreImpact?.cicd ?? 0)),
      };

      const unresolvedBefore = repoIssues.filter((i) => !i.isResolved).length;
      const criticalBefore = repoIssues.filter((i) => !i.isResolved && i.severity === 'critical').length;
      const highBefore = repoIssues.filter((i) => !i.isResolved && i.severity === 'high').length;
      const mediumBefore = repoIssues.filter((i) => !i.isResolved && i.severity === 'medium').length;
      const lowBefore = repoIssues.filter((i) => !i.isResolved && i.severity === 'low').length;

      // Update comparison record
      setRecentComparison({
        beforeScore,
        beforeGrade,
        beforeActiveIssues: unresolvedBefore,
        beforeBreakdown: {
          critical: criticalBefore,
          high: highBefore,
          medium: mediumBefore,
          low: lowBefore,
        },
        afterScore: newScore,
        afterGrade: gradeAfterInfo.grade,
        afterActiveIssues: Math.max(0, unresolvedBefore - 1),
        afterBreakdown: {
          critical: Math.max(0, criticalBefore - (issue.severity === 'critical' ? 1 : 0)),
          high: Math.max(0, highBefore - (issue.severity === 'high' ? 1 : 0)),
          medium: Math.max(0, mediumBefore - (issue.severity === 'medium' ? 1 : 0)),
          low: Math.max(0, lowBefore - (issue.severity === 'low' ? 1 : 0)),
        },
        resolvedCount: 1,
        pointsGained: Math.max(0, newScore - scoreBefore),
        recentFixedTitle: issue.title,
      });

      // Update history
      const newHistory = [
        ...(currentRepo.healthHistory || []),
        {
          date: 'Now',
          score: newScore,
          label: `PR #${prDetails.prNumber}: ${issue.title.slice(0, 24)}...`
        }
      ];

      setRepository({
        ...currentRepo,
        scores: updatedScores,
        issues: updatedIssues,
        healthHistory: newHistory,
      });

      setActivePR(prDetails);
      navigate('success');
    }, 300);
  };

  // Automated Quick Fix for a single issue
  const handleApplyQuickFix = async (issueId: string) => {
    if (!repository) return;
    const target = repository.issues.find((i) => i.id === issueId);
    if (!target || target.isResolved) return;

    const scoreBefore = repository.scores.overall;
    const gradeBefore = repository.scores.letterGrade;
    const newScore = Math.min(100, scoreBefore + target.scoreImpact.overall);
    const gradeAfterInfo = calculateGrade(newScore);

    const updatedIssues = repository.issues.map((i) =>
      i.id === issueId ? { ...i, isResolved: true } : i
    );

    const updatedScores = {
      ...repository.scores,
      overall: newScore,
      letterGrade: gradeAfterInfo.grade,
      gradeDescription: gradeAfterInfo.desc,
      security: Math.min(100, repository.scores.security + target.scoreImpact.security),
      quality: Math.min(100, repository.scores.quality + target.scoreImpact.quality),
      hygiene: Math.min(100, repository.scores.hygiene + target.scoreImpact.hygiene),
      docs: Math.min(100, repository.scores.docs + target.scoreImpact.docs),
      cicd: Math.min(100, repository.scores.cicd + target.scoreImpact.cicd),
    };

    const unresolvedBefore = repository.issues.filter((i) => !i.isResolved).length;
    const criticalBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'critical').length;
    const highBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'high').length;
    const mediumBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'medium').length;
    const lowBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'low').length;

    setRecentComparison({
      beforeScore,
      beforeGrade,
      beforeActiveIssues: unresolvedBefore,
      beforeBreakdown: {
        critical: criticalBefore,
        high: highBefore,
        medium: mediumBefore,
        low: lowBefore,
      },
      afterScore: newScore,
      afterGrade: gradeAfterInfo.grade,
      afterActiveIssues: Math.max(0, unresolvedBefore - 1),
      afterBreakdown: {
        critical: Math.max(0, criticalBefore - (target.severity === 'critical' ? 1 : 0)),
        high: Math.max(0, highBefore - (target.severity === 'high' ? 1 : 0)),
        medium: Math.max(0, mediumBefore - (target.severity === 'medium' ? 1 : 0)),
        low: Math.max(0, lowBefore - (target.severity === 'low' ? 1 : 0)),
      },
      resolvedCount: 1,
      pointsGained: Math.max(0, newScore - scoreBefore),
      recentFixedTitle: target.title,
    });

    const newHistory = [
      ...(repository.healthHistory || []),
      {
        date: 'Now',
        score: newScore,
        label: `Quick Fix: ${target.id}`
      }
    ];

    setRepository({
      ...repository,
      scores: updatedScores,
      issues: updatedIssues,
      healthHistory: newHistory,
    });
  };

  // Automated Quick Fix for all actionable issues at once
  const handleApplyAllQuickFixes = async () => {
    if (!repository) return;
    const targets = repository.issues.filter((i) => i.canQuickFix && !i.isResolved);
    if (targets.length === 0) return;

    const scoreBefore = repository.scores.overall;
    const gradeBefore = repository.scores.letterGrade;

    let overallGain = 0;
    let secGain = 0;
    let qualGain = 0;
    let hygGain = 0;
    let docGain = 0;
    let cicdGain = 0;

    targets.forEach((t) => {
      overallGain += t.scoreImpact.overall;
      secGain += t.scoreImpact.security;
      qualGain += t.scoreImpact.quality;
      hygGain += t.scoreImpact.hygiene;
      docGain += t.scoreImpact.docs;
      cicdGain += t.scoreImpact.cicd;
    });

    const newScore = Math.min(100, scoreBefore + overallGain);
    const gradeAfterInfo = calculateGrade(newScore);

    const targetIds = new Set(targets.map((t) => t.id));
    const updatedIssues = repository.issues.map((i) =>
      targetIds.has(i.id) ? { ...i, isResolved: true } : i
    );

    const updatedScores = {
      ...repository.scores,
      overall: newScore,
      letterGrade: gradeAfterInfo.grade,
      gradeDescription: gradeAfterInfo.desc,
      security: Math.min(100, repository.scores.security + secGain),
      quality: Math.min(100, repository.scores.quality + qualGain),
      hygiene: Math.min(100, repository.scores.hygiene + hygGain),
      docs: Math.min(100, repository.scores.docs + docGain),
      cicd: Math.min(100, repository.scores.cicd + cicdGain),
    };

    const unresolvedBefore = repository.issues.filter((i) => !i.isResolved).length;
    const criticalBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'critical').length;
    const highBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'high').length;
    const mediumBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'medium').length;
    const lowBefore = repository.issues.filter((i) => !i.isResolved && i.severity === 'low').length;

    const critFixed = targets.filter((t) => t.severity === 'critical').length;
    const highFixed = targets.filter((t) => t.severity === 'high').length;
    const medFixed = targets.filter((t) => t.severity === 'medium').length;
    const lowFixed = targets.filter((t) => t.severity === 'low').length;

    setRecentComparison({
      beforeScore,
      beforeGrade,
      beforeActiveIssues: unresolvedBefore,
      beforeBreakdown: {
        critical: criticalBefore,
        high: highBefore,
        medium: mediumBefore,
        low: lowBefore,
      },
      afterScore: newScore,
      afterGrade: gradeAfterInfo.grade,
      afterActiveIssues: Math.max(0, unresolvedBefore - targets.length),
      afterBreakdown: {
        critical: Math.max(0, criticalBefore - critFixed),
        high: Math.max(0, highBefore - highFixed),
        medium: Math.max(0, mediumBefore - medFixed),
        low: Math.max(0, lowBefore - lowFixed),
      },
      resolvedCount: targets.length,
      pointsGained: Math.max(0, newScore - scoreBefore),
      recentFixedTitle: targets.map((t) => t.title).join(', '),
    });

    const newHistory = [
      ...(repository.healthHistory || []),
      {
        date: 'Now',
        score: newScore,
        label: `Applied ${targets.length} Quick Fixes`
      }
    ];

    setRepository({
      ...repository,
      scores: updatedScores,
      issues: updatedIssues,
      healthHistory: newHistory,
    });
  };

  // Navigate to next issue from success state
  const handleDiagnoseNext = () => {
    if (repository) {
      const nextUnresolved = repository.issues.find((i) => !i.isResolved);
      if (nextUnresolved) {
        setSelectedIssue(nextUnresolved);
        navigate('issue-details');
      } else {
        navigate('dashboard');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-500/20 selection:text-slate-900">
      {/* Sidebar for authenticated / app views */}
      {currentScreen !== 'landing' && currentScreen !== 'sign-in' && (
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={navigate}
          onNewScan={() => {
            if (user) {
              navigate('repositories');
            } else {
              navigate('landing');
            }
          }}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Application Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={navigate}
          repository={repository}
          onNewScan={() => {
            if (user) {
              navigate('repositories');
            } else {
              navigate('landing');
            }
          }}
          user={user}
          onLogout={handleLogout}
          onSwitchAccount={handleSwitchAccount}
          onSignIn={() => navigate('sign-in')}
        />

        {/* Screen Routing */}
        <main className="flex-1">
          {/* 1. Landing Page */}
          {currentScreen === 'landing' && (
            <LandingPage
              onContinueWithGitHub={handleContinueWithGitHub}
              onContinueWithGoogle={handleContinueWithGoogle}
              onNavigateToSignIn={() => navigate('sign-in')}
              onNavigateToAnalyze={() => navigate('repositories')}
              isGitHubLoading={isGitHubAuthenticating}
            />
          )}

          {/* 2. Sign In Page */}
          {currentScreen === 'sign-in' && (
            <SignInPage
              onLoginSuccess={(provider) => {
                if (provider === 'google') {
                  handleContinueWithGoogle();
                } else {
                  const simulatedUser: UserProfile = {
                    id: 'user-gh-1',
                    name: 'Developer',
                    username: '@developer',
                    email: 'developer@acme.corp',
                    avatarUrl: '',
                    provider: 'github',
                    organization: 'acme-corp'
                  };
                  setUser(simulatedUser);
                  navigate('repositories');
                }
              }}
              onBackToLanding={() => navigate('landing')}
            />
          )}

          {/* 3. Repository Selection Page */}
          {currentScreen === 'repositories' && (
            <RepositorySelectionPage
              user={user}
              onCustomRepoSubmit={handleCustomRepoSubmit}
              onAnalyzeRepository={handleCustomRepoSubmit}
              onSwitchAccount={handleSwitchAccount}
              isAnalyzing={isScanning}
            />
          )}

          {/* 4. Repo Doctor Dashboard */}
          {currentScreen === 'dashboard' && (
            repository ? (
              <Dashboard
                repository={repository}
                onViewFix={handleViewFix}
                onReScan={handleReScan}
                onApplyQuickFix={handleApplyQuickFix}
                onApplyAllQuickFixes={handleApplyAllQuickFixes}
                recentComparison={recentComparison}
                onDismissComparison={() => setRecentComparison(null)}
              />
            ) : (
              // Fallback if directly accessed without analyzing a repo
              <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center font-sans">
                <p className="text-slate-500 mb-4 text-sm font-medium">No repository analyzed yet.</p>
                <button
                  onClick={() => navigate(user ? 'repositories' : 'landing')}
                  className="rounded-xl bg-slate-900 px-6 py-2.5 font-sans text-xs font-semibold text-white hover:bg-slate-800 transition shadow-md"
                >
                  Analyze a Repository
                </button>
              </div>
            )
          )}

          {/* 5. Issue Details Screen */}
          {currentScreen === 'issue-details' && selectedIssue && (
            <IssueDetails
              issue={selectedIssue}
              onApplyFix={handleApplyFix}
              onBack={() => navigate('dashboard')}
            />
          )}

          {/* 6. Treatment Screen */}
          {currentScreen === 'treatment' && selectedIssue && (
            <TreatmentPage
              issue={selectedIssue}
              onCreatePullRequest={handleCreatePullRequest}
              onBack={() => navigate('issue-details')}
              isCreatingPR={isCreatingPR}
            />
          )}

          {/* 7. Success State Screen */}
          {currentScreen === 'success' && (
            <SuccessState
              pr={activePR || {
                prNumber: selectedIssue?.prNumber || 101,
                title: selectedIssue?.prTitle || 'fix: repository health remediation patch',
                branchName: selectedIssue?.targetBranch || 'repo-doctor/patch',
                baseBranch: repository?.defaultBranch || 'main',
                author: 'repo-doctor[bot]',
                createdAt: 'Just now',
                scoreBefore: repository?.scores?.overall ?? 70,
                gradeBefore: repository?.scores?.letterGrade ?? 'B',
                scoreAfter: Math.min(100, (repository?.scores?.overall ?? 70) + (selectedIssue?.scoreImpact?.overall ?? 12)),
                gradeAfter: 'A',
                issue: selectedIssue || ({} as any),
                status: 'open',
              }}
              onViewPullRequest={() => setIsPRModalOpen(true)}
              onBackToDashboard={() => {
                setIsPRModalOpen(false);
                navigate('dashboard');
              }}
              onDiagnoseNext={handleDiagnoseNext}
            />
          )}
        </main>
      </div>

      {/* Background Analysis Scanner Modal */}
      {isScanning && (
        <CheckupScanner
          repoName={pendingRepoUrl || 'username/repository'}
          onComplete={handleScanComplete}
        />
      )}

      {/* Pull Request GitHub Drawer Modal */}
      <PullRequestModal
        pr={activePR}
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        onMerged={() => {
          setIsPRModalOpen(false);
          navigate('dashboard');
        }}
      />
    </div>
  );
}
