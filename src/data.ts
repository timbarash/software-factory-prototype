export type TicketType = 'BUG' | 'PF';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Stage = 'contexta' | 'plana' | 'bilda' | 'qa' | 'merge';

export interface AgentAssessment {
  agent: string;
  readiness: number; // 0-100
  humanInput: 'none' | 'low' | 'medium' | 'high';
  summary: string;
}

export interface Ticket {
  id: string;
  title: string;
  type: TicketType;
  severity: Severity;
  stage: Stage;
  assignee: string;
  created: string;
  labels: string[];
  description: string;
  affectedUsers: number;
  errorRate?: number;
  requestCount?: number;
  agents: AgentAssessment[];
  confidenceScore: number;
  complexityScore: number;
}

export interface ExpertAgent {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  thoughts: string[];
}

export const stages: { key: Stage; label: string; agent: string }[] = [
  { key: 'contexta', label: 'Contexta', agent: 'Context & Discovery' },
  { key: 'plana', label: 'Plana', agent: 'Architecture & Planning' },
  { key: 'bilda', label: 'Bilda', agent: 'Implementation' },
  { key: 'qa', label: 'QA', agent: 'Testing & Validation' },
  { key: 'merge', label: 'Merge', agent: 'Review & Deploy' },
];

export const tickets: Ticket[] = [
  {
    id: 'PF-1247',
    title: 'Add bulk action toolbar to inventory table',
    type: 'PF',
    severity: 'high',
    stage: 'plana',
    assignee: 'Unassigned',
    created: '2d ago',
    labels: ['frontend', 'ux', 'inventory'],
    description: 'Users managing 500+ SKUs need bulk select, bulk edit, and bulk archive from the inventory table. Currently must edit one-by-one. Feature request from 12 enterprise accounts.',
    affectedUsers: 340,
    requestCount: 47,
    agents: [
      { agent: 'Contexta', readiness: 92, humanInput: 'low', summary: 'Clear requirements from 47 requests. Existing table component supports selection. 3 similar patterns in codebase.' },
      { agent: 'Plana', readiness: 78, humanInput: 'medium', summary: 'Recommends toolbar component with bulk edit modal. Need human input on which fields are bulk-editable. 2 API endpoints needed.' },
      { agent: 'Bilda', readiness: 65, humanInput: 'medium', summary: 'Can scaffold toolbar + selection state. Blocked on bulk edit field decisions. Estimated 3-4 component files.' },
      { agent: 'QA', readiness: 40, humanInput: 'low', summary: 'Will need tests for 0, 1, all selected states. Performance test at 1000 rows. Edge case: concurrent edits.' },
    ],
    confidenceScore: 74,
    complexityScore: 6,
  },
  {
    id: 'BUG-892',
    title: 'Order sync fails silently for multi-location retailers',
    type: 'BUG',
    severity: 'critical',
    stage: 'contexta',
    assignee: 'Unassigned',
    created: '4h ago',
    labels: ['backend', 'orders', 'sync', 'P0'],
    description: 'Orders placed at secondary locations are not syncing to the POS. No error logged. Affects retailers with 3+ locations. Revenue at risk: ~$12K/day across affected accounts.',
    affectedUsers: 23,
    errorRate: 34,
    agents: [
      { agent: 'Contexta', readiness: 55, humanInput: 'high', summary: 'Identified 3 related incidents in last 90 days. Root cause unclear — could be race condition in location resolver or stale cache. Need eng to confirm sync architecture.' },
      { agent: 'Plana', readiness: 20, humanInput: 'high', summary: 'Insufficient context to plan. Need Contexta to identify root cause first. Likely involves order-sync-worker and location-cache services.' },
      { agent: 'Bilda', readiness: 10, humanInput: 'high', summary: 'Cannot proceed without diagnosis. Will need access to sync worker logs and multi-location test environment.' },
      { agent: 'QA', readiness: 15, humanInput: 'medium', summary: 'Can prepare multi-location test fixtures. Need 3-location staging retailer. Regression risk: order flow is critical path.' },
    ],
    confidenceScore: 28,
    complexityScore: 9,
  },
  {
    id: 'PF-1251',
    title: 'Real-time inventory alerts with configurable thresholds',
    type: 'PF',
    severity: 'medium',
    stage: 'bilda',
    assignee: 'Sarah Chen',
    created: '5d ago',
    labels: ['frontend', 'backend', 'notifications', 'inventory'],
    description: 'Retailers want configurable low-stock alerts (email + in-app) with per-SKU thresholds. Currently only manual inventory checks.',
    affectedUsers: 890,
    requestCount: 123,
    agents: [
      { agent: 'Contexta', readiness: 95, humanInput: 'none', summary: 'Fully mapped requirements from 123 requests. Notification preferences schema exists. WebSocket infrastructure ready.' },
      { agent: 'Plana', readiness: 90, humanInput: 'low', summary: 'Architecture approved. Threshold config UI → Go worker polling inventory → WebSocket push + email via SendGrid. 6 files.' },
      { agent: 'Bilda', readiness: 72, humanInput: 'low', summary: 'Threshold config UI complete. Worker 80% done. Remaining: email templates, notification center integration.' },
      { agent: 'QA', readiness: 50, humanInput: 'low', summary: 'Unit tests for threshold logic done. Need e2e for notification delivery. Load test: 10K concurrent threshold checks.' },
    ],
    confidenceScore: 82,
    complexityScore: 5,
  },
  {
    id: 'BUG-901',
    title: 'Payment processing timeout on orders >$5K',
    type: 'BUG',
    severity: 'critical',
    stage: 'qa',
    assignee: 'Mike Torres',
    created: '1d ago',
    labels: ['backend', 'payments', 'P0', 'timeout'],
    description: 'Orders exceeding $5,000 are timing out during payment processing. Gateway returns 504 after 30s. Workaround: split into multiple orders.',
    affectedUsers: 15,
    errorRate: 89,
    agents: [
      { agent: 'Contexta', readiness: 98, humanInput: 'none', summary: 'Root cause identified: fraud check API called synchronously for high-value orders. Response time: 28-45s. Threshold is 30s.' },
      { agent: 'Plana', readiness: 95, humanInput: 'none', summary: 'Move fraud check to async with webhook callback. Add interim pending state. Increase timeout to 60s as interim fix.' },
      { agent: 'Bilda', readiness: 92, humanInput: 'none', summary: 'Async fraud check implemented. Pending state UI added. Webhook handler tested. Ready for QA.' },
      { agent: 'QA', readiness: 70, humanInput: 'low', summary: 'Validating timeout scenarios. Need to test: $4999 (under), $5000 (boundary), $10000 (over). Webhook retry on failure.' },
    ],
    confidenceScore: 91,
    complexityScore: 4,
  },
  {
    id: 'PF-1239',
    title: 'CSV export for sales reports with custom date ranges',
    type: 'PF',
    severity: 'low',
    stage: 'merge',
    assignee: 'Alex Kim',
    created: '8d ago',
    labels: ['frontend', 'reports', 'export'],
    description: 'Add CSV export functionality to all sales report views. Include custom date range picker and column selection.',
    affectedUsers: 560,
    requestCount: 89,
    agents: [
      { agent: 'Contexta', readiness: 100, humanInput: 'none', summary: 'Requirements complete. 89 requests analyzed. Standard CSV export pattern.' },
      { agent: 'Plana', readiness: 100, humanInput: 'none', summary: 'Plan executed. Client-side CSV generation with streaming for large datasets.' },
      { agent: 'Bilda', readiness: 100, humanInput: 'none', summary: 'Implementation complete. Date picker, column selector, streaming export all working.' },
      { agent: 'QA', readiness: 95, humanInput: 'none', summary: 'All tests passing. Verified: 50K row export, special characters, date edge cases. Ready for merge.' },
    ],
    confidenceScore: 97,
    complexityScore: 2,
  },
  {
    id: 'BUG-887',
    title: 'Dashboard charts flicker on window resize',
    type: 'BUG',
    severity: 'low',
    stage: 'bilda',
    assignee: 'Unassigned',
    created: '6d ago',
    labels: ['frontend', 'dashboard', 'charts', 'ux'],
    description: 'Recharts components re-mount on every resize event instead of using ResizeObserver with debounce. Causes visible flicker and layout shift.',
    affectedUsers: 2100,
    agents: [
      { agent: 'Contexta', readiness: 98, humanInput: 'none', summary: 'Issue confirmed. Recharts ResponsiveContainer re-mounts on resize. 4 chart components affected.' },
      { agent: 'Plana', readiness: 95, humanInput: 'none', summary: 'Wrap charts in custom ResizeObserver hook with 150ms debounce. Apply to all 4 chart components.' },
      { agent: 'Bilda', readiness: 60, humanInput: 'none', summary: 'useResizeObserver hook created. Applied to 2/4 charts. Remaining: revenue-chart.tsx, velocity-chart.tsx.' },
      { agent: 'QA', readiness: 30, humanInput: 'none', summary: 'Need visual regression tests. Resize from 320px to 1440px. Verify no CLS > 0.1.' },
    ],
    confidenceScore: 85,
    complexityScore: 3,
  },
  {
    id: 'PF-1255',
    title: 'API rate limiting dashboard for integration partners',
    type: 'PF',
    severity: 'medium',
    stage: 'contexta',
    assignee: 'Unassigned',
    created: '1d ago',
    labels: ['backend', 'frontend', 'api', 'partners'],
    description: 'Integration partners need visibility into their API usage, rate limit status, and historical request patterns. Currently no self-serve dashboard.',
    affectedUsers: 45,
    requestCount: 18,
    agents: [
      { agent: 'Contexta', readiness: 45, humanInput: 'high', summary: 'Gathering requirements from 18 partner requests. Need to determine: which metrics to expose, retention period, real-time vs batch.' },
      { agent: 'Plana', readiness: 15, humanInput: 'high', summary: 'Early stage. Depends on Contexta output. Likely needs new API metrics service + React dashboard.' },
      { agent: 'Bilda', readiness: 5, humanInput: 'high', summary: 'Cannot start without plan. Will need Datadog metrics pipeline + new dashboard views.' },
      { agent: 'QA', readiness: 10, humanInput: 'medium', summary: 'Will need load testing for metrics API. Accuracy validation against Datadog source of truth.' },
    ],
    confidenceScore: 22,
    complexityScore: 8,
  },
];

export const expertAgents: Record<string, ExpertAgent[]> = {
  'PF-1247': [
    {
      id: 'design-lead',
      name: 'Design Lead',
      role: 'VP Design',
      icon: '◆',
      color: '#a855f7',
      thoughts: [
        'Bulk toolbar should follow Linear\'s selection pattern — floating bar at bottom, not fixed header.',
        'Need clear visual feedback: selected count badge, "Select All" should include visible count.',
        'Consider undo-first pattern for bulk archive — don\'t confirm, just undo. ~200ms animation.',
        'Empty selection state: toolbar should slide down, not disappear abruptly.',
      ],
    },
    {
      id: 'qa-agent',
      name: 'QA Engineer',
      role: 'Quality',
      icon: '◇',
      color: '#06b6d4',
      thoughts: [
        'Test matrix: 0 selected → 1 selected → all selected → deselect all.',
        'Performance: virtual scroll with 1000 rows + bulk select. Watch for re-render on each checkbox.',
        'Edge case: select 50, switch page, come back — is selection preserved?',
        'Accessibility: Shift+Click for range select. Aria-selected on rows.',
      ],
    },
    {
      id: 'swe-agent',
      name: 'SWE',
      role: 'Engineer',
      icon: '⬡',
      color: '#3b82f6',
      thoughts: [
        'Selection state should be in URL params for shareability — ?selected=id1,id2,id3.',
        'Bulk edit API: use PATCH with array of IDs. Don\'t loop individual updates.',
        'TanStack Table already supports row selection. Use getSelectedRowModel().',
        'Watch for N+1 if bulk edit triggers per-row cache invalidation.',
      ],
    },
    {
      id: 'ops-sme',
      name: 'Ops SME',
      role: 'Operations',
      icon: '◈',
      color: '#f59e0b',
      thoughts: [
        'Bulk operations need audit trail — who changed what, when, from what value.',
        'Rate limit bulk API to prevent 500-item updates from hammering the DB.',
        'Consider queuing bulk updates >50 items with progress indicator.',
        'Rollback strategy: bulk undo within 5 minutes.',
      ],
    },
  ],
  'BUG-892': [
    {
      id: 'design-lead',
      name: 'Design Lead',
      role: 'VP Design',
      icon: '◆',
      color: '#a855f7',
      thoughts: [
        'Silent failures are a critical UX debt. Every sync must have visible status.',
        'Add sync status indicator per location — green/amber/red dot in location list.',
        'Error state: inline banner in order detail with "Sync failed — retry" action.',
      ],
    },
    {
      id: 'qa-agent',
      name: 'QA Engineer',
      role: 'Quality',
      icon: '◇',
      color: '#06b6d4',
      thoughts: [
        'BLOCKER: No error logging means we\'re flying blind. First fix must add structured logging.',
        'Need 3-location test fixture with staggered order creation.',
        'Race condition test: simultaneous orders at 2 locations for same inventory.',
        'Regression: verify single-location sync not affected by fix.',
      ],
    },
    {
      id: 'swe-agent',
      name: 'SWE',
      role: 'Engineer',
      icon: '⬡',
      color: '#3b82f6',
      thoughts: [
        'Suspect stale location cache. Check TTL on location-resolver cache.',
        'The sync worker might be swallowing errors in a bare `catch {}` block.',
        'Add circuit breaker pattern — if sync fails 3x for a location, alert and stop retrying.',
        'Needs distributed tracing (Datadog APM) across order-service → sync-worker → POS.',
      ],
    },
    {
      id: 'ops-sme',
      name: 'Ops SME',
      role: 'Operations',
      icon: '◈',
      color: '#f59e0b',
      thoughts: [
        'Revenue at risk: $12K/day. Escalate to P0 immediately.',
        '23 affected retailers — check if they\'re all on the same POS version.',
        'Interim: manual sync script for affected orders while fix is developed.',
        'Post-incident: add sync health monitoring dashboard to Datadog.',
      ],
    },
  ],
};

export const terminalSessions: Record<string, string[]> = {
  'PF-1247': [
    '$ claude --ticket PF-1247 --stage plana',
    '',
    '◆ Contexta Agent — Loading ticket context...',
    '',
    '  Ticket: PF-1247 — Add bulk action toolbar to inventory table',
    '  Type: Product Feedback | Severity: High | Requests: 47',
    '  Affected Users: 340 across 12 enterprise accounts',
    '',
    '  ━━━ Context Gathered ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '  ✓ Scanned 47 feedback requests — consolidated to 3 core needs:',
    '    1. Multi-select rows via checkbox column',
    '    2. Bulk edit (status, category, price) via floating toolbar',
    '    3. Bulk archive with undo capability',
    '',
    '  ✓ Found 3 existing patterns in codebase:',
    '    → src/components/orders/order-table.tsx (single select)',
    '    → src/components/products/product-grid.tsx (multi-select, grid)',
    '    → src/lib/hooks/use-selection.ts (selection hook, reusable)',
    '',
    '  ✓ Existing table uses TanStack Table — row selection is built-in',
    '  ✓ API: PATCH /api/inventory/bulk exists but only supports status changes',
    '',
    '◆ Plana Agent — Generating architecture plan...',
    '',
    '  ┌─ Proposed Architecture ────────────────────────────┐',
    '  │                                                     │',
    '  │  1. Extend use-selection.ts for checkbox column     │',
    '  │  2. New: BulkActionToolbar component (floating)     │',
    '  │  3. New: BulkEditModal (field-specific forms)       │',
    '  │  4. Extend PATCH /api/inventory/bulk                │',
    '  │     → Add: category, price, archive operations      │',
    '  │  5. Add optimistic updates with rollback            │',
    '  │                                                     │',
    '  └─────────────────────────────────────────────────────┘',
    '',
    '  ⚠ HUMAN INPUT NEEDED:',
    '    → Which fields should be bulk-editable?',
    '    → Max batch size for bulk operations?',
    '    → Should bulk archive be soft-delete or hard-delete?',
    '',
    '  Waiting for input...',
  ],
  'BUG-892': [
    '$ claude --ticket BUG-892 --stage contexta',
    '',
    '◆ Contexta Agent — Investigating silent sync failure...',
    '',
    '  Ticket: BUG-892 — Order sync fails silently for multi-location',
    '  Type: Bug | Severity: CRITICAL | Error Rate: 34%',
    '  Revenue at Risk: ~$12K/day',
    '',
    '  ━━━ Investigation Log ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '  ✓ Queried Datadog: order-sync-worker errors last 7 days',
    '    → Found: 0 errors logged (confirms silent failure)',
    '    → Found: 847 orders with sync_status = "pending" > 24h',
    '',
    '  ✓ Traced order flow for affected retailer (Green Leaf PDX):',
    '    → Order created at Location B (SE Portland) ✓',
    '    → order-sync-worker picked up event ✓',
    '    → location-resolver.getCanonicalLocation() returned... null',
    '    → Worker swallowed null with: if (!location) return;',
    '',
    '  ⚠ ROOT CAUSE IDENTIFIED:',
    '    location-resolver service has stale cache (TTL: 24h)',
    '    New locations added < 24h ago get null from cache',
    '    Worker silently skips orders with null location',
    '',
    '  ✓ Confirmed: All 23 affected retailers added locations recently',
    '',
    '  ✗ Missing: Error logging in sync worker catch block',
    '  ✗ Missing: Alerting on sync_status stuck in "pending"',
    '',
    '  ◆ Recommended immediate actions:',
    '    1. Reduce cache TTL from 24h to 5min',
    '    2. Add structured error logging to sync worker',
    '    3. Add Datadog monitor: orders pending > 1h',
    '    4. Manual re-sync of 847 stuck orders',
    '',
    '  ⚠ HUMAN INPUT NEEDED:',
    '    → Confirm cache TTL change won\'t impact performance',
    '    → Approve manual re-sync of stuck orders',
    '    → Incident severity: recommend P0 escalation',
    '',
    '  Waiting for input...',
  ],
};

export function getStageIndex(stage: Stage): number {
  return stages.findIndex(s => s.key === stage);
}

export function getConfidenceColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'high': return '#f59e0b';
    case 'medium': return '#3b82f6';
    case 'low': return '#71717a';
  }
}

export function getHumanInputColor(level: string): string {
  switch (level) {
    case 'none': return '#22c55e';
    case 'low': return '#22c55e';
    case 'medium': return '#f59e0b';
    case 'high': return '#ef4444';
    default: return '#71717a';
  }
}
