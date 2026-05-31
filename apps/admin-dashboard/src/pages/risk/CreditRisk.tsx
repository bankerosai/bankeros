/**
 * Credit Risk Management.
 * PD (Probability of Default) · LGD (Loss Given Default) · EAD (Exposure at Default)
 * IRB Internal Ratings-Based approach (Basel II/III/IV)
 * IFRS 9 Expected Credit Loss (ECL) provisioning
 */

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';

const NPL_TREND = [
  { quarter: '2024Q1', npl: 1.62, target: 2.0 },
  { quarter: '2024Q2', npl: 1.58, target: 2.0 },
  { quarter: '2024Q3', npl: 1.52, target: 2.0 },
  { quarter: '2024Q4', npl: 1.48, target: 2.0 },
  { quarter: '2025Q1', npl: 1.45, target: 2.0 },
  { quarter: '2025Q2', npl: 1.42, target: 2.0 },
];

const RATING_DIST = [
  { rating: 'AAA', count: 240, exposure: 18200, pd: 0.01, fill: '#22c55e' },
  { rating: 'AA',  count: 580, exposure: 36500, pd: 0.03, fill: '#22c55e' },
  { rating: 'A',   count: 1240, exposure: 52400, pd: 0.08, fill: '#3b82f6' },
  { rating: 'BBB', count: 2180, exposure: 48800, pd: 0.25, fill: '#3b82f6' },
  { rating: 'BB',  count: 1850, exposure: 28400, pd: 0.85, fill: '#f59e0b' },
  { rating: 'B',   count: 920, exposure: 12200, pd: 3.40, fill: '#f59e0b' },
  { rating: 'CCC', count: 320, exposure: 4800, pd: 12.50, fill: '#ef4444' },
  { rating: 'D',   count: 84, exposure: 1240, pd: 100, fill: '#7f1d1d' },
];

const ECL_BUCKETS = [
  { stage: 'Stage 1', desc: '12 个月 ECL · 信用质量未恶化', loans: 184000, ecl: 320, color: '#22c55e' },
  { stage: 'Stage 2', desc: '存续期 ECL · 信用风险显著上升', loans: 18400, ecl: 940, color: '#f59e0b' },
  { stage: 'Stage 3', desc: '存续期 ECL · 已发生信用减值 (NPL)', loans: 2620, ecl: 1820, color: '#ef4444' },
];

const STRESS_SCENARIOS = [
  { name: '基准情景 (Baseline)', gdp: 5.0, unemployment: 4.5, npl: 1.42, capitalImpact: -0.2, color: 'var(--accent-green)' },
  { name: '温和压力 (Mild Stress)', gdp: 2.5, unemployment: 6.0, npl: 2.85, capitalImpact: -1.4, color: 'var(--accent-blue)' },
  { name: '中度压力 (Moderate)', gdp: -1.0, unemployment: 8.5, npl: 4.20, capitalImpact: -2.8, color: 'var(--accent-amber)' },
  { name: '严重衰退 (Severe)', gdp: -4.5, unemployment: 12.0, npl: 7.80, capitalImpact: -5.2, color: 'var(--accent-red)' },
];

export default function CreditRisk() {
  const [tab, setTab] = useState<'overview' | 'rating' | 'ifrs9' | 'stress'>('overview');

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>💳 信用风险管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          IRB 内部评级法 · IFRS 9 预期信用损失 · 巴塞尔 III/IV 标准化方法 · 服务全行贷款余额 ¥1.92T
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '贷款总余额',      value: '¥ 1.92T',   sub: '+ 8.2% YoY' },
          { label: 'NPL 不良率',     value: '1.42%',     sub: '↓ 4 bp', color: 'var(--accent-green)' },
          { label: '关注类贷款',     value: '2.18%',     sub: '↑ 12 bp', color: 'var(--accent-amber)' },
          { label: '拨备覆盖率',     value: '215%',      sub: '↑ 5 pp', color: 'var(--accent-green)' },
          { label: '信用成本',       value: '0.42%',     sub: '↓ 8 bp', color: 'var(--accent-green)' },
          { label: '加权 PD',        value: '1.82%',     sub: '稳定' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: k.color ?? 'var(--text-primary)' }}>{k.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {[
          ['overview', '📊 NPL & 拨备走势'],
          ['rating',   '⭐ 内部评级分布 (IRB)'],
          ['ifrs9',    '📋 IFRS 9 三阶段 ECL'],
          ['stress',   '⚡ 压力测试 (Stress Test)'],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '12px 18px', fontSize: 13, fontWeight: tab === k ? 700 : 500,
              color: tab === k ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: tab === k ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              marginBottom: -1,
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid-2">
          <div className="card">
            <div className="section-header"><span className="section-title">NPL 不良贷款率走势</span><span className="badge badge-green">监管要求 ≤ 2.0%</span></div>
            <div className="card-body" style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={NPL_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Bar dataKey="npl" name="实际 NPL" fill="#3b82f6" />
                  <Bar dataKey="target" name="监管线" fill="#ef4444" opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 12 }}>NPL 处置渠道 (本月)</div>
            <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
              <tbody>
                {[
                  ['催收回款', '¥ 124M', '↑ 8%', 'green'],
                  ['债转股', '¥ 48M', '↓ 12%', 'gray'],
                  ['转售第三方', '¥ 86M', '↑ 24%', 'green'],
                  ['核销 (Write-off)', '¥ 32M', '稳定', 'amber'],
                  ['资产重组', '¥ 21M', '↑ 5%', 'gray'],
                  ['司法处置', '¥ 18M', '↓ 4%', 'gray'],
                ].map(([k, v, d, c]) => (
                  <tr key={k as string} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 12 }}>{k}</td>
                    <td style={{ padding: 12, fontFamily: 'monospace', fontWeight: 700, textAlign: 'right' }}>{v}</td>
                    <td style={{ padding: 12, textAlign: 'right' }}>
                      <span className={`badge badge-${c}`}>{d}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 14, padding: 14, background: 'var(--bg-secondary)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>本月处置总额</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-green)' }}>¥ 329M</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>处置率 = 处置 / 不良总额 = 11.8%</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'rating' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-title">客户内部评级分布 (IRB Approach)</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>按 Basel III 标准化方法</span>
            </div>
            <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>评级</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>等级描述</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>客户数</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>风险敞口 (¥M)</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>PD (违约概率)</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>LGD (违约损失率)</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>RWA 权重</th>
                </tr>
              </thead>
              <tbody>
                {RATING_DIST.map(r => (
                  <tr key={r.rating} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 12 }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 4, background: `${r.fill}22`, color: r.fill, fontWeight: 700, fontFamily: 'monospace' }}>{r.rating}</span>
                    </td>
                    <td style={{ padding: 12, fontSize: 12 }}>
                      {{ AAA: '极优级 · 几乎无违约风险', AA: '优级 · 极低违约风险', A: '良级 · 低违约风险', BBB: '投资级 · 适度违约风险', BB: '次投资级 · 中等违约风险', B: '投机级 · 较高违约风险', CCC: '高度投机级 · 高违约风险', D: '已违约' }[r.rating]}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{r.count.toLocaleString()}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{r.exposure.toLocaleString()}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: r.pd > 5 ? 'var(--accent-red)' : r.pd > 1 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>{r.pd}%</td>
                    <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>45%</td>
                    <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>
                      {{ AAA: '20%', AA: '20%', A: '50%', BBB: '100%', BB: '100%', B: '150%', CCC: '150%', D: '150%' }[r.rating]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="section-title" style={{ marginBottom: 12 }}>📈 评级迁移矩阵 (1 年)</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>显示客户从某等级在 1 年内迁移至其他等级的概率（基于历史数据）</div>
              <table style={{ width: '100%', fontSize: 11, fontFamily: 'monospace' }}>
                <thead>
                  <tr>
                    <th style={{ padding: 6, textAlign: 'left' }}>From\To</th>
                    {['AAA','AA','A','BBB','BB','B','CCC','D'].map(t => (<th key={t} style={{ padding: 6, textAlign: 'center', color: 'var(--text-muted)' }}>{t}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['AAA', [88.5, 8.2, 2.1, 0.8, 0.3, 0.1, 0.0, 0.0]],
                    ['AA',  [0.5, 87.1, 10.2, 1.6, 0.4, 0.1, 0.0, 0.0]],
                    ['A',   [0.1, 1.8, 85.4, 11.0, 1.2, 0.4, 0.1, 0.0]],
                    ['BBB', [0.0, 0.2, 4.5, 84.8, 8.4, 1.5, 0.4, 0.2]],
                    ['BB',  [0.0, 0.0, 0.5, 5.8, 79.2, 11.1, 2.4, 1.0]],
                    ['B',   [0.0, 0.0, 0.1, 0.5, 6.8, 73.5, 14.2, 4.9]],
                    ['CCC', [0.0, 0.0, 0.0, 0.1, 0.5, 5.8, 67.4, 26.2]],
                  ].map(([from, probs]: any) => (
                    <tr key={from}>
                      <td style={{ padding: 4, fontWeight: 700 }}>{from}</td>
                      {probs.map((p: number, i: number) => (
                        <td key={i} style={{ padding: 4, textAlign: 'center', background: p > 50 ? 'rgba(34,197,94,0.15)' : p > 5 ? 'rgba(245,158,11,0.1)' : 'transparent' }}>
                          {p.toFixed(1)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="section-title" style={{ marginBottom: 12 }}>🎯 客户评级模型</div>
              {[
                { name: '企业客户 PD 模型', version: 'v3.2', accuracy: '82.4%', lastTrained: '2025-04', samples: '124,000' },
                { name: '个人客户 PD 模型', version: 'v4.1', accuracy: '88.6%', lastTrained: '2025-05', samples: '8.4M' },
                { name: '同业客户 PD 模型', version: 'v2.0', accuracy: '79.1%', lastTrained: '2025-03', samples: '1,200' },
                { name: 'LGD 估计模型',    version: 'v2.5', accuracy: '75.8%', lastTrained: '2025-04', samples: '47,000' },
                { name: 'EAD 估计模型',    version: 'v1.8', accuracy: '81.2%', lastTrained: '2025-04', samples: '92,000' },
              ].map(m => (
                <div key={m.name} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                    <span className="badge badge-blue">{m.version}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>准确度: <strong style={{ color: 'var(--accent-green)' }}>{m.accuracy}</strong></span>
                    <span>样本: {m.samples}</span>
                    <span>更新: {m.lastTrained}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'ifrs9' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-title">IFRS 9 三阶段预期信用损失模型</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>覆盖全行贷款资产 ¥1.92T</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
              {ECL_BUCKETS.map(b => (
                <div key={b.stage} style={{ background: 'var(--bg-secondary)', padding: 20, borderRadius: 8, borderTop: `4px solid ${b.color}` }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: b.color, marginBottom: 6 }}>{b.stage}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5, minHeight: 36 }}>{b.desc}</div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>账面贷款</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>¥ {(b.loans / 1000).toFixed(1)}B</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ECL 拨备</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: b.color }}>¥ {b.ecl}M</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>拨备率 {(b.ecl / b.loans * 100).toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 14 }}>📐 ECL 计算公式 (IFRS 9)</div>
            <div style={{ background: 'var(--bg-primary)', padding: 24, borderRadius: 8, fontFamily: 'monospace', fontSize: 13, lineHeight: 2 }}>
              <div style={{ color: 'var(--accent-cyan)' }}>// 12 个月 ECL (Stage 1)</div>
              <div>ECL₁₂ = <strong style={{ color: 'var(--accent-amber)' }}>PD₁₂</strong> × <strong style={{ color: 'var(--accent-amber)' }}>LGD</strong> × <strong style={{ color: 'var(--accent-amber)' }}>EAD</strong> × <strong>D</strong> (折现因子)</div>
              <br />
              <div style={{ color: 'var(--accent-cyan)' }}>// 存续期 ECL (Stage 2/3)</div>
              <div>ECL_lifetime = Σ [<strong style={{ color: 'var(--accent-amber)' }}>PD_t</strong> × <strong style={{ color: 'var(--accent-amber)' }}>LGD</strong> × <strong style={{ color: 'var(--accent-amber)' }}>EAD_t</strong> × D_t]</div>
              <br />
              <div style={{ color: 'var(--text-muted)' }}>
                · PD: 违约概率 (Probability of Default)<br />
                · LGD: 违约损失率 (Loss Given Default) ≈ 45% 抵押贷 / 65% 信用贷<br />
                · EAD: 违约风险敞口 (Exposure at Default)<br />
                · D: 实际利率折现因子
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'stress' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-title">压力测试情景分析 (Stress Testing)</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>遵守 Basel III · 央行宏观审慎要求</span>
            </div>
            <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>压力情景</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>GDP 增长</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>失业率</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>预估 NPL</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>CET1 影响</th>
                  <th style={{ padding: 12, textAlign: 'right' }}>压力后 CET1</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>评估</th>
                </tr>
              </thead>
              <tbody>
                {STRESS_SCENARIOS.map(s => {
                  const stressedCET1 = 13.8 + s.capitalImpact;
                  const passing = stressedCET1 >= 7.5;
                  return (
                    <tr key={s.name} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: s.color, marginRight: 8 }} />
                        {s.name}
                      </td>
                      <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: s.gdp < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{s.gdp > 0 ? '+' : ''}{s.gdp}%</td>
                      <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{s.unemployment}%</td>
                      <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: s.npl > 3 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{s.npl}%</td>
                      <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--accent-red)' }}>{s.capitalImpact}%</td>
                      <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: passing ? 'var(--accent-green)' : 'var(--accent-red)' }}>{stressedCET1.toFixed(1)}%</td>
                      <td style={{ padding: 12 }}>
                        <span className={`badge ${passing ? 'badge-green' : 'badge-red'}`}>
                          {passing ? '✓ 通过' : '✗ 未通过'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop: 14, padding: 14, background: 'rgba(34,197,94,0.05)', borderLeft: '3px solid var(--accent-green)', borderRadius: 4 }}>
              <strong style={{ color: 'var(--accent-green)' }}>✓ 压力测试结论：</strong> 即使在严重衰退情景下 (GDP -4.5%)，
              CET1 仍维持在 8.6% (高于 7.5% 监管要求)。资本缓冲充足，可应对极端冲击。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
