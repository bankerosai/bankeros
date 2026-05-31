/**
 * Credit Officer / Relationship Manager Workbench
 * 客户经理日常工作台 — "我的客户" "我的申请" "待办任务"
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MY_APPLICATIONS = [
  { id: 'APP-2025-0142', customer: 'ACME 制造集团', amount: 30000000, currency: 'CNY', product: '银团贷款', stage: 'CREDIT_COMMITTEE',  daysInStage: 2, riskRating: 'BB',  rm: '我', priority: 'HIGH' },
  { id: 'APP-2025-0141', customer: '苏州精密机械', amount: 4200000,  currency: 'EUR', product: '出口押汇',   stage: 'UNDERWRITING',     daysInStage: 1, riskRating: 'A',   rm: '我', priority: 'MEDIUM' },
  { id: 'APP-2025-0140', customer: '王女士',     amount: 3500000,  currency: 'CNY', product: '首套房按揭', stage: 'DUE_DILIGENCE',    daysInStage: 3, riskRating: 'BBB', rm: '我', priority: 'MEDIUM' },
  { id: 'APP-2025-0139', customer: '陈先生',     amount: 500000,   currency: 'CNY', product: '闪贷',       stage: 'EXTERNAL_DATA',    daysInStage: 0, riskRating: 'A',   rm: '我', priority: 'LOW' },
  { id: 'APP-2025-0138', customer: 'Gulf Trading FZE', amount: 8000000, currency: 'USD', product: '保函',  stage: 'KYC_PENDING',      daysInStage: 5, riskRating: 'HIGH_RISK', rm: '我', priority: 'HIGH' },
  { id: 'APP-2025-0137', customer: '李先生 (经营贷)', amount: 2000000, currency: 'CNY', product: '抵押经营贷', stage: 'APPROVED',     daysInStage: 0, riskRating: 'BBB', rm: '我', priority: 'LOW' },
];

const STAGES = {
  KYC_PENDING:      { label: 'KYC 待补充',     color: '#ef4444', step: 1 },
  EXTERNAL_DATA:    { label: '外部数据查询',   color: '#06b6d4', step: 2 },
  DUE_DILIGENCE:    { label: '客户经理尽调',   color: '#f59e0b', step: 3 },
  UNDERWRITING:     { label: '核保中',         color: '#a855f7', step: 4 },
  CREDIT_OFFICER:   { label: '审贷官审批',     color: '#3b82f6', step: 5 },
  CREDIT_COMMITTEE: { label: '审贷会上会',     color: '#ec4899', step: 6 },
  APPROVED:         { label: '已批准',         color: '#22c55e', step: 7 },
  REJECTED:         { label: '已拒绝',         color: '#7f1d1d', step: 0 },
  DISBURSED:        { label: '已放款',         color: '#22c55e', step: 8 },
};

const TODO_TASKS = [
  { id: 't1', priority: 'HIGH', type: 'KYC',       desc: 'Gulf Trading FZE 高风险客户 EDD 文件待补充', due: '今日 18:00', app: 'APP-2025-0138' },
  { id: 't2', priority: 'HIGH', type: 'DD',        desc: '苏州精密机械实地走访 + 财务核验', due: '明日 16:00', app: 'APP-2025-0141' },
  { id: 't3', priority: 'MEDIUM', type: 'EXTERNAL', desc: '王女士 央行征信报告调取 (本人授权)', due: '本周', app: 'APP-2025-0140' },
  { id: 't4', priority: 'MEDIUM', type: 'COMMITTEE', desc: 'ACME 集团审贷会议案准备 (¥3亿)', due: '2 天后', app: 'APP-2025-0142' },
  { id: 't5', priority: 'LOW', type: 'POST_LOAN', desc: '李先生经营贷放款后 30 天首次回访', due: '本周', app: 'APP-2025-0137' },
];

export default function CreditWorkbench() {
  const nav = useNavigate();
  const [tab, setTab] = useState<'applications' | 'tasks' | 'customers'>('applications');

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>💼 信贷工作台</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          客户经理 / 信贷专员日常工作 · LOS (Loan Origination System) 端到端工作流
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '我负责的客户', value: '142', color: 'var(--accent-blue)' },
          { label: '进行中申请',   value: '6',  color: 'var(--accent-amber)' },
          { label: '本月放款',     value: '¥ 84M', color: 'var(--accent-green)' },
          { label: '本月业绩',     value: '¥ 1.2M', sub: '佣金收入', color: 'var(--accent-purple)' },
          { label: '不良率',       value: '0.8%', sub: '低于全行', color: 'var(--accent-green)' },
          { label: '待办任务',     value: '5', sub: '2 紧急', color: 'var(--accent-red)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Quick Action: New Application */}
      <div className="card" style={{ marginBottom: 20, padding: 20, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.08))', borderColor: 'var(--accent-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>🚀 发起新贷款申请</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>启动 8 步信贷流程：KYC → 外部数据 → 尽调 → 核保 → 审贷官 → 审贷会 → 批准 → 放款</p>
          </div>
          <button className="btn btn-primary" onClick={() => nav('/admin/credit-workflow/new')} style={{ padding: '12px 24px', fontSize: 14 }}>
            + 新建申请
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {[
          ['applications', `📋 我的申请 (${MY_APPLICATIONS.length})`],
          ['tasks',        `✅ 待办任务 (${TODO_TASKS.length})`],
          ['customers',    `👥 我的客户 (142)`],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '12px 18px', fontSize: 13, fontWeight: tab === k ? 700 : 500,
              color: tab === k ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: tab === k ? '2px solid var(--accent-cyan)' : '2px solid transparent', marginBottom: -1,
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'applications' && (
        <div className="card">
          <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: 12 }}>申请编号</th>
                <th style={{ padding: 12 }}>客户</th>
                <th style={{ padding: 12 }}>产品</th>
                <th style={{ padding: 12, textAlign: 'right' }}>金额</th>
                <th style={{ padding: 12 }}>风险评级</th>
                <th style={{ padding: 12 }}>当前阶段</th>
                <th style={{ padding: 12 }}>停留</th>
                <th style={{ padding: 12 }}>优先级</th>
                <th style={{ padding: 12 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {MY_APPLICATIONS.map(a => {
                const stage = STAGES[a.stage as keyof typeof STAGES];
                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{a.id}</td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{a.customer}</td>
                    <td style={{ padding: 12 }}><span className="badge badge-blue">{a.product}</span></td>
                    <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{a.currency} {(a.amount / 1000).toLocaleString()}K</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
                        background: a.riskRating === 'HIGH_RISK' ? 'rgba(239,68,68,0.15)' : a.riskRating === 'BB' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                        color: a.riskRating === 'HIGH_RISK' ? '#ef4444' : a.riskRating === 'BB' ? '#f59e0b' : '#22c55e' }}>
                        {a.riskRating}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                        <span style={{ fontSize: 12, color: stage.color, fontWeight: 600 }}>步骤 {stage.step}: {stage.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: 12, fontSize: 12, color: a.daysInStage > 3 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                      {a.daysInStage} 天
                    </td>
                    <td style={{ padding: 12 }}>
                      <span className={`badge badge-${a.priority === 'HIGH' ? 'red' : a.priority === 'MEDIUM' ? 'amber' : 'gray'}`}>{a.priority}</span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}
                        onClick={() => nav(`/admin/credit-workflow/application/${a.id}`)}>
                        进入处理 →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="card">
          {TODO_TASKS.map(t => (
            <div key={t.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className={`badge badge-${t.priority === 'HIGH' ? 'red' : t.priority === 'MEDIUM' ? 'amber' : 'gray'}`} style={{ flexShrink: 0 }}>{t.priority}</span>
              <span className="badge badge-blue" style={{ flexShrink: 0 }}>{t.type}</span>
              <div style={{ flex: 1, fontSize: 13 }}>{t.desc}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>截止: {t.due}</div>
              <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{t.app}</code>
              <button className="btn btn-ghost" style={{ fontSize: 11 }}>处理</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'customers' && (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>我的客户管理</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            您当前管理 142 位客户 · 总 AUM ¥ 8.4 亿 · 月均收入 ¥ 1.2M
          </div>
          <button className="btn btn-primary" onClick={() => nav('/admin/customers')}>查看客户管理 →</button>
        </div>
      )}
    </div>
  );
}
