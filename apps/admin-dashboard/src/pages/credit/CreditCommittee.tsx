/**
 * Credit Committee Management
 * 审贷委员会 — 重大额度集体决策
 */

export default function CreditCommittee() {
  const COMMITTEES = [
    { date: '2024-12-12', time: '14:00-17:30', chair: '张志远 (副行长)', items: 6, status: 'IN_PROGRESS', members: 7 },
    { date: '2024-12-05', time: '14:00-16:00', chair: '张志远 (副行长)', items: 5, status: 'COMPLETED',   members: 7, approved: 4, rejected: 1 },
    { date: '2024-11-28', time: '14:00-17:00', chair: '张志远 (副行长)', items: 7, status: 'COMPLETED',   members: 6, approved: 6, rejected: 1 },
    { date: '2024-11-21', time: '14:00-15:30', chair: '王浩明 (代理)',   items: 3, status: 'COMPLETED',   members: 5, approved: 3, rejected: 0 },
  ];

  const TODAY_AGENDA = [
    { no: 1, customer: '光明乳业集团', amount: '¥ 5,000 万', product: '银团贷款', rm: '李静',  rating: 'A',  status: 'APPROVED' },
    { no: 2, customer: '复星医药',    amount: '¥ 8,000 万', product: '并购融资', rm: '王浩明', rating: 'BBB', status: 'APPROVED_WITH_CONDITION' },
    { no: 3, customer: 'ACME 制造集团', amount: '¥ 3,000 万', product: '银团贷款', rm: '王明',  rating: 'BBB+', status: 'IN_REVIEW' },
    { no: 4, customer: '某地产集团',  amount: '¥ 12,000 万', product: '开发贷款', rm: '陈志远', rating: 'BB', status: 'PENDING' },
    { no: 5, customer: '某能源公司',  amount: '¥ 6,000 万', product: '项目融资', rm: '刘晓琳', rating: 'BBB', status: 'PENDING' },
    { no: 6, customer: '某科技公司',  amount: '¥ 2,500 万', product: '流贷',     rm: '张大伟', rating: 'A',  status: 'PENDING' },
  ];

  const COMMITTEE_MEMBERS = [
    { name: '张志远', role: '副行长 · 主任委员',     authority: '¥ 1 亿+', voted: 1, votes: '5/5' },
    { name: '陈晓东', role: '首席风险官 (CRO)',     authority: '¥ 5,000 万', voted: 1, votes: '5/5' },
    { name: '王浩明', role: '对公业务总监',         authority: '¥ 3,000 万', voted: 1, votes: '5/5' },
    { name: '李静茹', role: '财务总监 (CFO)',       authority: '¥ 3,000 万', voted: 1, votes: '5/5' },
    { name: '刘晓琳', role: '合规总监',             authority: '¥ 2,000 万', voted: 1, votes: '5/5' },
    { name: '赵建国', role: '风险管理部 (二线)',     authority: '¥ 2,000 万', voted: 0, votes: '0/5' },
    { name: '陈志诚', role: '审计部 (三线)',         authority: '观察员',     voted: 0, votes: '0/5' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🏛 审贷委员会管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          重大额度集体决策 (≥ ¥2,000 万) · 7 名委员 · 简单多数通过 · 严格独立性
        </p>
      </div>

      {/* Current Meeting */}
      <div className="card" style={{ marginBottom: 20, padding: 24, borderColor: 'var(--accent-blue)', borderWidth: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <span className="badge badge-blue">🔴 LIVE 进行中</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>2024-12-12 审贷会 · 进行中</h2>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>主持: 张志远 副行长 · 6 议案 · 已审议 2 个 · 当前第 3 案</div>
          </div>
          <button className="btn btn-primary">📞 加入视频会议</button>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, marginTop: 16 }}>📋 今日议程 (6 议案)</h3>
        <table className="b-table" style={{ width: '100%', fontSize: 13, marginBottom: 16 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12, textAlign: 'center' }}>#</th>
              <th style={{ padding: 12 }}>客户</th>
              <th style={{ padding: 12, textAlign: 'right' }}>金额</th>
              <th style={{ padding: 12 }}>产品</th>
              <th style={{ padding: 12 }}>客户经理</th>
              <th style={{ padding: 12 }}>评级</th>
              <th style={{ padding: 12 }}>决议结果</th>
            </tr>
          </thead>
          <tbody>
            {TODAY_AGENDA.map(a => (
              <tr key={a.no} style={{ borderBottom: '1px solid var(--border)', background: a.status === 'IN_REVIEW' ? 'rgba(59,130,246,0.05)' : 'transparent' }}>
                <td style={{ padding: 12, textAlign: 'center', fontWeight: 700 }}>{a.no}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{a.customer}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-red)' }}>{a.amount}</td>
                <td style={{ padding: 12 }}><span className="badge badge-blue">{a.product}</span></td>
                <td style={{ padding: 12 }}>{a.rm}</td>
                <td style={{ padding: 12, fontFamily: 'monospace', fontWeight: 700 }}>{a.rating}</td>
                <td style={{ padding: 12 }}>
                  {a.status === 'APPROVED' && <span className="badge badge-green">✓ 通过</span>}
                  {a.status === 'APPROVED_WITH_CONDITION' && <span className="badge badge-amber">⚠ 附条件通过</span>}
                  {a.status === 'IN_REVIEW' && <span className="badge badge-blue">⏳ 审议中</span>}
                  {a.status === 'PENDING' && <span className="badge badge-gray">待审议</span>}
                  {a.status === 'REJECTED' && <span className="badge badge-red">✗ 拒绝</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Committee Members */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <span className="section-title">👥 审贷委员会成员</span>
          <span className="badge badge-blue">7 名委员 · 5 人到会</span>
        </div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>委员</th>
              <th style={{ padding: 12 }}>角色</th>
              <th style={{ padding: 12 }}>独立审批权限</th>
              <th style={{ padding: 12 }}>本次到会</th>
              <th style={{ padding: 12, textAlign: 'right' }}>已投票数</th>
            </tr>
          </thead>
          <tbody>
            {COMMITTEE_MEMBERS.map(m => (
              <tr key={m.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontWeight: 700 }}>{m.name}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{m.role}</td>
                <td style={{ padding: 12, fontSize: 12, color: 'var(--accent-amber)', fontWeight: 600 }}>{m.authority}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge ${m.voted ? 'badge-green' : 'badge-gray'}`}>
                    {m.voted ? '✓ 已签到' : '未签到'}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{m.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">📚 历次会议记录</span>
          <button className="btn btn-ghost" style={{ fontSize: 12 }}>查看完整档案</button>
        </div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>日期</th>
              <th style={{ padding: 12 }}>时长</th>
              <th style={{ padding: 12 }}>主持人</th>
              <th style={{ padding: 12 }}>议案数</th>
              <th style={{ padding: 12 }}>到会人数</th>
              <th style={{ padding: 12 }}>结果</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {COMMITTEES.map(c => (
              <tr key={c.date} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{c.date}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{c.time}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{c.chair}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{c.items}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{c.members}</td>
                <td style={{ padding: 12, fontSize: 12 }}>
                  {c.approved !== undefined && (
                    <>
                      <span style={{ color: 'var(--accent-green)' }}>✓ {c.approved} 通过</span>
                      {c.rejected !== undefined && c.rejected > 0 && (
                        <span style={{ color: 'var(--accent-red)', marginLeft: 8 }}>✗ {c.rejected} 拒绝</span>
                      )}
                    </>
                  )}
                </td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${c.status === 'IN_PROGRESS' ? 'blue' : 'green'}`}>
                    {c.status === 'IN_PROGRESS' ? '进行中' : '已结束'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
