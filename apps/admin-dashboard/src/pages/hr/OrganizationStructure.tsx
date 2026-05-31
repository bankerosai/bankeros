/**
 * Organization Structure Management
 * 总行 → 一级分行 → 二级分行 → 支行 → 部门 → 岗位
 * 树形组织架构 + 编制管理 + 汇报关系
 */

import { useState } from 'react';

interface OrgNode {
  id: string;
  name: string;
  type: 'HQ' | 'REGION' | 'BRANCH' | 'SUB_BRANCH' | 'DEPT' | 'TEAM';
  level: number;
  head: string;
  headcount: number;
  budget?: string;
  children?: OrgNode[];
  metrics?: { aum?: string; loans?: string; profit?: string };
}

const ORG_TREE: OrgNode = {
  id: 'hq', name: 'BankerOS 总行', type: 'HQ', level: 0,
  head: '李志远 (董事长)', headcount: 38000,
  metrics: { aum: '¥ 8.4T', loans: '¥ 1.92T', profit: '¥ 84B/年' },
  children: [
    { id: 'cn-north',  name: '华北区域中心', type: 'REGION', level: 1, head: '张大伟', headcount: 6800, metrics: { aum: '¥ 1.8T', loans: '¥ 420B', profit: '¥ 18B' },
      children: [
        { id: 'bj', name: '北京分行', type: 'BRANCH', level: 2, head: '王浩明', headcount: 2400, metrics: { aum: '¥ 680B', loans: '¥ 142B' },
          children: [
            { id: 'bj-cbd', name: '国贸 CBD 支行', type: 'SUB_BRANCH', level: 3, head: '陈志诚', headcount: 84 },
            { id: 'bj-zgc', name: '中关村支行',  type: 'SUB_BRANCH', level: 3, head: '刘晓琳', headcount: 62 },
          ]},
        { id: 'tj', name: '天津分行', type: 'BRANCH', level: 2, head: '赵建国', headcount: 980 },
        { id: 'sjz', name: '石家庄分行', type: 'BRANCH', level: 2, head: '李静茹', headcount: 620 },
      ]},
    { id: 'cn-east',   name: '华东区域中心', type: 'REGION', level: 1, head: '陈晓东', headcount: 8400, metrics: { aum: '¥ 2.6T', loans: '¥ 580B', profit: '¥ 24B' },
      children: [
        { id: 'sh', name: '上海分行', type: 'BRANCH', level: 2, head: '王明 (主总)', headcount: 3200, metrics: { aum: '¥ 1.2T' },
          children: [
            { id: 'sh-lujiazui', name: '陆家嘴金融支行', type: 'SUB_BRANCH', level: 3, head: '高建国', headcount: 124 },
            { id: 'sh-jingan',   name: '静安支行',       type: 'SUB_BRANCH', level: 3, head: '林志伟', headcount: 86 },
            { id: 'sh-puxi',     name: '浦西支行',       type: 'SUB_BRANCH', level: 3, head: '钱大伟', headcount: 92 },
          ]},
        { id: 'hz', name: '杭州分行', type: 'BRANCH', level: 2, head: '孙丽华', headcount: 1180 },
        { id: 'nj', name: '南京分行', type: 'BRANCH', level: 2, head: '周建明', headcount: 980 },
      ]},
    { id: 'cn-south',  name: '华南区域中心', type: 'REGION', level: 1, head: '吴雪梅', headcount: 7200 },
    { id: 'cn-west',   name: '西南区域中心', type: 'REGION', level: 1, head: '杨海涛', headcount: 4800 },
    { id: 'overseas',  name: '海外业务条线', type: 'REGION', level: 1, head: '李秋萍', headcount: 4200, metrics: { aum: '¥ 1.6T', loans: '¥ 280B', profit: '¥ 14B' },
      children: [
        { id: 'hk',  name: '香港分行',  type: 'BRANCH', level: 2, head: 'Daniel Lam',   headcount: 1240 },
        { id: 'sg',  name: '新加坡分行', type: 'BRANCH', level: 2, head: 'Wei Lin',     headcount: 680 },
        { id: 'lon', name: '伦敦分行',  type: 'BRANCH', level: 2, head: 'James Wilson', headcount: 480 },
        { id: 'ny',  name: '纽约分行',  type: 'BRANCH', level: 2, head: 'Michael Chen', headcount: 380 },
        { id: 'dxb', name: '迪拜分行',  type: 'BRANCH', level: 2, head: 'Ahmed Hassan', headcount: 220 },
      ]},
    { id: 'group-services', name: '集团总部职能', type: 'REGION', level: 1, head: '陈晓东', headcount: 5600,
      children: [
        { id: 'finance', name: '财务部',     type: 'DEPT', level: 2, head: '李静茹', headcount: 280 },
        { id: 'risk',    name: '风险管理部', type: 'DEPT', level: 2, head: '陈晓东', headcount: 320 },
        { id: 'compliance', name: '合规部',   type: 'DEPT', level: 2, head: '刘晓琳', headcount: 180 },
        { id: 'hr',      name: '人力资源部', type: 'DEPT', level: 2, head: '王雪萍', headcount: 240 },
        { id: 'it',      name: 'IT 信息技术部', type: 'DEPT', level: 2, head: '张大伟', headcount: 1800 },
        { id: 'audit',   name: '审计部',     type: 'DEPT', level: 2, head: '陈志诚', headcount: 180 },
      ]},
  ],
};

const TYPE_COLORS: Record<string, string> = {
  HQ: '#ec4899', REGION: '#8b5cf6', BRANCH: '#3b82f6', SUB_BRANCH: '#22c55e', DEPT: '#f59e0b', TEAM: '#94a3b8',
};

const TYPE_LABELS: Record<string, string> = {
  HQ: '总行', REGION: '区域中心', BRANCH: '分行', SUB_BRANCH: '支行', DEPT: '部门', TEAM: '团队',
};

function OrgNodeView({ node, depth = 0, defaultExpanded = false }: { node: OrgNode; depth?: number; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded || depth < 2);

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div
        onClick={() => node.children && setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
          background: depth === 0 ? 'rgba(236,72,153,0.08)' : depth === 1 ? 'rgba(139,92,246,0.06)' : 'var(--bg-secondary)',
          borderRadius: 8, marginBottom: 4, cursor: node.children ? 'pointer' : 'default',
          border: `1px solid ${TYPE_COLORS[node.type]}33`,
          borderLeft: `4px solid ${TYPE_COLORS[node.type]}`,
        }}>
        {node.children && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 16 }}>{expanded ? '▼' : '▶'}</span>
        )}
        {!node.children && <span style={{ width: 16 }}></span>}

        <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700,
          background: `${TYPE_COLORS[node.type]}22`, color: TYPE_COLORS[node.type] }}>
          {TYPE_LABELS[node.type]}
        </span>

        <span style={{ fontWeight: depth < 2 ? 700 : 600, fontSize: depth < 2 ? 15 : 13, flex: 1 }}>{node.name}</span>

        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>👤 {node.head}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 80, textAlign: 'right' }}>
          编制: <strong>{node.headcount.toLocaleString()}</strong>
        </span>

        {node.metrics?.aum && (
          <span style={{ fontSize: 11, color: 'var(--accent-green)', minWidth: 100, textAlign: 'right' }}>
            AUM: {node.metrics.aum}
          </span>
        )}

        <button style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
          管理
        </button>
      </div>

      {expanded && node.children && (
        <div style={{ marginLeft: 16, borderLeft: '2px dashed var(--border)', paddingLeft: 8 }}>
          {node.children.map(child => <OrgNodeView key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function OrganizationStructure() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🏢 组织架构管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          总行 → 区域中心 → 分行 → 支行 → 部门 树形结构 · 编制管理 · 汇报关系
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '总编制', value: '38,000+', color: 'var(--accent-blue)' },
          { label: '区域中心', value: '5', sub: '4 国内 + 1 海外' },
          { label: '分行', value: '142', sub: '38 国家' },
          { label: '支行/网点', value: '2,840' },
          { label: '总部部门', value: '24' },
          { label: '海外员工', value: '4,200', color: 'var(--accent-purple)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <input type="text" placeholder="🔍 搜索部门/分行/员工..." style={{
            flex: 1, padding: '10px 14px', background: 'var(--bg-secondary)',
            border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)',
          }} />
          <select style={{ padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)' }}>
            <option>全部类型</option><option>总行</option><option>区域中心</option><option>分行</option><option>支行</option><option>部门</option>
          </select>
          <button className="btn btn-primary">+ 新增机构</button>
          <button className="btn btn-ghost">📤 导出</button>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="section-header"><span className="section-title">🌲 组织架构树</span><button className="btn btn-ghost" style={{ fontSize: 12 }}>📊 切换为组织图</button></div>
        <OrgNodeView node={ORG_TREE} depth={0} defaultExpanded />
      </div>
    </div>
  );
}
