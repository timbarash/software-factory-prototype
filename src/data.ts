export type TicketType = 'BUG' | 'PF';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Stage = 'contexta' | 'plana' | 'bilda' | 'qa' | 'merge';

export interface AgentAssessment {
  agent: string;
  readiness: number; // 0-100
  humanInput: 'none' | 'low' | 'medium' | 'high';
  summary: string;
}

export interface ComplianceFlag {
  jurisdiction: string;
  system: string;
  risk: 'clear' | 'warning' | 'violation';
  detail: string;
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
  complianceFlags?: ComplianceFlag[];
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
    complexityScore: 3,
    complianceFlags: [
      { jurisdiction: 'All States', system: 'Metrc/BioTrack', risk: 'warning', detail: 'Bulk archive must maintain audit trail for track-and-trace compliance' },
      { jurisdiction: 'Oregon', system: 'OLCC', risk: 'warning', detail: 'Bulk price edits may trigger Metrc price-point update reporting' },
    ],
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
    complexityScore: 5,
    complianceFlags: [
      { jurisdiction: 'Colorado', system: 'MED/Metrc', risk: 'violation', detail: 'Order sync failure causing Metrc report divergence across locations — active violation risk' },
      { jurisdiction: 'Oregon', system: 'OLCC/Metrc', risk: 'violation', detail: 'Unsynced orders may not report to state track-and-trace system' },
      { jurisdiction: 'California', system: 'DCC/CCTT', risk: 'warning', detail: 'Multi-location inventory counts may mismatch state records' },
    ],
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
    complexityScore: 3,
    complianceFlags: [
      { jurisdiction: 'All States', system: 'Metrc', risk: 'warning', detail: 'Inventory threshold alerts must not expose track-and-trace package IDs in notifications' },
    ],
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
    complexityScore: 2,
    complianceFlags: [
      { jurisdiction: 'All States', system: 'PCI-DSS', risk: 'warning', detail: 'Async fraud check changes PCI compliance boundary — webhook must not log card data' },
    ],
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
    complexityScore: 1,
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
    complexityScore: 2,
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
    complexityScore: 4,
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
        'Floating toolbar at page bottom, not fixed header — matches mental model of "I selected these, now what?" Linear does this well.',
        'Inventory managers live in this table 6+ hours/day. Every pixel matters. Show selected count inline, not in a toast.',
        'Undo-first for bulk archive. Don\'t make them confirm 200 items. Show a 5-second undo bar. Confidence through reversibility.',
        'When nothing is selected the toolbar should feel like it was never there — no empty shell, no ghost UI.',
      ],
    },
    {
      id: 'qa-agent',
      name: 'QA Engineer',
      role: 'Quality',
      icon: '◇',
      color: '#06b6d4',
      thoughts: [
        'Test matrix: 0 → 1 → page-full → cross-page → all → deselect. Each transition is a different code path.',
        'Perf concern: virtual scroll + 1000 rows + bulk select. If checkbox toggle causes full re-render we\'ll see 200ms jank on mid-tier devices.',
        'Shift+Click range select is expected by power users. Also test: select 50, navigate away, come back — is state preserved?',
        'Concurrent edit: user A bulk-archives, user B is editing one of those items. Need optimistic rollback test.',
      ],
    },
    {
      id: 'swe-agent',
      name: 'SWE',
      role: 'Engineer',
      icon: '⬡',
      color: '#3b82f6',
      thoughts: [
        'TanStack Table has getSelectedRowModel() built in. Don\'t reinvent selection — wire into existing use-selection.ts hook.',
        'Bulk edit needs a single PATCH with ID array, not N individual requests. Current /api/inventory/bulk only handles status — extend to category + price.',
        'Watch the cache invalidation path. If bulk edit triggers per-row invalidation that\'s N queries. Batch the cache bust.',
        'Selection state in URL params (?selected=id1,id2) makes it shareable between team members. Low effort, high utility.',
      ],
    },
    {
      id: 'cannabiz-sme',
      name: 'Cannabiz SME',
      role: 'Industry Expert',
      icon: '◈',
      color: '#f59e0b',
      thoughts: [
        'Retailers receiving 200+ SKU shipments on delivery day need this badly. Right now a budtender spends 45min updating items one-by-one instead of serving customers.',
        'Bulk price edit is the #1 ask — dispensaries adjust prices weekly for promotions and state-by-state pricing differs. Make "price" the first bulk-editable field.',
        'Cannabis inventory has compliance implications. Bulk archive needs an audit trail for Metrc/BioTrack — "who archived what and when" or regulators flag it.',
        'Multi-location brands will try to bulk-edit across locations. Scope this to single-location first — cross-location price sync is a different beast with different state regs.',
      ],
    },
    {
      id: 'compliance-ghost',
      name: 'Compliance Ghost',
      role: 'Regulatory Auditor',
      icon: '👻',
      color: '#ec4899',
      thoughts: [
        'FLAGGED: Bulk archive touches inventory quantity fields — this codepath reports to Metrc in 28 states. Any archive operation must write a corresponding Metrc adjustment event or the state record diverges.',
        'Bulk price edit triggers OLCC price-point reporting in Oregon. The current /api/inventory/bulk endpoint does not call the Metrc price update webhook — this must be added before launch.',
        'CLEAR: Bulk status change (active/inactive) does not touch any compliance-sensitive codepaths. Safe to ship without additional regulatory checks.',
        'RECOMMENDATION: Add a pre-commit hook that detects changes to files in /src/services/inventory/ and auto-flags for compliance review. 14 of the last 20 compliance incidents originated in this directory.',
      ],
    },
  ],
  'PF-1251': [
    {
      id: 'design-lead', name: 'Design Lead', role: 'VP Design', icon: '◆', color: '#a855f7',
      thoughts: [
        'Threshold config needs to feel lightweight — a slider per SKU, not a form. Inline editing right in the inventory table row.',
        'Notification center is cluttered. Low-stock alerts should be a separate "Inventory" tab, not mixed with order notifications.',
        'The alert should link directly to the reorder page for that SKU. One tap from "low stock" to "reorder submitted."',
      ],
    },
    {
      id: 'qa-agent', name: 'QA Engineer', role: 'Quality', icon: '◇', color: '#06b6d4',
      thoughts: [
        'Load test: 10K concurrent threshold checks with 500 breaches. Worker must not queue-bomb the notification service.',
        'Email delivery: verify SendGrid webhook confirms delivery. We had a silent bounce issue in Q3 with dispensary email domains.',
        'Edge case: threshold set to 0 (always alert) and threshold set to max (never alert). Both should be valid.',
      ],
    },
    {
      id: 'swe-agent', name: 'SWE', role: 'Engineer', icon: '⬡', color: '#3b82f6',
      thoughts: [
        'Worker polling every 30s at scale is wasteful. Consider CDC (Change Data Capture) from inventory_updates table instead — only check on actual quantity changes.',
        'WebSocket payload should be minimal: { sku_id, current_qty, threshold, location_id }. Let the frontend fetch display data.',
        'SendGrid template rendering is slow (~200ms). Pre-render and cache templates on worker startup.',
      ],
    },
    {
      id: 'cannabiz-sme', name: 'Cannabiz SME', role: 'Industry Expert', icon: '◈', color: '#f59e0b',
      thoughts: [
        'This is the #1 feature request from multi-location brands. They lose $2K-5K per stockout event because customers walk to a competitor.',
        'Dispensaries reorder on different schedules — daily for flower, weekly for edibles, monthly for accessories. Thresholds need to be category-aware.',
        'Some states require minimum inventory levels for certain product categories (medical-only items). This could auto-flag compliance too.',
        'Budtenders shouldn\'t see these alerts — only managers and buyers. Role-based alert routing is critical.',
      ],
    },
  ],
  'BUG-901': [
    {
      id: 'design-lead', name: 'Design Lead', role: 'VP Design', icon: '◆', color: '#a855f7',
      thoughts: [
        'The "pending" state UI needs to feel trustworthy. Show a progress indicator, estimated time, and "Your order is being verified" — not a spinner with no context.',
        'If fraud check takes >10s, proactively show a message: "High-value orders require additional verification. This usually takes 30-60 seconds."',
        'The split-order workaround that customers found is actually clever. Consider making it a real feature: "Split into 2 payments?"',
      ],
    },
    {
      id: 'qa-agent', name: 'QA Engineer', role: 'Quality', icon: '◇', color: '#06b6d4',
      thoughts: [
        'Boundary testing: $4,999.99, $5,000.00, $5,000.01. The threshold must be exact, not floating-point fuzzy.',
        'Webhook retry: if fraud service returns 503, we retry 3x with exponential backoff. Test all 3 retries + final failure path.',
        'Concurrent test caught a serialization bug — single-worker queue. Good catch. Verify 4 workers don\'t introduce race conditions.',
      ],
    },
    {
      id: 'swe-agent', name: 'SWE', role: 'Engineer', icon: '⬡', color: '#3b82f6',
      thoughts: [
        'The fraud check queue was bottlenecked at 1 worker — that\'s a deploy-time config, not a code bug. Bumped to 4 with connection pooling.',
        'Webhook handler needs idempotency key. If fraud service retries their callback, we\'d double-process. Using order_id + check_id composite.',
        'Consider circuit breaker on the fraud API. If it\'s down, fall back to amount-based auto-approve under $10K with manual review queue.',
      ],
    },
    {
      id: 'cannabiz-sme', name: 'Cannabiz SME', role: 'Industry Expert', icon: '◈', color: '#f59e0b',
      thoughts: [
        'High-value orders are usually B2B: dispensary-to-distributor purchases. These buyers expect same-day processing — timeout means they order from a competitor.',
        '$5K is actually low for wholesale. A single pallet of pre-rolls can be $15K. Threshold should probably be $10K or configurable per account type.',
        'Payment timeouts during peak hours (10am-2pm) are devastating. That\'s when wholesale buyers place morning orders. This is costing real revenue.',
        'Some dispensaries pre-pay via ACH for large orders. Could we detect payment method and skip fraud check for verified ACH accounts?',
      ],
    },
  ],
  'PF-1239': [
    {
      id: 'design-lead', name: 'Design Lead', role: 'VP Design', icon: '◆', color: '#a855f7',
      thoughts: [
        'Clean implementation. Column selector is smart — remembers last selection per user. Export button placement in the report header is correct.',
        'One polish item: add a progress indicator for exports >10K rows. Currently it looks frozen for 2-3 seconds on large datasets.',
      ],
    },
    {
      id: 'cannabiz-sme', name: 'Cannabiz SME', role: 'Industry Expert', icon: '◈', color: '#f59e0b',
      thoughts: [
        'Dispensary accountants have been begging for this. Currently they screenshot reports or manually transcribe into QuickBooks. This saves hours/week.',
        'Date range picker should default to "last month" — that\'s the most common export for monthly reporting to ownership and state regulators.',
        'Column selection matters because different states require different report fields. Oregon needs different columns than Colorado.',
      ],
    },
  ],
  'BUG-887': [
    {
      id: 'design-lead', name: 'Design Lead', role: 'VP Design', icon: '◆', color: '#a855f7',
      thoughts: [
        'Chart flicker is a CLS (Cumulative Layout Shift) problem. Google Lighthouse would flag this. Debounced ResizeObserver is the right fix.',
        'While we\'re in here: the charts should animate data transitions, not just appear. Add 300ms ease-out on data changes.',
      ],
    },
    {
      id: 'swe-agent', name: 'SWE', role: 'Engineer', icon: '⬡', color: '#3b82f6',
      thoughts: [
        'useResizeObserver with 150ms debounce is the standard pattern. Should wrap this in a shared hook since we\'ll use it everywhere.',
        'The Recharts ResponsiveContainer was doing its own resize handling poorly. By owning the dimensions ourselves we get better control.',
        'Consider: could we replace Recharts entirely with Visx? Better perf, tree-shakeable, and we already have D3 as a dep.',
      ],
    },
    {
      id: 'cannabiz-sme', name: 'Cannabiz SME', role: 'Industry Expert', icon: '◈', color: '#f59e0b',
      thoughts: [
        'Dashboard is the first thing dispensary owners see every morning. Flickering charts erode trust in the data — "is this number right or still loading?"',
        'Multi-monitor setups are common in back-offices. Managers resize windows constantly when referencing POS on one screen and dashboard on another.',
      ],
    },
  ],
  'PF-1255': [
    {
      id: 'swe-agent', name: 'SWE', role: 'Engineer', icon: '⬡', color: '#3b82f6',
      thoughts: [
        'Redis sliding window is already emitting per-key metrics to Datadog. We can query those directly instead of building a separate metrics store.',
        'For retention beyond 30 days, we\'d need to aggregate hourly/daily into Postgres. That\'s a new service — scope carefully.',
        'The dashboard should be a separate React app deployed to partners.dutchie.com, not embedded in the main admin UI.',
      ],
    },
    {
      id: 'cannabiz-sme', name: 'Cannabiz SME', role: 'Industry Expert', icon: '◈', color: '#f59e0b',
      thoughts: [
        'Integration partners include POS systems, delivery services, and compliance platforms. They each have very different usage patterns.',
        'Top partner concern: "Why am I getting rate limited?" They need to see which endpoints are consuming their quota, not just total count.',
        'Self-serve limit increase requests would reduce support tickets by ~40%. Currently it\'s a manual email to partnerships@dutchie.com.',
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
        'Silent failures are the worst UX debt. A dispensary manager thinks the order went through — then a customer shows up and it\'s not there.',
        'Sync status needs to be visible per-location: green/amber/red dot in the location switcher. Not buried in settings.',
        'Error recovery must be inline. "Sync failed — retry now" right on the order, not a notification they might miss during a rush.',
        'When sync is working, it should be invisible. When it breaks, it should be unmissable. Asymmetric visibility.',
      ],
    },
    {
      id: 'qa-agent',
      name: 'QA Engineer',
      role: 'Quality',
      icon: '◇',
      color: '#06b6d4',
      thoughts: [
        'BLOCKER: Zero error logging on this path means any fix we ship is unverifiable. Step 1 is structured logging, before any code change.',
        'Need a 3-location test fixture: HQ + 2 satellite stores with staggered order creation at 5-second intervals.',
        'Race condition: two locations sell the same product simultaneously. Does inventory deduct correctly, or does one order ghost?',
        'Regression: single-location retailers must not be affected. They\'re 70% of the base and currently working fine.',
      ],
    },
    {
      id: 'swe-agent',
      name: 'SWE',
      role: 'Engineer',
      icon: '⬡',
      color: '#3b82f6',
      thoughts: [
        'Found it: location-resolver cache has 24h TTL. New locations return null from cache, and the sync worker does `if (!location) return;` — silent skip.',
        'The catch block in sync-worker.ts is bare: `catch {}`. Literally swallowing every error. That\'s why Datadog shows 0 errors.',
        'Fix: reduce cache TTL to 5min, add cache-aside pattern for location lookups, and replace bare catch with structured error + Datadog metric.',
        'We need distributed tracing across order-service → sync-worker → POS-adapter. Without it we\'re guessing at latency attribution.',
      ],
    },
    {
      id: 'cannabiz-sme',
      name: 'Cannabiz SME',
      role: 'Industry Expert',
      icon: '◈',
      color: '#f59e0b',
      thoughts: [
        'This is a real-money emergency. Dispensaries running 3+ locations are losing $12K/day in unsynced orders. Customers order online, show up, product isn\'t there.',
        'Multi-location is growing fast — brands are opening 2nd and 3rd stores quarterly. This bug will hit more retailers every week we don\'t fix it.',
        'Compliance angle: if orders aren\'t syncing to POS, those sales may not be reported to the state tracking system. That\'s a regulatory violation.',
        'Affected retailers like Green Leaf PDX are high-value accounts ($40K+ MRR). Losing one of them to this bug costs more than the fix.',
      ],
    },
    {
      id: 'compliance-ghost',
      name: 'Compliance Ghost',
      role: 'Regulatory Auditor',
      icon: '👻',
      color: '#ec4899',
      thoughts: [
        'VIOLATION RISK — ACTIVE: Order sync failure is causing Metrc track-and-trace reports to diverge across locations in Colorado and Oregon. If a state auditor pulls reports during this window, affected retailers face Category 2 violations ($5K-$50K fines per incident).',
        'Scanned order-sync-worker.go: the sync pathway calls inventory.Deduct() without a corresponding Metrc.ReportSale() for the destination location. This means successfully synced orders also have a reporting gap — the bug is worse than the ticket describes.',
        'JURISDICTIONS AT RISK: Colorado (MED), Oregon (OLCC), California (DCC). Washington uses Leaf Data Systems with a different reporting cadence — lower immediate risk but still non-compliant.',
        'RECOMMENDATION: After fixing the sync bug, run a reconciliation job comparing Dutchie order records against Metrc reported sales for all multi-location retailers in the last 30 days. Any discrepancies must be filed as amended reports before the next state audit window.',
      ],
    },
  ],
};

export const terminalSessions: Record<string, string[]> = {
  'PF-1247': [
    '$ claude --ticket PF-1247 --stage plana',
    '',
    '⟡ thinking',
    '  Analyzing 47 feedback requests for bulk action patterns.',
    '  Need to check existing table infrastructure and API surface.',
    '',
    '  ⚙ Grep "useSelection\\|getSelectedRow" src/components/',
    '  ↳ src/components/orders/order-table.tsx:42 — useSelection()',
    '  ↳ src/components/products/product-grid.tsx:18 — useSelection({ multi: true })',
    '  ↳ src/lib/hooks/use-selection.ts — full hook (87 lines)',
    '',
    '  ⚙ Read src/lib/hooks/use-selection.ts',
    '  ↳ TanStack Table integration, supports single + multi mode.',
    '  ↳ Missing: checkbox column renderer, bulk action dispatch',
    '',
    '  ⚙ Read src/api/routes/inventory.go:184-220',
    '  ↳ PATCH /api/inventory/bulk — only handles { ids: [], status: string }',
    '  ↳ No support for category, price, or archive operations',
    '',
    '  ✓ Scanned 47 feedback requests — 3 core needs:',
    '    → Multi-select rows via checkbox column',
    '    → Bulk edit (status, category, price) via floating toolbar',
    '    → Bulk archive with undo capability',
    '',
    '⟡ thinking',
    '  Found reusable selection hook. Table already uses TanStack.',
    '  Need to extend the Go bulk endpoint and add 2 new React components.',
    '',
    '◆ Plana Agent — Architecture plan ready.',
    '',
    '  ┌─ Implementation Plan ─────────────────────────────────┐',
    '  │  1. Extend use-selection.ts — add checkbox column     │',
    '  │  2. New: BulkActionToolbar.tsx (floating, bottom)     │',
    '  │  3. New: BulkEditModal.tsx (field-specific forms)     │',
    '  │  4. Extend PATCH /api/inventory/bulk in inventory.go  │',
    '  │     + category, price, archive operations             │',
    '  │  5. Add optimistic updates with rollback on 4xx/5xx   │',
    '  └───────────────────────────────────────────────────────┘',
    '',
    '  ⚙ Bash git log --oneline -5 -- src/api/routes/inventory.go',
    '  ↳ a3f2c1d fix: inventory bulk status 404 on missing IDs',
    '  ↳ 8b1e4f7 feat: add bulk status change endpoint',
    '  ↳ f2d9a0c refactor: extract inventory service layer',
    '',
    '  ⚠ HUMAN INPUT NEEDED:',
    '    → Which fields should be bulk-editable? (price, category, status confirmed — anything else?)',
    '    → Max batch size? (current: unlimited — recommend 500)',
    '    → Bulk archive: soft-delete (set archived_at) or hard-delete?',
    '',
    '  Waiting for human decision before Bilda can scaffold...',
  ],
  'BUG-892': [
    '$ claude --ticket BUG-892 --stage contexta',
    '',
    '⟡ thinking',
    '  Critical sync failure, 0 errors in Datadog. Silent failure pattern.',
    '  Need to trace order lifecycle across services.',
    '',
    '  ⚙ Bash curl -s "https://app.datadoghq.com/api/v1/query?query=sum:order_sync.errors{service:order-sync-worker}.rollup(sum,86400)&from=$(($(date +%s)-604800))&to=$(date +%s)" | jq .series[0].pointlist[-7:]',
    '  ↳ [[1710288000, 0], [1710374400, 0], [1710460800, 0], [1710547200, 0], [1710633600, 0], [1710720000, 0], [1710806400, 0]]',
    '  ↳ Zero errors logged in 7 days — confirms silent failure',
    '',
    '  ⚙ Bash psql dutchie_orders -c "SELECT COUNT(*) FROM orders WHERE sync_status = \'pending\' AND created_at < NOW() - INTERVAL \'24 hours\'"',
    '  ↳ count: 847',
    '',
    '  ⚙ Grep "func.*syncOrder" services/order-sync-worker/',
    '  ↳ services/order-sync-worker/worker.go:67 — func (w *Worker) syncOrder(ctx context.Context, order Order) error',
    '',
    '  ⚙ Read services/order-sync-worker/worker.go:67-112',
    '  ↳ L78: loc, err := w.locationResolver.GetCanonical(ctx, order.LocationID)',
    '  ↳ L79: if loc == nil { return nil }  // ← SILENT SKIP',
    '  ↳ L89: catch {} // ← BARE CATCH, swallows all errors',
    '',
    '⟡ thinking',
    '  Found it. location-resolver returns nil for new locations due to',
    '  24h cache TTL. Worker treats nil as "skip" instead of "error".',
    '  The bare catch block means even real errors are swallowed.',
    '',
    '  ⚙ Read services/location-resolver/cache.go:14-30',
    '  ↳ L18: const cacheTTL = 24 * time.Hour  // ← Problem',
    '  ↳ L22: func (c *Cache) Get(ctx context.Context, id string) (*Location, error)',
    '  ↳ L28: return nil, nil // cache miss returns nil, nil — no error',
    '',
    '  ⚙ Bash psql dutchie_core -c "SELECT id, name, created_at FROM locations WHERE created_at > NOW() - INTERVAL \'48 hours\' ORDER BY created_at DESC LIMIT 5"',
    '  ↳ Green Leaf PDX - SE Portland  | created 6h ago',
    '  ↳ Emerald City Cannabis - Loc 3 | created 14h ago',
    '  ↳ Rocky Mountain Dispensary #4  | created 22h ago',
    '',
    '  ✓ Confirmed: all 23 affected retailers added locations <24h ago',
    '  ✗ Missing: error logging in sync worker catch block',
    '  ✗ Missing: alerting on sync_status stuck in "pending"',
    '',
    '  👻 COMPLIANCE GHOST: 3 jurisdictions at active violation risk',
    '  👻 CO (MED/Metrc), OR (OLCC), CA (DCC) — order reporting gap',
    '',
    '  ⚠ HUMAN INPUT NEEDED:',
    '    → Approve cache TTL reduction 24h → 5min',
    '    → Approve manual re-sync of 847 stuck orders',
    '    → Recommend P0 escalation — revenue impact $12K/day',
  ],
  'PF-1251': [
    '$ claude --ticket PF-1251 --stage bilda',
    '',
    '⟡ thinking',
    '  Threshold config UI is done. Worker is 80% complete.',
    '  Need to finish email templates and notification center integration.',
    '',
    '  ⚙ Read src/components/inventory/threshold-config.tsx',
    '  ↳ 142 lines — per-SKU threshold slider with min/max/reorder point',
    '  ↳ Uses React Hook Form + Zod validation. Looks solid.',
    '',
    '  ⚙ Read services/inventory-alerts/worker.go:1-40',
    '  ↳ Polls inventory_thresholds table every 30s',
    '  ↳ Compares current_quantity against threshold_min',
    '  ↳ Dispatches alert via NotificationService.Send()',
    '',
    '  ⚙ Grep "SendGrid\\|sendgrid" services/notifications/',
    '  ↳ services/notifications/email.go:12 — SendGrid client init',
    '  ↳ services/notifications/templates/ — 4 existing templates',
    '',
    '  ✓ Threshold config UI — complete',
    '  ✓ Worker polling logic — complete',
    '  ✓ WebSocket push — wired to existing ws-gateway',
    '  ⏳ Email template for low-stock alert — scaffolding now',
    '',
    '  ⚙ Edit services/notifications/templates/low-stock-alert.html',
    '  ↳ Created template: subject, SKU name, current qty, threshold, reorder link',
    '',
    '  ⚙ Edit services/notifications/email.go:45-62',
    '  ↳ Added SendLowStockAlert() method — takes ThresholdBreach struct',
    '',
    '  ⚙ Bash cd services/inventory-alerts && go test ./... -v -count=1',
    '  ↳ PASS: TestWorkerPollsThresholds (0.12s)',
    '  ↳ PASS: TestAlertDispatchOnBreach (0.08s)',
    '  ↳ PASS: TestNoAlertAboveThreshold (0.03s)',
    '  ↳ FAIL: TestEmailTemplateRendering — missing SKU image URL field',
    '',
    '⟡ thinking',
    '  Test failure on template rendering. Need to add sku_image_url to the',
    '  ThresholdBreach struct and pass it through to the template.',
    '',
    '  ⚙ Edit services/inventory-alerts/types.go:18',
    '  ↳ Added SKUImageURL string field to ThresholdBreach',
    '',
    '  ⚙ Bash cd services/inventory-alerts && go test ./... -v -count=1',
    '  ↳ PASS: TestEmailTemplateRendering (0.04s)',
    '  ↳ ok  services/inventory-alerts 0.27s — all 4 tests passing',
    '',
    '  Remaining: notification center UI integration. Estimating 1 more file.',
  ],
  'BUG-901': [
    '$ claude --ticket BUG-901 --stage qa',
    '',
    '⟡ thinking',
    '  Async fraud check is implemented. Need to validate timeout scenarios',
    '  at the boundary values and test webhook retry behavior.',
    '',
    '  ⚙ Read services/payments/fraud_check.go:1-50',
    '  ↳ L12: FraudCheckAsync() — sends to fraud-check queue, returns pending',
    '  ↳ L28: Webhook handler at /webhooks/fraud-result',
    '  ↳ L35: Updates order status: pending → approved/rejected',
    '',
    '  ⚙ Bash cd services/payments && go test -run TestFraudCheck -v -count=1',
    '  ↳ PASS: TestFraudCheckAsync_UnderThreshold ($4,999) — 0.02s',
    '  ↳ PASS: TestFraudCheckAsync_AtThreshold ($5,000) — 0.03s',
    '  ↳ PASS: TestFraudCheckAsync_OverThreshold ($10,000) — 0.02s',
    '  ↳ PASS: TestFraudCheckAsync_WebhookApproved — 0.01s',
    '  ↳ PASS: TestFraudCheckAsync_WebhookRejected — 0.01s',
    '  ↳ PASS: TestFraudCheckAsync_WebhookTimeout — 0.04s',
    '',
    '  ✓ All fraud check unit tests passing',
    '',
    '  ⚙ Bash cd e2e && npx playwright test payments --project=chromium',
    '  ↳ Running 8 tests using 2 workers',
    '  ↳ ✓ payment-flow.spec.ts:12 — standard order ($200) — 3.2s',
    '  ↳ ✓ payment-flow.spec.ts:28 — high-value order ($6,500) — 4.1s',
    '  ↳ ✓ payment-flow.spec.ts:45 — boundary order ($5,000) — 3.8s',
    '  ↳ ✓ payment-flow.spec.ts:61 — pending state UI renders — 2.1s',
    '  ↳ ✓ payment-flow.spec.ts:78 — webhook retry on 5xx — 5.4s',
    '  ↳ ✓ payment-flow.spec.ts:94 — fraud rejection flow — 3.0s',
    '  ↳ ✗ payment-flow.spec.ts:110 — concurrent high-value orders — timeout',
    '  ↳ ✓ payment-flow.spec.ts:126 — split order workaround still works — 2.8s',
    '',
    '  ✗ 1 failure: concurrent high-value orders test timed out at 30s',
    '',
    '⟡ thinking',
    '  Concurrent test failing — two $7K orders submitted simultaneously.',
    '  Likely the fraud check queue is serializing. Need to check worker pool.',
    '',
    '  ⚙ Read services/payments/fraud_queue.go:22-35',
    '  ↳ L24: workerPool: 1  // ← Single worker! Serializes all fraud checks',
    '',
    '  ⚙ Edit services/payments/fraud_queue.go:24',
    '  ↳ Changed workerPool from 1 to 4',
    '',
    '  ⚙ Bash cd e2e && npx playwright test payments --project=chromium --grep "concurrent"',
    '  ↳ ✓ payment-flow.spec.ts:110 — concurrent high-value orders — 6.2s',
    '',
    '  ✓ All 8 payment e2e tests passing. Ready for merge review.',
    '',
    '  👻 COMPLIANCE: PCI-DSS boundary check — webhook endpoint verified',
    '  👻 No card data in fraud check queue payload. Using tokenized reference.',
  ],
  'PF-1239': [
    '$ claude --ticket PF-1239 --stage merge',
    '',
    '  ✓ All implementation complete. Running final checks.',
    '',
    '  ⚙ Bash cd services/reports && go test ./... -v -count=1',
    '  ↳ ok  services/reports/csv 0.34s — 12/12 tests passing',
    '',
    '  ⚙ Bash cd e2e && npx playwright test reports --project=chromium',
    '  ↳ ✓ csv-export.spec.ts — 6/6 tests passing',
    '  ↳ Including: 50K row export (4.2s), special chars, date boundaries',
    '',
    '  ⚙ Bash git diff --stat origin/main..HEAD',
    '  ↳  src/components/reports/ExportButton.tsx      |  89 +++',
    '  ↳  src/components/reports/ColumnSelector.tsx     |  67 +++',
    '  ↳  src/components/reports/DateRangePicker.tsx    |  54 +++',
    '  ↳  src/lib/csv-stream.ts                        |  43 +++',
    '  ↳  services/reports/csv/handler.go              |  78 +++',
    '  ↳  services/reports/csv/handler_test.go         | 112 +++',
    '  ↳  e2e/csv-export.spec.ts                       |  96 +++',
    '  ↳  7 files changed, 539 insertions(+)',
    '',
    '  ✓ Lint: 0 errors, 0 warnings',
    '  ✓ TypeScript: 0 errors',
    '  ✓ Go vet: clean',
    '  ✓ No secrets detected (gitleaks)',
    '  ✓ Bundle size delta: +2.1KB gzipped',
    '',
    '  ◆ PR #4127 created — "feat: CSV export for sales reports"',
    '  ◆ CI pipeline: all green. 2 approvals received.',
    '  ◆ Ready to merge. No human input required.',
  ],
  'BUG-887': [
    '$ claude --ticket BUG-887 --stage bilda',
    '',
    '⟡ thinking',
    '  Chart flicker on resize. Recharts ResponsiveContainer remounts.',
    '  Need to wrap in ResizeObserver with debounce. 4 components affected.',
    '',
    '  ⚙ Grep "ResponsiveContainer" src/components/dashboard/',
    '  ↳ src/components/dashboard/sales-chart.tsx:14',
    '  ↳ src/components/dashboard/revenue-chart.tsx:18',
    '  ↳ src/components/dashboard/velocity-chart.tsx:22',
    '  ↳ src/components/dashboard/conversion-chart.tsx:11',
    '',
    '  ⚙ Read src/components/dashboard/sales-chart.tsx',
    '  ↳ Direct <ResponsiveContainer> wrapping <BarChart>',
    '  ↳ No debounce, no memoization. Remounts on every pixel.',
    '',
    '  ⚙ Edit src/lib/hooks/use-resize-observer.ts',
    '  ↳ Created hook: useResizeObserver(ref, { debounce: 150 })',
    '  ↳ Returns { width, height } — only updates after debounce settles',
    '',
    '  ⚙ Edit src/components/dashboard/sales-chart.tsx',
    '  ↳ Replaced ResponsiveContainer with useResizeObserver hook',
    '  ↳ Chart now receives explicit width/height props, no remount',
    '',
    '  ⚙ Edit src/components/dashboard/conversion-chart.tsx',
    '  ↳ Same pattern applied. Chart stable on resize.',
    '',
    '  ✓ sales-chart.tsx — migrated',
    '  ✓ conversion-chart.tsx — migrated',
    '  ⏳ revenue-chart.tsx — next',
    '  ⏳ velocity-chart.tsx — next',
    '',
    '  ⚙ Bash cd src && npx vitest run --reporter=verbose dashboard/',
    '  ↳ ✓ sales-chart.test.tsx — renders without flicker (0.8s)',
    '  ↳ ✓ conversion-chart.test.tsx — resize stable (0.6s)',
    '  ↳ 2/4 charts migrated. Continuing with remaining 2...',
  ],
  'PF-1255': [
    '$ claude --ticket PF-1255 --stage contexta',
    '',
    '⟡ thinking',
    '  API rate limiting dashboard for partners. 18 requests, early stage.',
    '  Need to understand current rate limiting infra and what metrics exist.',
    '',
    '  ⚙ Grep "rateLimiter\\|RateLimit" services/api-gateway/',
    '  ↳ services/api-gateway/middleware/rate_limiter.go:8 — type RateLimiter struct',
    '  ↳ services/api-gateway/middleware/rate_limiter.go:42 — Redis sliding window',
    '  ↳ services/api-gateway/config.go:18 — default: 1000 req/min per API key',
    '',
    '  ⚙ Read services/api-gateway/middleware/rate_limiter.go:8-55',
    '  ↳ Redis sliding window counter per API key',
    '  ↳ Returns X-RateLimit-Remaining, X-RateLimit-Reset headers',
    '  ↳ Emits datadog metric: api_gateway.rate_limit.{allowed,rejected}',
    '',
    '  ⚙ Bash curl -s "https://app.datadoghq.com/api/v1/query?query=sum:api_gateway.rate_limit.rejected{*}.rollup(sum,3600).as_count()&from=$(($(date +%s)-604800))&to=$(date +%s)" | jq ".series[0].pointlist | length"',
    '  ↳ 168 data points — rate limit rejections exist but are sparse',
    '',
    '  ✓ Rate limiter exists (Redis sliding window, 1000 req/min default)',
    '  ✓ Datadog metrics available: allowed/rejected per API key',
    '  ✗ No partner-facing dashboard exists',
    '  ✗ No per-partner usage history beyond Datadog (30-day retention)',
    '',
    '  ⚠ HUMAN INPUT NEEDED:',
    '    → Which metrics should partners see? (req count, error rate, latency, quota usage)',
    '    → Retention: 30 days (match Datadog) or longer?',
    '    → Real-time WebSocket updates or polling?',
    '    → Should partners be able to request limit increases in-app?',
    '',
    '  ⏳ Waiting for product decisions before planning architecture...',
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
