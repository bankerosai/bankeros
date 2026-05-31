/**
 * Loan Application Detail Page — full 8-step workflow visualization
 * KYC → External Data → Due Diligence → Underwriting → Credit Officer → Credit Committee → Approved → Disbursed
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const STAGES = [
  { id: 'kyc',           num: 1, label: 'KYC 资料收集',     icon: '📋', who: '客户经理 / 客户' },
  { id: 'external',      num: 2, label: '外部数据查询',     icon: '🔌', who: '系统自动 / RM' },
  { id: 'dd',            num: 3, label: '客户经理尽调',     icon: '🔍', who: '客户经理' },
  { id: 'underwriting',  num: 4, label: '核保 (Underwriting)', icon: '⚖️', who: '核保员' },
  { id: 'co',            num: 5, label: '审贷官审批',       icon: '👨‍💼', who: '审贷官' },
  { id: 'cc',            num: 6, label: '审贷会决议',       icon: '🏛', who: '审贷委员会' },
  { id: 'approved',      num: 7, label: '批准 + 签约',      icon: '✓',  who: '法务 / 客户' },
  { id: 'disbursed',     num: 8, label: '放款 + 贷后',      icon: '💰', who: '运营 / 贷后' },
];

export default function LoanApplicationDetail() {
  const { id } = useParams();
  const [activeStage, setActiveStage] = useState('cc');  // currently at credit committee

  const currentStageIdx = STAGES.findIndex(s => s.id === activeStage);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin/credit-workflow/workbench" style={{ color: 'var(--accent-cyan)', fontSize: 12, textDecoration: 'none' }}>← 返回工作台</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>
          📄 贷款申请详情 · <code style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{id ?? 'APP-2025-0142'}</code>
        </h1>
      </div>

      {/* Customer Header */}
      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏭</div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>ACME 制造集团有限公司</h2>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span>CIF: <code style={{ color: 'var(--accent-cyan)' }}>CIF20180042</code></span>
                <span>统一社会信用代码: 91310115MA1K4XXX</span>
                <span>行业: 高端装备制造</span>
                <span>客户经理: 王明 (我)</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>申请金额</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-red)' }}>¥ 30,000,000</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>5 年期 · 银团贷款</div>
          </div>
        </div>
      </div>

      {/* Stage Progress Bar */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>📍 当前进度: 步骤 {currentStageIdx + 1} / 8 — {STAGES[currentStageIdx].label}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0, alignItems: 'flex-start' }}>
          {STAGES.map((s, i) => {
            const isDone = i < currentStageIdx;
            const isCurrent = i === currentStageIdx;
            const isPending = i > currentStageIdx;
            return (
              <div key={s.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveStage(s.id)}>
                {/* Connector line */}
                {i > 0 && (
                  <div style={{ position: 'absolute', top: 24, left: '-50%', width: '100%', height: 2,
                    background: isDone || isCurrent ? 'var(--accent-green)' : 'var(--border)', zIndex: 0 }} />
                )}
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', margin: '0 auto 8px',
                    background: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                    color: isPending ? 'var(--text-muted)' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 18, border: isCurrent ? '3px solid var(--accent-blue)' : 'none',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none',
                  }}>
                    {isDone ? '✓' : s.num}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--accent-blue)' : isDone ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{s.who}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage detail content */}
      {activeStage === 'kyc' && <KycStage />}
      {activeStage === 'external' && <ExternalDataStage />}
      {activeStage === 'dd' && <DueDiligenceStage />}
      {activeStage === 'underwriting' && <UnderwritingStage />}
      {activeStage === 'co' && <CreditOfficerStage />}
      {activeStage === 'cc' && <CreditCommitteeStage />}
      {activeStage === 'approved' && <ApprovedStage />}
      {activeStage === 'disbursed' && <DisbursedStage />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STAGE 1: KYC
// ────────────────────────────────────────────────────────────
function KycStage() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📋 步骤 1: KYC 资料收集</h3>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>客户经理收集企业基础资料 · 完成 KYC 增强尽职调查</div>
      <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
        <tbody>
          {[
            ['营业执照副本',         '已上传 · 2024-12-01 · 已核验', 'verified'],
            ['法人身份证 (双面)',    '已上传 · 2024-12-01 · 已核验', 'verified'],
            ['公司章程',             '已上传 · 2024-12-01', 'pending'],
            ['股东会决议 (借款用途)', '已上传 · 2024-12-02', 'verified'],
            ['授权委托书',           '已上传 · 2024-12-02', 'verified'],
            ['实际控制人证明 (UBO)',  '已上传 · 2024-12-02 · FATCA/CRS 已申报', 'verified'],
            ['财务报表 (近 3 年审计)', '已上传 · 2024-12-03 · 致同所审计', 'verified'],
            ['银行流水 (近 12 月)',   '已上传 · 2024-12-03 · 4 家行', 'verified'],
            ['公司基本户开户许可证', '已上传 · 2024-12-04', 'verified'],
            ['关联企业披露',         '已上传 · 2024-12-04 · 12 家关联方', 'verified'],
          ].map(([k, v, s]) => (
            <tr key={k as string} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: 12, fontWeight: 600 }}>{k}</td>
              <td style={{ padding: 12, fontSize: 12 }}>{v}</td>
              <td style={{ padding: 12 }}>
                <span className={`badge badge-${s === 'verified' ? 'green' : 'amber'}`}>
                  {s === 'verified' ? '✓ 已核验' : '待核验'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STAGE 2: External Data
// ────────────────────────────────────────────────────────────
function ExternalDataStage() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔌 步骤 2: 外部数据查询</h3>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>对接 9 大外部数据源 · 自动汇总征信 / 工商 / 税务 / 司法等</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { source: '🏛 央行征信中心', desc: '企业征信报告 · 关联自然人征信', status: 'success', detail: '征信评分: 720 · 无重大违约记录' },
          { source: '🏢 国家企业信用信息公示系统', desc: '工商登记 / 行政处罚 / 经营异常', status: 'success', detail: '无异常 · 注册资本实缴 ¥1.2 亿' },
          { source: '🌐 天眼查 / 企查查', desc: '股权穿透 · 涉诉信息 · 失信被执行人', status: 'success', detail: '股权清晰 · 无失信' },
          { source: '💰 电子税务局', desc: '近 36 月纳税申报 · 增值税发票', status: 'success', detail: '纳税信用 A 级 · 月均纳税 ¥420 万' },
          { source: '⚖️ 中国裁判文书网', desc: '司法诉讼查询', status: 'success', detail: '5 起诉讼 · 均为应收账款追偿 (原告)' },
          { source: '🏛 海关总署', desc: '进出口企业认证 · AEO', status: 'success', detail: 'AEO 高级认证企业' },
          { source: '🏘 不动产登记中心', desc: '抵押物产权核验', status: 'success', detail: '上海某厂房 · 评估值 ¥6,800 万' },
          { source: '📊 穆迪 / 标普', desc: '国际外部评级', status: 'pending', detail: '尚未评级' },
          { source: '🎯 中诚信 / 大公国际', desc: '国内外部评级', status: 'success', detail: 'BBB+ (中诚信 2024-11-12)' },
        ].map(d => (
          <div key={d.source} style={{ background: 'var(--bg-secondary)', padding: 14, borderRadius: 8, border: `1px solid ${d.status === 'success' ? 'var(--accent-green)' : 'var(--accent-amber)'}33` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{d.source}</span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: d.status === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)', color: d.status === 'success' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                {d.status === 'success' ? '✓ 已获取' : '⏳ 待获取'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>{d.desc}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '6px 8px', background: 'var(--bg-primary)', borderRadius: 4 }}>{d.detail}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ marginTop: 16 }}>🔄 一键刷新所有外部数据 · 预计 30 秒</button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STAGE 3: Due Diligence
// ────────────────────────────────────────────────────────────
function DueDiligenceStage() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔍 步骤 3: 客户经理尽调报告</h3>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>实地走访 + 财务核验 + 行业分析 + 抵押物评估</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* On-site Visit */}
        <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
          <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 12 }}>🏭 实地走访 (On-site Visit)</h4>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <div><strong>走访日期:</strong> 2024-12-08</div>
            <div><strong>走访地点:</strong> 上海闵行某工业园区 (3 个厂区)</div>
            <div><strong>接待人:</strong> 李总 (董事长) · 张总 (CFO) · 王经理 (生产)</div>
            <div><strong>实景观察:</strong></div>
            <div style={{ paddingLeft: 12, marginTop: 4 }}>
              · 厂房 12,000 ㎡ · 工人 280 人 · 现场作业有序<br />
              · 5 条生产线全开 · 月产值约 ¥4,200 万 (与流水一致)<br />
              · 设备账面 ¥6,800 万 · 现场核对一致<br />
              · 库存原材料约 ¥2,400 万 · 在产品 ¥800 万
            </div>
          </div>
        </div>

        {/* Financial Analysis */}
        <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
          <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 12 }}>💰 财务分析 (3 年趋势)</h4>
          <table style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: 6, textAlign: 'left' }}>指标</th>
                <th style={{ padding: 6, textAlign: 'right' }}>2022</th>
                <th style={{ padding: 6, textAlign: 'right' }}>2023</th>
                <th style={{ padding: 6, textAlign: 'right' }}>2024</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['营业收入 (¥M)',  '380', '420', '485'],
                ['净利润 (¥M)',    '32', '38', '46'],
                ['毛利率',         '24%', '25%', '26%'],
                ['资产负债率',     '42%', '45%', '48%'],
                ['流动比率',       '1.8', '1.6', '1.5'],
                ['利息保障倍数',   '4.2', '4.8', '5.4'],
                ['ROE',           '12.5%', '13.2%', '14.1%'],
              ].map((r: any) => (
                <tr key={r[0]} style={{ borderBottom: '1px solid rgba(45,49,72,0.4)' }}>
                  <td style={{ padding: 6 }}>{r[0]}</td>
                  <td style={{ padding: 6, textAlign: 'right', fontFamily: 'monospace' }}>{r[1]}</td>
                  <td style={{ padding: 6, textAlign: 'right', fontFamily: 'monospace' }}>{r[2]}</td>
                  <td style={{ padding: 6, textAlign: 'right', fontFamily: 'monospace', color: 'var(--accent-green)', fontWeight: 700 }}>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Industry Analysis */}
        <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
          <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 12 }}>📈 行业分析</h4>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <div><strong>行业:</strong> 高端装备制造 (国家鼓励类)</div>
            <div><strong>行业景气:</strong> ⭐⭐⭐⭐ 良好 · 国产替代加速</div>
            <div><strong>市场地位:</strong> 国内细分市场前 5 · 客户含三一/中联/徐工</div>
            <div><strong>政策支持:</strong> 国家工业母机重点扶持名单</div>
            <div><strong>风险点:</strong></div>
            <div style={{ paddingLeft: 12, color: 'var(--accent-amber)' }}>
              · 关键芯片依赖进口 (中美贸易风险)<br />
              · 上游钢材价格波动
            </div>
          </div>
        </div>

        {/* Collateral */}
        <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
          <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 12 }}>🏘 抵押物评估</h4>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <div><strong>抵押物 1:</strong> 上海闵行厂房 12,000 ㎡</div>
            <div style={{ paddingLeft: 12 }}>
              · 不动产权证: 沪 (2018) 闵字第 87654 号<br />
              · 评估机构: 上海中诚资产评估<br />
              · 评估值: <strong style={{ color: 'var(--accent-green)' }}>¥ 6,800 万</strong> (2024-12-05)<br />
              · LTV: ¥3,000 万 / ¥6,800 万 = <strong style={{ color: 'var(--accent-green)' }}>44%</strong> ✓ 充足
            </div>
            <div style={{ marginTop: 8 }}><strong>担保人:</strong> 李总 (董事长) 个人连带责任担保</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, padding: 16, background: 'rgba(34,197,94,0.05)', borderLeft: '4px solid var(--accent-green)', borderRadius: 4 }}>
        <strong style={{ color: 'var(--accent-green)' }}>✓ 客户经理结论：</strong> 该客户经营稳健 · 现金流充裕 · 抵押物充足 · 行业前景良好。
        <strong>建议批准 ¥3,000 万 5 年期银团贷款</strong> · 利率建议 LPR + 80bp。
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>客户经理: 王明 · 提交日期: 2024-12-09 · 已交核保</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STAGE 4: Underwriting
// ────────────────────────────────────────────────────────────
function UnderwritingStage() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>⚖️ 步骤 4: 核保 (Underwriting)</h3>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>风险政策匹配 · 模型自动评分 · 提供专业建议</div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
          <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 14 }}>🤖 信用评分模型自动评分</h4>
          {[
            { item: '财务实力',       score: 82, max: 100 },
            { item: '现金流',         score: 78, max: 100 },
            { item: '行业地位',       score: 85, max: 100 },
            { item: '管理能力',       score: 76, max: 100 },
            { item: '担保措施',       score: 88, max: 100 },
            { item: '历史还款',       score: 92, max: 100 },
          ].map(s => (
            <div key={s.item} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{s.item}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{s.score} / {s.max}</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3 }}>
                <div style={{ width: `${(s.score / s.max) * 100}%`, height: '100%', background: s.score >= 80 ? 'var(--accent-green)' : 'var(--accent-amber)', borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-primary)', borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>综合信用评分</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-green)' }}>83.5</div>
            <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>BBB+ 投资级 · 风险可控</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
          <h4 style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 14 }}>📜 风险政策检查 (Policy Check)</h4>
          {[
            { policy: '行业准入: 高端装备制造',    result: '✓ 通过', desc: '国家鼓励行业 · 无限制' },
            { policy: '单户最高额度: ¥ 5,000 万', result: '✓ 通过', desc: '申请 ¥3,000 万 < 限额' },
            { policy: '客户集中度 (单行业 ≤ 10%)', result: '✓ 通过', desc: '当前装备制造行业占比 6.8%' },
            { policy: '关联交易披露',             result: '✓ 通过', desc: '12 家关联方已披露' },
            { policy: '反洗钱筛查',              result: '✓ 通过', desc: '0 制裁名单匹配' },
            { policy: 'PEP 政治公众人物',        result: '✓ 通过', desc: '法人非 PEP' },
            { policy: '抵押物 LTV ≤ 70%',         result: '✓ 通过', desc: 'LTV 44%' },
            { policy: '征信评分 ≥ 600',           result: '✓ 通过', desc: '评分 720' },
            { policy: 'ICAAP 资本占用',           result: '⚠ 关注', desc: '将增加 RWA ¥4,500 万 (在年度预算内)' },
          ].map(p => (
            <div key={p.policy} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <span>{p.policy}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: p.result.includes('通过') ? 'var(--accent-green)' : 'var(--accent-amber)', fontWeight: 700 }}>{p.result}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16, background: 'rgba(168,85,247,0.05)', borderLeft: '4px solid var(--accent-purple)', borderRadius: 4 }}>
        <strong style={{ color: 'var(--accent-purple)' }}>📋 核保员意见：</strong> 模型评分 83.5 (BBB+) · 政策全部通过。
        建议利率 <strong>LPR + 80bp</strong> · 抵押率 44% 充足。<strong>金额 ¥3,000 万超 ¥2,000 万审贷会上会阈值，建议直接提交审贷会。</strong>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>核保员: 刘晓琳 · 提交日期: 2024-12-10</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STAGE 5: Credit Officer
// ────────────────────────────────────────────────────────────
function CreditOfficerStage() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>👨‍💼 步骤 5: 审贷官审批</h3>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>独立审批权 · 不受业务部门考核影响</div>

      <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>陈</div>
          <div>
            <div style={{ fontWeight: 700 }}>陈志远 (高级审贷官)</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>授权额度: ≤ ¥ 2,000 万 · 工号 CO-0042</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="badge badge-amber">本案超额 — 已直送审贷会</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>建议意见: 同意</div>
          </div>
        </div>
        <div style={{ fontSize: 13, padding: 12, background: 'var(--bg-primary)', borderRadius: 4, lineHeight: 1.7 }}>
          "审阅尽调和核保资料后，认为客户经营稳健 · 抵押充足 · 评分良好。<strong>但因金额 ¥3,000 万超过本人 ¥2,000 万审批权限</strong>，
          根据《信贷审批管理办法》第 18 条规定，须提交审贷委员会集体决策。
          <strong>本人建议：同意 · 利率 LPR + 80bp · 抵押率 44%</strong>。"
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STAGE 6: Credit Committee (current stage)
// ────────────────────────────────────────────────────────────
function CreditCommitteeStage() {
  return (
    <div className="card" style={{ padding: 24, border: '2px solid var(--accent-blue)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>🏛 步骤 6: 审贷委员会 (Credit Committee)</h3>
        <span className="badge badge-blue">当前阶段 · 待审议</span>
      </div>

      <div style={{ background: 'rgba(59,130,246,0.05)', padding: 16, borderRadius: 8, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>会议时间</div>
            <div style={{ fontWeight: 700 }}>2024-12-12 14:00</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>会议形式</div>
            <div style={{ fontWeight: 700 }}>线下集中 + 视频参会</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>主持人</div>
            <div style={{ fontWeight: 700 }}>首席风险官 (CRO)</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>本次议案数</div>
            <div style={{ fontWeight: 700 }}>6 个 (本案为第 3 案)</div>
          </div>
        </div>
      </div>

      <h4 style={{ fontWeight: 700, marginBottom: 12 }}>👥 委员投票状态 (7 人 · 简单多数过半)</h4>
      <table className="b-table" style={{ width: '100%', fontSize: 13, marginBottom: 16 }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary)' }}>
            <th style={{ padding: 12 }}>委员</th>
            <th style={{ padding: 12 }}>角色</th>
            <th style={{ padding: 12 }}>投票</th>
            <th style={{ padding: 12 }}>意见 / 附加条件</th>
            <th style={{ padding: 12 }}>时间</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: '张志远', role: '副行长 (主任委员)', vote: 'APPROVE', comment: '同意 · 建议适当上调利率至 LPR + 100bp', time: '15:18' },
            { name: '陈晓东', role: '首席风险官 (CRO)',   vote: 'APPROVE', comment: '同意 · 政策合规 · 风险可控', time: '15:22' },
            { name: '王浩明', role: '对公业务总监',       vote: 'APPROVE', comment: '同意 · 客户是战略合作伙伴', time: '15:25' },
            { name: '李静茹', role: '财务总监',           vote: 'APPROVE_WITH_CONDITION', comment: '同意 · 附加条件：每月提供月报', time: '15:28' },
            { name: '刘晓琳', role: '合规总监',           vote: 'APPROVE', comment: '同意 · 反洗钱合规检查通过', time: '15:30' },
            { name: '赵建国', role: '风险管理部',         vote: 'PENDING', comment: '正在审阅...', time: '—' },
            { name: '陈志诚', role: '审计部',             vote: 'PENDING', comment: '正在审阅...', time: '—' },
          ].map(v => (
            <tr key={v.name} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: 12, fontWeight: 600 }}>{v.name}</td>
              <td style={{ padding: 12, fontSize: 12 }}>{v.role}</td>
              <td style={{ padding: 12 }}>
                <span className={`badge ${v.vote === 'APPROVE' ? 'badge-green' : v.vote === 'APPROVE_WITH_CONDITION' ? 'badge-amber' : v.vote === 'REJECT' ? 'badge-red' : 'badge-gray'}`}>
                  {v.vote === 'APPROVE' ? '✓ 同意' : v.vote === 'APPROVE_WITH_CONDITION' ? '⚠ 附条件同意' : v.vote === 'REJECT' ? '✗ 拒绝' : '⏳ 待投票'}
                </span>
              </td>
              <td style={{ padding: 12, fontSize: 12 }}>{v.comment}</td>
              <td style={{ padding: 12, fontSize: 11, color: 'var(--text-muted)' }}>{v.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: 16, background: 'rgba(34,197,94,0.08)', borderLeft: '4px solid var(--accent-green)', borderRadius: 4 }}>
        <strong style={{ color: 'var(--accent-green)' }}>📊 当前投票情况：</strong> 5 同意 / 0 拒绝 / 2 待投票 ·
        已过半数 (5/7) · <strong>预计 30 分钟内可结案</strong>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button className="btn btn-primary">📝 提交补充材料</button>
        <button className="btn btn-ghost">💬 委员沟通</button>
        <button className="btn btn-ghost">📞 视频会议</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STAGE 7-8: Future stages (preview)
// ────────────────────────────────────────────────────────────
function ApprovedStage() {
  return (
    <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
      <div style={{ fontWeight: 600 }}>步骤 7 · 待审贷会决议后进入此阶段</div>
      <div style={{ fontSize: 12, marginTop: 8 }}>包括：决议书生成 · 法务起草合同 · 客户签约 · 抵押登记</div>
    </div>
  );
}

function DisbursedStage() {
  return (
    <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
      <div style={{ fontWeight: 600 }}>步骤 8 · 签约后进入此阶段</div>
      <div style={{ fontSize: 12, marginTop: 8 }}>包括：资金划拨 · 贷后管理 · 定期回访 · 风险预警 · 五级分类</div>
    </div>
  );
}
