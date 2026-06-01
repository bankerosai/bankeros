# Grafana + Prometheus for Banker Copilot

This directory contains the monitoring artefacts for the Banker Copilot LLM service.
The metrics themselves are emitted by `apps/banker-copilot-service` (see `src/metrics.ts`).

## What you get

A single dashboard, **`BankerOS / Banker Copilot — FinOps & Quality`**, with 4 rows:

| Row | Panels |
|-----|--------|
| Cost & Volume | Total cost (USD), turns, sessions, artefacts |
| Cost over time | Cost by role (stacked) · Cost by model (stacked) |
| Latency | Turn latency P50 / P95 / P99 · Tokens/sec by direction (input/output/cache_read/cache_write) |
| Quality & Safety | Tool call rate by outcome (ok/denied/error) · Top 8 tools · Rate-limit hits · Skill mix |

Variables `role` and `model` let you filter everything per relationship manager team, per LLM, etc.

## Import (no-stack, just Grafana already running)

1. Add Prometheus as a datasource pointing at `http://your-prometheus:9090`.
2. Dashboards → New → Import → upload `copilot-dashboard.json`.
3. Done.

## Auto-provision (recommended for dev compose)

Add to `docker-compose.yml`:

```yaml
prometheus:
  image: prom/prometheus:v2.53.0
  volumes:
    - ./infrastructure/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
  ports: ['9090:9090']

grafana:
  image: grafana/grafana:11.1.0
  environment:
    GF_AUTH_ANONYMOUS_ENABLED: 'true'
    GF_AUTH_ANONYMOUS_ORG_ROLE: Viewer
  volumes:
    - ./infrastructure/grafana/provisioning:/etc/grafana/provisioning:ro
    - ./infrastructure/grafana/copilot-dashboard.json:/var/lib/grafana/dashboards/copilot.json:ro
  ports: ['3030:3000']
  depends_on: [prometheus]
```

Then `docker compose up -d prometheus grafana` and open <http://localhost:3030> — the
dashboard appears under **Dashboards → BankerOS**.

## Metric inventory

All metrics are prefixed `banker_copilot_`:

| Name | Type | Labels | Purpose |
|------|------|--------|---------|
| `sessions_started_total` | Counter | `role` | Funnel — how many bankers actually start a session |
| `turns_total` | Counter | `role, skill, model, outcome` | Volume by who/what/which-LLM/success |
| `turn_latency_ms` | Histogram | `role, skill, model` | P50/P95/P99 — set SLOs here |
| `tokens_total` | Counter | `role, model, direction` | direction ∈ {input, output, cache_read, cache_write} |
| `cost_usd_total` | Counter | `role, model` | FinOps — bill back to business unit |
| `tool_calls_total` | Counter | `tool, role, outcome` | outcome ∈ {ok, denied, error} — denied = role guard caught it |
| `artefacts_created_total` | Counter | `skill, role` | What deliverables actually emerged |
| `rate_limit_hits_total` | Counter | `role` | Where you should raise the per-user quota |

## Alert ideas (not shipped)

A few obvious rules — drop into Prometheus or Grafana Alerting:

```yaml
# Tool failure rate spike
- alert: CopilotToolErrorRate
  expr: sum(rate(banker_copilot_tool_calls_total{outcome="error"}[5m]))
        / sum(rate(banker_copilot_tool_calls_total[5m])) > 0.05
  for: 10m
  annotations:
    summary: Banker Copilot tool failures >5% — check BankerOS API health

# Cost runaway
- alert: CopilotCostHourly
  expr: sum(increase(banker_copilot_cost_usd_total[1h])) > 50
  for: 5m
  annotations:
    summary: Banker Copilot LLM spend >$50/hr — investigate runaway sessions

# Latency SLO miss
- alert: CopilotLatencyP95
  expr: histogram_quantile(0.95, sum(rate(banker_copilot_turn_latency_ms_bucket[10m])) by (le)) > 15000
  for: 15m
  annotations:
    summary: Banker Copilot P95 turn latency >15s — model degraded or overloaded
```
