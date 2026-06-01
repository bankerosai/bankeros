/**
 * Tiny zero-dependency markdown renderer for assistant messages.
 * Handles: headings (#..####), bold **x**, italic *x*, inline `code`,
 * fenced ```code blocks```, bullet/numbered lists, blockquotes, links,
 * tables (GFM), horizontal rules, and paragraph wrapping.
 *
 * Not a full CommonMark implementation — calibrated for LLM output quality.
 */
import { ReactNode } from 'react';

export function Markdown({ text }: { text: string }) {
  return <div className="copilot-md">{render(text)}</div>;
}

function render(text: string): ReactNode {
  if (!text) return null;

  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const nk = () => `n${key++}`;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] || '';
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```\s*$/)) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      out.push(
        <pre key={nk()} className="md-code">
          <code data-lang={lang}>{buf.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // Heading
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const Tag = (`h${h[1].length}` as 'h1') as keyof JSX.IntrinsicElements;
      out.push(<Tag key={nk()}>{inline(h[2])}</Tag>);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(\*\*\*|---|___)\s*$/.test(line)) {
      out.push(<hr key={nk()} />);
      i++;
      continue;
    }

    // Blockquote (group consecutive)
    if (line.startsWith('> ')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(<blockquote key={nk()}>{inline(buf.join(' '))}</blockquote>);
      continue;
    }

    // Table (GFM)
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*[-:]+\s*\|/.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      out.push(
        <table key={nk()} className="md-table">
          <thead>
            <tr>{header.map((h, j) => (
              <th key={j}>{inline(h)}</th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td key={ci}>{inline(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }

    // Bullet list
    if (/^[*\-+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[*\-+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[*\-+]\s+/, ''));
        i++;
      }
      out.push(
        <ul key={nk()}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      out.push(
        <ol key={nk()}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Blank line → paragraph break
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph: collect until blank or special line
    const paraBuf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,4} |```|>|[*\-+] |\d+\. |---|___|\*\*\*)/.test(lines[i]) &&
      !lines[i].includes('|')
    ) {
      paraBuf.push(lines[i]);
      i++;
    }
    out.push(<p key={nk()}>{inline(paraBuf.join(' '))}</p>);
  }

  return out;
}

function splitRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((c) => c.trim());
}

/** Inline-level markdown → React fragments. Recognises @entity mentions as chips. */
function inline(text: string): ReactNode {
  const out: ReactNode[] = [];
  // Order matters: more specific tokens first.
  const re =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))|(@(?:CIF-[A-Z0-9]+|APP-\d{4}-\d+|LC\d{4}-\d+))/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('`')) {
      out.push(
        <code key={key++} className="md-inline-code">
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith('**')) {
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith('*')) {
      out.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    } else if (tok.startsWith('@')) {
      out.push(<MentionChip key={key++} ref_={tok.slice(1)} />);
    } else if (tok.startsWith('[')) {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (lm) {
        out.push(
          <a key={key++} href={lm[2]} target="_blank" rel="noopener noreferrer">
            {lm[1]}
          </a>,
        );
      } else {
        out.push(tok);
      }
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Renders @CIF-XXX / @APP-XXXX-XXX / @LCXXXX-XXX as a coloured pill that
 *  links to the corresponding BankerOS page (best-effort URL guess). */
function MentionChip({ ref_ }: { ref_: string }) {
  let kind: 'customer' | 'loan' | 'lc' = 'customer';
  let href = '#';
  if (ref_.startsWith('CIF-')) {
    kind = 'customer';
    href = `/admin/customers/${ref_}`;
  } else if (ref_.startsWith('APP-')) {
    kind = 'loan';
    href = `/admin/credit-workflow/applications/${ref_}`;
  } else if (ref_.startsWith('LC')) {
    kind = 'lc';
    href = `/business/trade?lc=${ref_}`;
  }
  return (
    <a href={href} className={`md-mention md-mention-${kind}`} title={`跳转到 ${ref_}`}>
      @{ref_}
    </a>
  );
}
