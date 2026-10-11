import { Children, Fragment, cloneElement, isValidElement, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type GlossaryEntry = { label: string; aliases: string[]; fullName: string };
type Glossary = Record<string, GlossaryEntry>;

function useGlossary() {
  const { t } = useTranslation();
  return t('abbreviationHelp.terms', { returnObjects: true }) as Glossary;
}

// Match complete abbreviations, including German compounds, without touching
// exported identifiers or the SIT-Insight product name.
function termsIn(text: string, glossary: Glossary) {
  const aliases = Object.entries(glossary).flatMap(([term, entry]) => entry.aliases.map(alias => ({ term, alias })));
  const byAlias = new Map(aliases.map(({ term, alias }) => [alias, term]));
  const alternatives = [...byAlias.keys()].sort((a, b) => b.length - a.length).map(alias => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${alternatives})(?![\\p{L}\\p{N}_])`, 'gu');
  return [...text.matchAll(pattern)].filter(match => !(match[0] === 'SIT' && /^[-‑–]Insight/.test(text.slice(match.index! + match[0].length)))).map(match => ({ index: match.index!, label: match[0], term: byAlias.get(match[0])! }));
}

export function AbbreviationHelp({ term, children }: { term: string; children?: ReactNode }) {
  const { t } = useTranslation();
  const glossary = useGlossary();
  const [open, setOpen] = useState(false);
  const entry = glossary[term];
  if (!entry) return <>{children}</>;
  const abbreviation = Children.toArray(children).filter(child => typeof child === 'string').join('') || entry.label;
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-abbreviation={term}
          aria-label={t('abbreviationHelp.helpLabel', { abbreviation, fullName: entry.fullName })}
          className="inline cursor-help rounded-sm [font:inherit] underline decoration-dotted underline-offset-4 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={event => { event.preventDefault(); setOpen(true); }}
        >{children ?? entry.label}</button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="text-sm">{entry.fullName}</TooltipContent>
    </Tooltip>
  );
}

function explainString(text: string, glossary: Glossary) {
  const parts: ReactNode[] = [];
  let offset = 0;
  for (const match of termsIn(text, glossary)) {
    parts.push(text.slice(offset, match.index));
    parts.push(<AbbreviationHelp key={match.index} term={match.term}>{match.label}</AbbreviationHelp>);
    offset = match.index + match.label.length;
  }
  parts.push(text.slice(offset));
  return parts;
}

// Keep rich translations intact. Only ordinary text and emphasis are annotated;
// link and button components remain single, independently operable controls.
function ExplainedTranslation(props: ComponentProps<typeof Trans>) {
  const { t } = useTranslation();
  const glossary = useGlossary();
  const components: Record<string, ReactElement> = {
    ...props.components,
    ...Object.fromEntries(Object.keys(glossary).map(term => [`glossary${term}`, <AbbreviationHelp term={term} />])),
  };
  const translate = ((key: string, options: any) => {
    const value = t(key, options);
    if (typeof value !== 'string') return value;
    const blockedTags: string[] = [];
    return value.split(/(<[^>]+>)/g).map(part => {
      const tag = part.match(/^<(\/)?([\w]+)[^>]*?(\/?)>$/);
      if (tag) {
        if (tag[1]) {
          if (blockedTags.at(-1) === tag[2]) blockedTags.pop();
        } else if (!tag[3]) {
          const component = components[tag[2]];
          if (blockedTags.length || !['strong', 'em', 'b', 'i', 'span', 'nowrap'].includes(tag[2]) && component) blockedTags.push(tag[2]);
        }
        return part;
      }
      if (blockedTags.length) return part;
      let offset = 0;
      let result = '';
      for (const match of termsIn(part, glossary)) {
        const name = `glossary${match.term}`;
        result += part.slice(offset, match.index) + `<${name}>${match.label}</${name}>`;
        offset = match.index + match.label.length;
      }
      return result + part.slice(offset);
    }).join('');
  }) as typeof t;
  return <Trans {...props} t={translate} components={components} />;
}

/** Apply only to prose, never page containers, headings, controls or data labels. */
export function ExplainedText({ children }: { children: ReactNode }) {
  const glossary = useGlossary();
  const explain = (nodes: ReactNode): ReactNode => Children.map(nodes, node => {
    if (typeof node === 'string') return explainString(node, glossary);
    if (!isValidElement<{ children?: ReactNode }>(node)) return node;
    if (node.type === Trans) return <ExplainedTranslation {...node.props} />;
    if (node.type === Fragment || typeof node.type === 'string' && ['span', 'strong', 'em', 'b', 'i', 'small'].includes(node.type)) {
      return cloneElement(node, {}, explain(node.props.children));
    }
    return node;
  });
  return <>{explain(children)}</>;
}

export function Prose({ children, ...props }: ComponentProps<'p'>) {
  return <p {...props}><ExplainedText>{children}</ExplainedText></p>;
}

/** Tooltips expand terms in place, avoiding nested interactive hover popups. */
export function ExpandedAbbreviations({ children }: { children: string }) {
  const glossary = useGlossary();
  const seen = new Set<string>();
  let offset = 0;
  let result = '';
  for (const match of termsIn(children, glossary)) {
    result += children.slice(offset, match.index) + match.label;
    const fullName = glossary[match.term].fullName;
    if (!seen.has(match.term) && !children.toLocaleLowerCase().includes(fullName.toLocaleLowerCase())) result += ` (${fullName})`;
    seen.add(match.term);
    offset = match.index + match.label.length;
  }
  return <>{result + children.slice(offset)}</>;
}
