import { useState, useCallback, useRef } from 'react'
import { Ticket, stages, getStageIndex, expertAgents, terminalSessions } from './data'

// ── Simulated Claude responses per ticket, keyed by ticket ID ──
// Each entry is an array of "response sets" — we cycle through them on each user message.
// Each response set is an array of terminal lines that get typed out.

const simulatedResponses: Record<string, string[][]> = {
  'BUG-892': [
    [
      '',
      '⟡ thinking',
      '  Investigating the sync failure path. Let me trace the order lifecycle',
      '  from creation to POS sync for multi-location retailers.',
      '',
      '  ⚙ Read services/order-sync-worker/worker.go:67-95',
      '  ↳ L78: loc, err := w.locationResolver.GetCanonical(ctx, order.LocationID)',
      '  ↳ L79: if loc == nil { return nil }  // silent skip when location not cached',
      '  ↳ L89: catch {} // bare catch — swallows all errors',
      '',
      '  ⚙ Grep "cacheTTL" services/location-resolver/',
      '  ↳ services/location-resolver/cache.go:18 — const cacheTTL = 24 * time.Hour',
      '',
      '  ✓ Root cause confirmed: 24h cache TTL on location resolver',
      '  ✗ New locations return nil from cache, sync worker silently skips',
      '  ✗ Bare catch block swallows all downstream errors',
      '',
      '  👻 COMPLIANCE: Metrc divergence detected across CO, OR, CA locations',
      '  👻 Estimated 847 orders unreported to state track-and-trace systems',
      '',
      '  ⚠ Recommended fix:',
      '    → Reduce cache TTL from 24h to 5min',
      '    → Add cache-aside pattern for location miss → DB fallback',
      '    → Replace bare catch with structured error + DD metric',
      '    → Run reconciliation job for 847 stuck orders',
    ],
    [
      '',
      '⟡ thinking',
      '  Let me check the impact radius and verify the fix approach.',
      '',
      '  ⚙ Bash psql dutchie_orders -c "SELECT location_id, COUNT(*) FROM orders WHERE sync_status = \'pending\' GROUP BY location_id ORDER BY count DESC LIMIT 10"',
      '  ↳ loc_4f2a (Green Leaf PDX - SE)     | 312 stuck orders',
      '  ↳ loc_8b1c (Emerald City Cannabis #3) | 289 stuck orders',
      '  ↳ loc_d3e7 (Rocky Mountain Disp #4)  | 246 stuck orders',
      '',
      '  ⚙ Read services/location-resolver/cache.go:14-40',
      '  ↳ Redis-backed cache with no fallback on miss',
      '  ↳ Get() returns (nil, nil) on cache miss — caller can\'t distinguish "not found" from "not cached"',
      '',
      '  ⚙ Edit services/location-resolver/cache.go:18',
      '  ↳ Changed: cacheTTL = 24 * time.Hour → cacheTTL = 5 * time.Minute',
      '',
      '  ⚙ Edit services/location-resolver/cache.go:22-30',
      '  ↳ Added cache-aside: on miss, query DB directly, populate cache, return',
      '',
      '  ⚙ Bash cd services/location-resolver && go test ./... -v -count=1',
      '  ↳ PASS: TestCacheHit (0.01s)',
      '  ↳ PASS: TestCacheMissFallsBackToDB (0.03s)',
      '  ↳ PASS: TestNewLocationResolvesImmediately (0.02s)',
      '  ↳ ok  services/location-resolver 0.06s',
      '',
      '  ✓ Cache TTL reduced, fallback added, all tests passing.',
      '  ⏳ Next: fix the bare catch in sync worker and add structured logging.',
    ],
    [
      '',
      '⟡ thinking',
      '  Now fixing the sync worker error handling and adding observability.',
      '',
      '  ⚙ Read services/order-sync-worker/worker.go:85-95',
      '  ↳ L89: catch {} — confirmed bare catch, zero error context',
      '',
      '  ⚙ Edit services/order-sync-worker/worker.go:78-92',
      '  ↳ Replaced silent nil return with: if loc == nil { return fmt.Errorf("location %s not found in cache or DB", order.LocationID) }',
      '  ↳ Replaced bare catch with structured logging:',
      '  ↳   log.Error("order sync failed", "order_id", order.ID, "location_id", order.LocationID, "error", err)',
      '  ↳   metrics.Incr("order_sync.failures", tags...)',
      '',
      '  ⚙ Bash cd services/order-sync-worker && go test ./... -v -count=1',
      '  ↳ PASS: TestSyncOrder_ValidLocation (0.02s)',
      '  ↳ PASS: TestSyncOrder_MissingLocation_ReturnsError (0.01s)',
      '  ↳ PASS: TestSyncOrder_ErrorIsLogged (0.01s)',
      '  ↳ ok  services/order-sync-worker 0.04s',
      '',
      '  ✓ Error handling fixed — no more silent failures',
      '  ✓ Datadog metric added: order_sync.failures',
      '  ✓ Structured logging with order_id + location_id context',
      '',
      '  ◆ Summary of changes:',
      '  ┌─ Files Modified ──────────────────────────────────┐',
      '  │  services/location-resolver/cache.go — TTL + fallback  │',
      '  │  services/order-sync-worker/worker.go — error handling  │',
      '  └──────────────────────────────────────────────────────────┘',
      '',
      '  👻 COMPLIANCE: Recommend running reconciliation job before next state audit window',
    ],
  ],
  'PF-1247': [
    [
      '',
      '⟡ thinking',
      '  Looking at existing selection patterns and the inventory table.',
      '  Need to understand current TanStack Table setup before planning toolbar.',
      '',
      '  ⚙ Read src/lib/hooks/use-selection.ts',
      '  ↳ 87 lines — TanStack Table integration with single/multi mode',
      '  ↳ Exports: useSelection({ mode: "single" | "multi" })',
      '  ↳ Missing: checkbox column, select-all, range select (Shift+Click)',
      '',
      '  ⚙ Read src/components/inventory/inventory-table.tsx:1-30',
      '  ↳ Uses TanStack Table with virtualizer for large datasets',
      '  ↳ Currently no selection — uses useSelection({ mode: "single" }) for row click',
      '',
      '  ⚙ Grep "BulkAction\\|bulk-action\\|bulkAction" src/',
      '  ↳ No results — bulk actions don\'t exist yet',
      '',
      '  ✓ Table infrastructure is TanStack + virtualizer (good for perf)',
      '  ✓ useSelection hook exists but needs checkbox + multi-select extension',
      '  ✗ No bulk action UI exists anywhere in the codebase',
      '',
      '    → Plan: extend use-selection.ts, add checkbox column, build floating toolbar',
      '    → Estimated: 3 new files, 2 modified files',
    ],
    [
      '',
      '⟡ thinking',
      '  Starting implementation. Checkbox column first, then toolbar.',
      '',
      '  ⚙ Edit src/lib/hooks/use-selection.ts',
      '  ↳ Added getCheckboxColumn() — renders header checkbox (select all) + row checkboxes',
      '  ↳ Added Shift+Click range select support',
      '  ↳ Added selectedIds: Set<string> to expose selected row IDs',
      '',
      '  ⚙ Edit src/components/inventory/inventory-table.tsx:18-25',
      '  ↳ Switched to useSelection({ mode: "multi" })',
      '  ↳ Added checkbox column as first column: [getCheckboxColumn(), ...existingColumns]',
      '',
      '  ⚙ Bash cd src && npx vitest run --reporter=verbose lib/hooks/',
      '  ↳ ✓ use-selection.test.ts — single select (0.1s)',
      '  ↳ ✓ use-selection.test.ts — multi select (0.1s)',
      '  ↳ ✓ use-selection.test.ts — select all toggles (0.1s)',
      '  ↳ ✓ use-selection.test.ts — shift+click range (0.2s)',
      '  ↳ 4/4 tests passing',
      '',
      '  ✓ Selection logic done. Building toolbar next.',
    ],
    [
      '',
      '⟡ thinking',
      '  Building the floating toolbar component. Should appear at bottom',
      '  when items are selected, disappear when selection is cleared.',
      '',
      '  ⚙ Edit src/components/inventory/BulkActionToolbar.tsx',
      '  ↳ Created: floating bottom toolbar with slide-up animation',
      '  ↳ Shows: "{N} items selected" + action buttons',
      '  ↳ Actions: Edit Status, Edit Price, Edit Category, Archive',
      '  ↳ Uses Framer Motion AnimatePresence for enter/exit',
      '',
      '  ⚙ Edit src/components/inventory/BulkEditModal.tsx',
      '  ↳ Created: modal with field-specific forms',
      '  ↳ Price: number input with currency formatting',
      '  ↳ Category: dropdown from existing categories',
      '  ↳ Status: active/inactive toggle',
      '',
      '  ⚙ Read src/api/routes/inventory.go:184-220',
      '  ↳ Current PATCH /api/inventory/bulk only handles status',
      '',
      '  ⚙ Edit src/api/routes/inventory.go:184-240',
      '  ↳ Extended bulk endpoint: added category, price, archive operations',
      '  ↳ Added audit trail logging for archive (Metrc compliance)',
      '',
      '  👻 COMPLIANCE: Bulk archive now writes Metrc adjustment events',
      '  👻 Price edits trigger OLCC price-point reporting webhook for OR locations',
      '',
      '  ✓ BulkActionToolbar.tsx — complete',
      '  ✓ BulkEditModal.tsx — complete',
      '  ✓ inventory.go bulk endpoint — extended',
      '  ⏳ Running full test suite...',
    ],
  ],
  'PF-1251': [
    [
      '',
      '⟡ thinking',
      '  Picking up where Bilda left off. Email template test was failing,',
      '  now fixed. Need to wire notification center integration.',
      '',
      '  ⚙ Read src/components/notifications/NotificationCenter.tsx:1-40',
      '  ↳ Existing notification center with tabs: Orders, System',
      '  ↳ Uses WebSocket subscription for real-time updates',
      '  ↳ No inventory tab yet — need to add one',
      '',
      '  ⚙ Edit src/components/notifications/NotificationCenter.tsx',
      '  ↳ Added "Inventory" tab between Orders and System',
      '  ↳ Subscribes to ws topic: inventory.threshold_breach',
      '  ↳ Renders: SKU name, current qty, threshold, reorder link',
      '',
      '  ⚙ Bash cd src && npx vitest run notifications/',
      '  ↳ ✓ NotificationCenter.test.tsx — renders tabs (0.3s)',
      '  ↳ ✓ NotificationCenter.test.tsx — inventory tab shows alerts (0.4s)',
      '  ↳ ✓ NotificationCenter.test.tsx — reorder link navigates (0.2s)',
      '',
      '  ✓ Notification center integration complete',
      '  ✓ All worker tests passing',
      '  ✓ WebSocket + email + in-app — full notification pipeline working',
      '',
      '    → Ready for QA stage',
    ],
    [
      '',
      '⟡ thinking',
      '  Let me verify the worker handles edge cases correctly.',
      '',
      '  ⚙ Bash cd services/inventory-alerts && go test -run TestEdgeCases -v',
      '  ↳ PASS: TestThresholdZero_AlwaysAlerts (0.02s)',
      '  ↳ PASS: TestThresholdMax_NeverAlerts (0.01s)',
      '  ↳ PASS: TestConcurrentBreaches_NoQueueBomb (0.14s)',
      '  ↳ PASS: TestSendGridBounce_RetryWithBackoff (0.08s)',
      '',
      '  ⚙ Read services/inventory-alerts/worker.go:42-60',
      '  ↳ Polling interval: 30s — SWE agent flagged this as wasteful at scale',
      '',
      '  ⚙ Edit services/inventory-alerts/worker.go:42-60',
      '  ↳ Switched from polling to CDC: listens to inventory_updates change stream',
      '  ↳ Only checks thresholds when quantity actually changes',
      '  ↳ ~95% reduction in unnecessary DB queries at scale',
      '',
      '  ⚙ Bash cd services/inventory-alerts && go test ./... -v -count=1',
      '  ↳ ok  services/inventory-alerts 0.31s — all 8 tests passing',
      '',
      '  ✓ Switched to CDC pattern — much more efficient',
      '  ✓ Edge cases handled: threshold=0, threshold=max, concurrent breaches',
    ],
  ],
  'BUG-901': [
    [
      '',
      '⟡ thinking',
      '  QA stage — need to validate the concurrent orders fix.',
      '  The worker pool was bumped from 1 to 4. Let me verify no race conditions.',
      '',
      '  ⚙ Read services/payments/fraud_queue.go:20-40',
      '  ↳ L24: workerPool: 4  // bumped from 1',
      '  ↳ L28: connectionPool: pgxpool.New(ctx, connStr, poolSize: 8)',
      '',
      '  ⚙ Bash cd e2e && npx playwright test payments --project=chromium --reporter=list',
      '  ↳ ✓ standard order ($200) — 3.1s',
      '  ↳ ✓ high-value order ($6,500) — 4.0s',
      '  ↳ ✓ boundary order ($5,000.00) — 3.7s',
      '  ↳ ✓ boundary order ($4,999.99) — 2.9s',
      '  ↳ ✓ pending state UI renders correctly — 2.0s',
      '  ↳ ✓ webhook retry on 5xx — 5.2s',
      '  ↳ ✓ fraud rejection shows error state — 2.8s',
      '  ↳ ✓ concurrent high-value orders — 6.1s',
      '  ↳ ✓ split order workaround still works — 2.7s',
      '',
      '  ✓ All 9 payment e2e tests passing',
      '  ✓ Concurrent test now passes with 4 workers',
      '',
      '  👻 COMPLIANCE: PCI-DSS verified — no card data in queue payloads',
      '  👻 Webhook endpoint uses tokenized order references only',
      '',
      '  ◆ QA Summary: All clear. Ready for merge.',
    ],
    [
      '',
      '⟡ thinking',
      '  Running one more round — load test to make sure the async path',
      '  holds under production-like concurrency.',
      '',
      '  ⚙ Bash cd services/payments && go test -run TestLoadFraudCheck -v -count=1',
      '  ↳ Simulating 100 concurrent $7K+ orders...',
      '  ↳ Worker pool: 4 | Connection pool: 8',
      '  ↳ p50: 1.2s | p95: 3.8s | p99: 5.1s',
      '  ↳ Errors: 0 | Timeouts: 0 | Successful: 100/100',
      '  ↳ PASS: TestLoadFraudCheck (8.3s)',
      '',
      '  ✓ Load test passing — 100 concurrent high-value orders processed',
      '  ✓ No timeouts, no errors, all within 60s fraud check window',
      '',
      '  ⚙ Bash git diff --stat origin/main..HEAD',
      '  ↳ services/payments/fraud_check.go        | 45 +++---',
      '  ↳ services/payments/fraud_queue.go         | 12 ++-',
      '  ↳ services/payments/webhook_handler.go     | 38 +++',
      '  ↳ src/components/orders/PendingState.tsx    | 67 +++',
      '  ↳ e2e/payment-flow.spec.ts                 | 28 ++-',
      '  ↳ 5 files changed, 162 insertions(+), 28 deletions(-)',
      '',
      '  ◆ Ready for merge. Creating PR...',
    ],
  ],
  'PF-1239': [
    [
      '',
      '  ✓ This ticket is in merge stage — all work is complete.',
      '',
      '  ⚙ Bash gh pr view 4127 --json state,reviews,statusCheckRollup',
      '  ↳ State: OPEN',
      '  ↳ Reviews: 2 approved (sarah-chen, mike-torres)',
      '  ↳ CI: all 14 checks passing',
      '',
      '  ⚙ Bash gh pr checks 4127',
      '  ↳ ✓ lint — passed (12s)',
      '  ↳ ✓ typecheck — passed (8s)',
      '  ↳ ✓ unit-tests — passed (34s)',
      '  ↳ ✓ e2e-chromium — passed (2m12s)',
      '  ↳ ✓ e2e-firefox — passed (2m28s)',
      '  ↳ ✓ bundle-size — passed (+2.1KB)',
      '',
      '  ◆ PR #4127 is ready to merge. All checks green, 2 approvals.',
      '    → Run `gh pr merge 4127 --squash` to merge',
    ],
    [
      '',
      '  ⚙ Bash gh pr merge 4127 --squash --auto',
      '  ↳ ✓ Pull request #4127 merged via squash',
      '  ↳ Commit: feat: CSV export for sales reports with custom date ranges',
      '',
      '  ⚙ Bash gh pr view 4127 --json state',
      '  ↳ State: MERGED',
      '',
      '  ✓ PF-1239 complete. Merged to main.',
      '  ✓ Deploy pipeline triggered — ETA 3 minutes to production.',
    ],
  ],
  'BUG-887': [
    [
      '',
      '⟡ thinking',
      '  Continuing the ResizeObserver migration. 2/4 charts done.',
      '  Need to apply the same pattern to revenue and velocity charts.',
      '',
      '  ⚙ Read src/components/dashboard/revenue-chart.tsx',
      '  ↳ 94 lines — <ResponsiveContainer> wrapping <LineChart>',
      '  ↳ Same pattern as sales-chart: no debounce, remounts on resize',
      '',
      '  ⚙ Edit src/components/dashboard/revenue-chart.tsx',
      '  ↳ Replaced ResponsiveContainer with useResizeObserver(ref, { debounce: 150 })',
      '  ↳ Chart receives explicit width={width} height={height}',
      '',
      '  ⚙ Edit src/components/dashboard/velocity-chart.tsx',
      '  ↳ Same migration — ResponsiveContainer → useResizeObserver',
      '',
      '  ⚙ Bash cd src && npx vitest run --reporter=verbose dashboard/',
      '  ↳ ✓ sales-chart.test.tsx — no flicker on resize (0.8s)',
      '  ↳ ✓ conversion-chart.test.tsx — stable (0.6s)',
      '  ↳ ✓ revenue-chart.test.tsx — stable (0.7s)',
      '  ↳ ✓ velocity-chart.test.tsx — stable (0.9s)',
      '  ↳ 4/4 charts migrated and passing',
      '',
      '  ✓ All 4 dashboard charts now use useResizeObserver',
      '  ✓ No more ResponsiveContainer — CLS should be near zero',
      '  ⏳ Running visual regression test next...',
    ],
    [
      '',
      '  ⚙ Bash cd e2e && npx playwright test dashboard --project=chromium',
      '  ↳ ✓ dashboard-charts.spec.ts — resize 320→1440px no CLS (4.2s)',
      '  ↳ ✓ dashboard-charts.spec.ts — data transition animation (1.8s)',
      '  ↳ ✓ dashboard-charts.spec.ts — multi-monitor resize sim (3.1s)',
      '',
      '  ✓ Visual regression tests passing',
      '  ✓ CLS measured: 0.002 (well under 0.1 threshold)',
      '',
      '  ◆ BUG-887 fix complete. All 4 charts stable.',
      '  ◆ Ready for QA stage.',
    ],
  ],
  'PF-1255': [
    [
      '',
      '⟡ thinking',
      '  Early contexta stage. Gathering requirements from partner requests',
      '  and understanding current rate limiting infrastructure.',
      '',
      '  ⚙ Read services/api-gateway/middleware/rate_limiter.go:8-55',
      '  ↳ Redis sliding window counter per API key',
      '  ↳ Headers: X-RateLimit-Remaining, X-RateLimit-Reset',
      '  ↳ Default limit: 1000 req/min per key',
      '  ↳ Emits DD metrics: api_gateway.rate_limit.{allowed,rejected}',
      '',
      '  ⚙ Bash curl -s "https://app.datadoghq.com/api/v1/metrics?q=api_gateway.rate_limit" | jq ".metrics[:5]"',
      '  ↳ api_gateway.rate_limit.allowed',
      '  ↳ api_gateway.rate_limit.rejected',
      '  ↳ api_gateway.rate_limit.throttled',
      '  ↳ api_gateway.rate_limit.quota_used_pct',
      '',
      '  ✓ Datadog metrics exist — 4 rate limit metrics available',
      '  ✓ Redis sliding window can be queried for real-time data',
      '  ✗ No partner-facing dashboard — all data is internal only',
      '  ✗ No usage history beyond DD\'s 30-day retention',
      '',
      '  ⚠ Decisions needed before planning:',
      '    → Metric granularity: per-endpoint or aggregate per key?',
      '    → Historical retention: 30d, 90d, or 1yr?',
      '    → Self-serve limit increase: yes/no? (would cut support tickets ~40%)',
    ],
    [
      '',
      '⟡ thinking',
      '  Analyzing the 18 partner feedback requests to extract patterns.',
      '',
      '  ⚙ Grep "rate.limit\\|quota\\|429\\|throttl" support-tickets/partner-requests/',
      '  ↳ 12 requests: "Why am I being rate limited?" — need per-endpoint visibility',
      '  ↳ 4 requests: "Can I get a higher limit?" — want self-serve increase',
      '  ↳ 2 requests: "Show me historical usage" — need retention beyond DD',
      '',
      '  ✓ Top partner pain point: no visibility into which endpoints consume quota',
      '  ✓ Second: no self-serve limit increase (currently manual email)',
      '',
      '  ◆ Contexta recommendation:',
      '  ┌─ Dashboard MVP Scope ─────────────────────────────┐',
      '  │  1. Real-time quota usage gauge (% of limit)      │',
      '  │  2. Per-endpoint breakdown (top 10 endpoints)     │',
      '  │  3. 30-day usage history (from DD metrics)        │',
      '  │  4. Rate limit event log (last 100 rejections)    │',
      '  │  5. "Request increase" button → creates support ticket │',
      '  └──────────────────────────────────────────────────────┘',
      '',
      '  ⏳ Waiting for product sign-off before moving to Plana stage.',
    ],
  ],
}

// Generic fallback responses for any input
const genericResponses: string[][] = [
  [
    '',
    '⟡ thinking',
    '  Processing your request. Let me investigate the relevant code.',
    '',
    '  ⚙ Grep "TODO\\|FIXME\\|HACK" src/',
    '  ↳ Found 12 matches across 8 files',
    '',
    '  ✓ Analysis complete. What specific area would you like me to focus on?',
  ],
  [
    '',
    '⟡ thinking',
    '  Looking at the relevant code paths for this ticket.',
    '',
    '  ⚙ Read src/lib/hooks/use-selection.ts',
    '  ↳ 87 lines — selection logic with TanStack integration',
    '',
    '  ⚙ Bash git log --oneline -5',
    '  ↳ a3f2c1d fix: inventory bulk status 404 on missing IDs',
    '  ↳ 8b1e4f7 feat: add bulk status change endpoint',
    '  ↳ f2d9a0c refactor: extract inventory service layer',
    '  ↳ 12e8b3a chore: update dependencies',
    '  ↳ 9c4d7f1 fix: dashboard chart resize flicker',
    '',
    '  ✓ Codebase context loaded. I can see the recent changes.',
    '    → What would you like me to do next?',
  ],
  [
    '',
    '⟡ thinking',
    '  Running tests to verify current state.',
    '',
    '  ⚙ Bash npm test -- --reporter=verbose 2>&1 | tail -10',
    '  ↳ Tests: 47 passed, 1 failed, 48 total',
    '  ↳ Time: 12.4s',
    '',
    '  ✗ 1 test failure in integration suite — investigating.',
    '',
    '  ⚙ Read e2e/integration.spec.ts:142-160',
    '  ↳ Flaky test: timeout on webhook callback',
    '  ↳ Known issue — CI retry usually catches it',
    '',
    '  ✓ Core tests passing. The 1 failure is a known flaky test.',
  ],
]

// Keyword-matched responses that work across any ticket
function getKeywordResponse(input: string, ticket: Ticket): string[] | null {
  const lower = input.toLowerCase()

  if (lower.includes('test') || lower.includes('run test')) {
    return [
      '',
      '⟡ thinking',
      '  Running the test suite for this area of the codebase.',
      '',
      `  ⚙ Bash cd ${ticket.type === 'BUG' ? 'services' : 'src'} && npx vitest run --reporter=verbose`,
      '  ↳ ✓ unit tests — 23/23 passing (2.1s)',
      '  ↳ ✓ integration tests — 8/8 passing (4.7s)',
      '  ↳ ✓ snapshot tests — 5/5 passing (0.9s)',
      '',
      '  ✓ All 36 tests passing. No regressions detected.',
    ]
  }

  if (lower.includes('status') || lower.includes('where are we') || lower.includes('progress')) {
    const stage = stages[getStageIndex(ticket.stage)]
    return [
      '',
      `◆ ${ticket.id} — Status Report`,
      '',
      `  Stage: ${stage.label} (${stage.agent})`,
      `  Confidence: ${ticket.confidenceScore}%`,
      `  Complexity: ${ticket.complexityScore}/5 peons`,
      `  Affected Users: ${ticket.affectedUsers.toLocaleString()}`,
      ...(ticket.errorRate ? [`  Error Rate: ${ticket.errorRate}%`] : []),
      '',
      ...ticket.agents.map(a =>
        `  ${a.readiness >= 80 ? '✓' : a.readiness >= 40 ? '⏳' : '✗'} ${a.agent}: ${a.readiness}% ready — ${a.summary.slice(0, 60)}...`
      ),
      '',
      ...(ticket.complianceFlags && ticket.complianceFlags.length > 0
        ? ['  👻 Compliance flags active — see Compliance Ghost panel']
        : ['  👻 No compliance flags']),
    ]
  }

  if (lower.includes('compliance') || lower.includes('ghost') || lower.includes('metrc') || lower.includes('regulation')) {
    if (!ticket.complianceFlags || ticket.complianceFlags.length === 0) {
      return [
        '',
        '  👻 Compliance Ghost — No flags for this ticket.',
        '  ✓ No regulatory risk detected across all jurisdictions.',
      ]
    }
    return [
      '',
      '  👻 Compliance Ghost — Scanning jurisdictions...',
      '',
      ...ticket.complianceFlags.flatMap(f => [
        `  👻 [${f.risk.toUpperCase()}] ${f.jurisdiction} (${f.system})`,
        `     ${f.detail}`,
        '',
      ]),
      ...(ticket.complianceFlags.some(f => f.risk === 'violation')
        ? ['  ⚠ ACTIVE VIOLATION RISK — remediate before next audit window']
        : ['  ✓ No active violations — warnings should be addressed before merge']),
    ]
  }

  if (lower.includes('fix') || lower.includes('implement') || lower.includes('build') || lower.includes('code')) {
    return [
      '',
      '⟡ thinking',
      `  Starting implementation for ${ticket.id}. Analyzing affected files.`,
      '',
      '  ⚙ Grep "related-pattern" src/',
      '  ↳ Found 3 related files to modify',
      '',
      '  ⚙ Edit src/components/affected-component.tsx:42-68',
      '  ↳ Applied fix — updated logic to handle edge case',
      '',
      '  ⚙ Edit services/affected-service/handler.go:112-130',
      '  ↳ Updated backend handler to match frontend changes',
      '',
      `  ⚙ Bash cd ${ticket.type === 'BUG' ? 'services' : 'src'} && go test ./... -v -count=1`,
      '  ↳ ok  all tests passing (0.34s)',
      '',
      '  ✓ Changes applied. Running full test suite to verify...',
    ]
  }

  if (lower.includes('explain') || lower.includes('what') || lower.includes('why') || lower.includes('how')) {
    return [
      '',
      '⟡ thinking',
      `  Let me explain the current state of ${ticket.id}.`,
      '',
      `  ${ticket.description}`,
      '',
      `  This ticket is in the ${stages[getStageIndex(ticket.stage)].label} stage.`,
      `  Confidence score is ${ticket.confidenceScore}% across ${ticket.agents.length} agents.`,
      '',
      ...ticket.agents.slice(0, 2).map(a =>
        `    → ${a.agent}: ${a.summary}`
      ),
      '',
      `  ${ticket.agents.some(a => a.humanInput === 'high') ? '⚠ Some agents need human input to proceed.' : '✓ Agents can proceed autonomously.'}`,
    ]
  }

  return null
}

export function useClaudeTerminal(ticket: Ticket) {
  const initialLines = terminalSessions[ticket.id] || [
    `$ claude --ticket ${ticket.id} --stage ${ticket.stage}`,
    '',
    `◆ ${stages[getStageIndex(ticket.stage)].label} Agent — Processing...`,
  ]

  const [lines, setLines] = useState<string[]>(initialLines)
  const [isStreaming, setIsStreaming] = useState(false)
  const responseIndexRef = useRef<Record<string, number>>({})
  const abortRef = useRef<number | null>(null)

  const resetForTicket = useCallback((t: Ticket) => {
    const newLines = terminalSessions[t.id] || [
      `$ claude --ticket ${t.id} --stage ${t.stage}`,
      '',
      `◆ ${stages[getStageIndex(t.stage)].label} Agent — Processing...`,
    ]
    setLines(newLines)
    if (abortRef.current) {
      clearTimeout(abortRef.current)
      abortRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const sendMessage = useCallback(async (userInput: string) => {
    // Add user input as a terminal line
    setLines(prev => [...prev, '', `❯ ${userInput}`])
    setIsStreaming(true)

    // Small delay to simulate "thinking"
    await new Promise(r => setTimeout(r, 600))

    // Try keyword match first
    let responseLines = getKeywordResponse(userInput, ticket)

    // If no keyword match, use ticket-specific scripted responses
    if (!responseLines) {
      const ticketResponses = simulatedResponses[ticket.id]
      if (ticketResponses && ticketResponses.length > 0) {
        const idx = responseIndexRef.current[ticket.id] || 0
        responseLines = ticketResponses[idx % ticketResponses.length]
        responseIndexRef.current[ticket.id] = idx + 1
      }
    }

    // Final fallback — generic responses
    if (!responseLines) {
      const idx = responseIndexRef.current['_generic'] || 0
      responseLines = genericResponses[idx % genericResponses.length]
      responseIndexRef.current['_generic'] = idx + 1
    }

    // Type out lines with realistic delays
    for (let i = 0; i < responseLines.length; i++) {
      const line = responseLines[i]
      // Variable delay: tool lines are slower, empty lines are fast
      let delay = 45
      if (line.startsWith('  ⚙')) delay = 180 + Math.random() * 120  // tool calls feel slower
      else if (line.startsWith('  ↳')) delay = 80 + Math.random() * 60  // results come in batches
      else if (line.startsWith('⟡')) delay = 100
      else if (line === '') delay = 30
      else if (line.startsWith('  ✓') || line.startsWith('  ✗')) delay = 120
      else delay = 50 + Math.random() * 40

      await new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          setLines(prev => [...prev, line])
          resolve()
        }, delay)
        abortRef.current = t
      })
    }

    setIsStreaming(false)
    return true
  }, [ticket])

  return { lines, isStreaming, sendMessage, resetForTicket }
}
