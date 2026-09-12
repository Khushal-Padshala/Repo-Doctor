/* app.js — Repo Doctor frontend logic */

const API_BASE = '';  // same origin

// ── DOM refs ────────────────────────────────────────────────────────────────
const scanForm       = document.getElementById('scanForm');
const repoUrlInput   = document.getElementById('repoUrl');
const scanBtn        = document.getElementById('scanBtn');
const btnText        = scanBtn.querySelector('.btn-text');
const btnSpinner     = scanBtn.querySelector('.btn-spinner');
const formError      = document.getElementById('formError');

const scanCard       = document.getElementById('scanCard');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');

// Loading steps
const steps = {
  clone: document.getElementById('step-clone'),
  scan:  document.getElementById('step-scan'),
  score: document.getElementById('step-score'),
  done:  document.getElementById('step-done'),
};
const loadingTitle    = document.getElementById('loadingTitle');
const loadingSubtitle = document.getElementById('loadingSubtitle');

// Results elements
const scoreHero    = document.getElementById('scoreHero');
const scoreRepoUrl = document.getElementById('scoreRepoUrl');
const scoreNumber  = document.getElementById('scoreNumber');
const scoreElapsed = document.getElementById('scoreElapsed');
const gradeBadge   = document.getElementById('gradeBadge');
const gradeLabel   = document.getElementById('gradeLabel');

const hygieneEarned  = document.getElementById('hygieneEarned');
const securityEarned = document.getElementById('securityEarned');
const codeEarned     = document.getElementById('codeEarned');
const hygieneFill    = document.getElementById('hygieneFill');
const securityFill   = document.getElementById('securityFill');
const codeFill       = document.getElementById('codeFill');

const statsRow   = document.getElementById('statsRow');
const issuesList = document.getElementById('issuesList');
const noIssues   = document.getElementById('noIssues');
const issuesCount = document.getElementById('issuesCount');
const rescanBtn  = document.getElementById('rescanBtn');

// Cures elements
const curesSection     = document.getElementById('curesSection');
const curesCount       = document.getElementById('curesCount');
const toggleCuresBtn   = document.getElementById('toggleCuresBtn');
const toggleCuresText  = document.getElementById('toggleCuresText');
const curesContent     = document.getElementById('curesContent');
const curesFileTabs    = document.getElementById('curesFileTabs');
const copyCureBtn      = document.getElementById('copyCureBtn');
const downloadDiffBtn  = document.getElementById('downloadDiffBtn');
const currentCurePath  = document.getElementById('currentCurePath');
const cureCodeBlock    = document.getElementById('cureCodeBlock');

let currentCuresData   = null;
let activeCureIndex    = 0;

// ── Grade config ─────────────────────────────────────────────────────────────
const GRADE_CONFIG = {
  A: { label: 'EXCELLENT',  scoreColor: '#3fb950' },
  B: { label: 'GOOD',       scoreColor: '#58a6ff' },
  C: { label: 'FAIR',       scoreColor: '#e3b341' },
  D: { label: 'POOR',       scoreColor: '#f78166' },
  F: { label: 'CRITICAL',   scoreColor: '#ff4444' },
};

const SEV_LABELS = {
  critical: 'Critical',
  error:    'Error',
  warning:  'Warning',
  info:     'Info',
};

const CAT_LABELS = {
  hygiene:  'Repo Hygiene',
  security: 'Security',
  code:     'Code Quality',
};

// ── Utility ───────────────────────────────────────────────────────────────────
function showError(msg) {
  formError.textContent = msg;
  formError.hidden = false;
}

function clearError() {
  formError.hidden = true;
  formError.textContent = '';
}

function setScanLoading(loading) {
  scanBtn.disabled = loading;
  btnText.hidden = loading;
  btnSpinner.hidden = !loading;
}

function setStep(name, state) {
  // state: 'active' | 'done'
  const el = steps[name];
  if (!el) return;
  el.classList.remove('active', 'done');
  if (state) el.classList.add(state);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Animate loading steps ─────────────────────────────────────────────────────
async function animateLoadingSteps(promise) {
  // Clone step
  setStep('clone', 'active');
  loadingTitle.textContent = 'Cloning repository…';
  loadingSubtitle.textContent = 'Running a shallow clone (depth=1). This takes a few seconds.';

  // Show the loading section
  scanCard.hidden = true;
  loadingSection.hidden = false;
  loadingSection.classList.add('fade-in');

  // Wait at least 1s before advancing to "scan"
  const minWaitClone = sleep(1200);
  const result = await Promise.allSettled([promise, minWaitClone]);

  // Even if API already returned, animate through steps
  setStep('clone', 'done');
  setStep('scan', 'active');
  loadingTitle.textContent = 'Scanning files…';
  loadingSubtitle.textContent = 'Checking secrets, hygiene files, and code smells.';
  await sleep(600);

  setStep('scan', 'done');
  setStep('score', 'active');
  loadingTitle.textContent = 'Computing health score…';
  loadingSubtitle.textContent = 'Applying the 100-point rubric.';
  await sleep(400);

  setStep('score', 'done');
  setStep('done', 'active');
  await sleep(200);
  setStep('done', 'done');

  // Return the original promise result
  if (result[0].status === 'rejected') throw result[0].reason;
  return result[0].value;
}

// ── Build results UI ──────────────────────────────────────────────────────────
function renderScore(data) {
  const { score, repo_url, elapsed_seconds } = data;
  const cfg = GRADE_CONFIG[score.grade] || GRADE_CONFIG.F;

  // Header
  scoreRepoUrl.textContent = repo_url;
  scoreElapsed.textContent = `Analysed in ${elapsed_seconds}s`;

  // Animated counter
  animateCounter(scoreNumber, score.total, 800);
  scoreNumber.style.color = cfg.scoreColor;

  // Grade badge
  gradeBadge.textContent = score.grade;
  gradeBadge.className = `grade-badge grade-${score.grade}`;
  gradeLabel.textContent = cfg.label;
  gradeLabel.style.color = cfg.scoreColor;

  // Category scores (animate bars after brief delay)
  hygieneEarned.textContent  = score.hygiene.earned;
  securityEarned.textContent = score.security.earned;
  codeEarned.textContent     = score.code.earned;

  setTimeout(() => {
    hygieneFill.style.width  = score.hygiene.pct + '%';
    securityFill.style.width = score.security.pct + '%';
    codeFill.style.width     = score.code.pct + '%';
  }, 200);
}

function animateCounter(el, target, duration) {
  const start = performance.now();
  const from = 0;
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (target - from) * ease);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderStats(data) {
  const { stats, hygiene_detail } = data;
  const chips = [
    { icon: '📁', value: stats.files_scanned,  label: 'Files Scanned' },
    { icon: '🔑', value: stats.secrets_found,  label: 'Leaked Secrets' },
    { icon: '📝', value: stats.todo_count,      label: 'TODOs / FIXMEs' },
    { icon: '📦', value: stats.bloated_files,   label: 'Oversized Files' },
  ];

  statsRow.innerHTML = chips.map(c => `
    <div class="stat-chip">
      <span class="stat-icon">${c.icon}</span>
      <div>
        <div class="stat-value">${c.value}</div>
        <div class="stat-label">${c.label}</div>
      </div>
    </div>
  `).join('');
}

function renderIssues(issues) {
  issuesCount.textContent = issues.length;

  if (issues.length === 0) {
    issuesList.innerHTML = '';
    noIssues.hidden = false;
    return;
  }

  noIssues.hidden = true;

  // Sort: critical → error → warning → info
  const sevOrder = { critical: 0, error: 1, warning: 2, info: 3 };
  const sorted = [...issues].sort(
    (a, b) => (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9)
  );

  issuesList.innerHTML = sorted.map((issue, i) => buildIssueHTML(issue, i)).join('');

  // Attach click handlers
  issuesList.querySelectorAll('.issue-item').forEach(el => {
    el.addEventListener('click', () => el.classList.toggle('expanded'));
  });
}

function buildIssueHTML(issue, idx) {
  const sev = issue.severity;
  const catLabel = CAT_LABELS[issue.category] || issue.category;

  let bodyExtra = '';

  if (issue.file && issue.line) {
    bodyExtra += `
      <div class="issue-file-ref">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        ${escHtml(issue.file)} : line ${issue.line}
      </div>`;
  } else if (issue.file) {
    bodyExtra += `
      <div class="issue-file-ref">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        ${escHtml(issue.file)}
      </div>`;
  }

  if (issue.locations && issue.locations.length > 0) {
    const locs = issue.locations.slice(0, 8).map(l =>
      `<div class="location-item">${escHtml(l.file)}:${l.line} — ${escHtml(l.text.slice(0, 80))}</div>`
    ).join('');
    const more = issue.locations.length > 8
      ? `<div class="location-item" style="color:var(--text-dim)">… and ${issue.locations.length - 8} more</div>`
      : '';
    bodyExtra += `
      <div class="issue-locations">
        <div class="issue-locations-title">Sample locations</div>
        ${locs}${more}
      </div>`;
  }

  const impactStr = issue.impact ? `<span class="issue-impact">${issue.impact} pts</span>` : '';

  return `
    <div class="issue-item fade-in" data-sev="${sev}" data-cat="${issue.category}" style="animation-delay:${idx * 40}ms">
      <span class="expand-icon">⌄</span>
      <div class="issue-header">
        <span class="issue-sev-badge sev-${sev}">${SEV_LABELS[sev]}</span>
        <div class="issue-meta">
          <div class="issue-title">${escHtml(issue.title)}</div>
          <div class="issue-category">${catLabel}</div>
        </div>
        ${impactStr}
      </div>
      <div class="issue-body">
        <p class="issue-description">${escHtml(issue.description)}</p>
        ${bodyExtra}
      </div>
    </div>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Filter pills ──────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;
    document.querySelectorAll('.issue-item').forEach(item => {
      if (filter === 'all' || item.dataset.sev === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ── Main scan handler ─────────────────────────────────────────────────────────

async function runScan() {
  clearError();

  const rawUrl = repoUrlInput.value.trim();
  if (!rawUrl) {
    showError('Please enter a repository URL.');
    return;
  }

  setScanLoading(true);

  // Kick off the API call
  const apiPromise = fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: rawUrl }),
  }).then(async res => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(body.detail || `HTTP ${res.status}`);
    }
    return res.json();
  });

  try {
    const data = await animateLoadingSteps(apiPromise);

    // Hide loading, show results
    loadingSection.hidden = true;
    resultsSection.hidden = false;
    resultsSection.classList.add('fade-in');

    renderScore(data);
    renderStats(data);
    renderIssues(data.issues);
    renderCures(data.cures);

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    // Back to the form
    loadingSection.hidden = true;
    scanCard.hidden = false;
    showError(err.message || 'Scan failed. Please try again.');
  } finally {
    setScanLoading(false);
    // Reset all steps for next run
    Object.keys(steps).forEach(k => setStep(k, null));
  }
}

// ── Doctor's Cures Rendering ──────────────────────────────────────────────────
function renderCures(cures) {
  currentCuresData = cures;
  activeCureIndex = 0;

  if (!cures || !cures.files || cures.files.length === 0) {
    curesSection.hidden = true;
    return;
  }

  curesSection.hidden = false;
  curesCount.textContent = cures.files.length;
  curesContent.hidden = true;
  toggleCuresText.textContent = 'View Recommended Cures';

  // Build file tabs: one for each generated file + 1 for unified diff
  const allTabs = [...cures.files];
  if (cures.unified_diff) {
    allTabs.push({
      path: 'unified-patch.diff',
      filename: 'unified-patch.diff',
      content: cures.unified_diff,
      isDiff: true,
    });
  }

  curesFileTabs.innerHTML = allTabs.map((item, idx) => `
    <button class="cure-tab-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}">
      <span>${item.isDiff ? '📄' : '📝'}</span>
      <span>${escHtml(item.path)}</span>
    </button>
  `).join('');

  // Attach tab click listeners
  curesFileTabs.querySelectorAll('.cure-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      switchCureTab(idx, allTabs);
    });
  });

  // Display initial tab
  switchCureTab(0, allTabs);
}

function switchCureTab(idx, allTabs) {
  activeCureIndex = idx;
  const item = allTabs[idx];
  if (!item) return;

  curesFileTabs.querySelectorAll('.cure-tab-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.index, 10) === idx);
  });

  currentCurePath.textContent = item.path;
  cureCodeBlock.textContent = item.content;
}

// ── Cures Interactive Handlers ────────────────────────────────────────────────
toggleCuresBtn.addEventListener('click', () => {
  const isCurrentlyHidden = curesContent.hidden;
  curesContent.hidden = !isCurrentlyHidden;
  toggleCuresText.textContent = isCurrentlyHidden ? 'Hide Recommended Cures' : 'View Recommended Cures';
  if (isCurrentlyHidden) {
    curesContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

copyCureBtn.addEventListener('click', async () => {
  const code = cureCodeBlock.textContent;
  if (!code) return;

  try {
    await navigator.clipboard.writeText(code);
    const originalText = copyCureBtn.innerHTML;
    copyCureBtn.innerHTML = '<span>✅ Copied!</span>';
    setTimeout(() => {
      copyCureBtn.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    // Fallback if clipboard API blocked
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    const originalText = copyCureBtn.innerHTML;
    copyCureBtn.innerHTML = '<span>✅ Copied!</span>';
    setTimeout(() => {
      copyCureBtn.innerHTML = originalText;
    }, 2000);
  }
});

downloadDiffBtn.addEventListener('click', () => {
  if (!currentCuresData || !currentCuresData.unified_diff) {
    alert('No diff available to download.');
    return;
  }
  const blob = new Blob([currentCuresData.unified_diff], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'repo_doctor_fixes.diff';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── Wire up all trigger paths ─────────────────────────────────────────────────
// 1. Form submit (works when button type=submit is clicked)
scanForm.addEventListener('submit', (e) => { e.preventDefault(); runScan(); });

// 2. Scan button direct click (fallback if form submit doesn't fire)
scanBtn.addEventListener('click', (e) => { e.preventDefault(); runScan(); });

// 3. Enter key in the input field
repoUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); runScan(); }
});

// ── Rescan ────────────────────────────────────────────────────────────────────
rescanBtn.addEventListener('click', () => {
  resultsSection.hidden = true;
  curesSection.hidden = true;
  curesContent.hidden = true;
  currentCuresData = null;
  scanCard.hidden = false;
  scanCard.classList.add('fade-in');
  repoUrlInput.value = '';
  repoUrlInput.focus();

  // Reset filter pills
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  document.querySelector('.filter-pill[data-filter="all"]').classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Demo buttons ──────────────────────────────────────────────────────────────
document.querySelectorAll('.demo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    repoUrlInput.value = btn.dataset.url;
    repoUrlInput.focus();
    clearError();
  });
});

