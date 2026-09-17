import type { ReactNode } from 'react';
import type { Locale } from './locales';

export type TranslationValues = Record<
  string,
  string | number | boolean | Date | null | undefined | ((chunks: ReactNode) => ReactNode)
>;

/** Extract clauses from ICU plural or select body like `=0 {none} one {# item} other {# items}` */
function parseIcuClauses(body: string): Map<string, string> {
  const clauses = new Map<string, string>();
  let i = 0;
  const len = body.length;

  while (i < len) {
    // Skip whitespace
    while (i < len && /\s/.test(body[i]!)) i++;
    if (i >= len) break;

    // Read selector (e.g. '=0', 'one', 'other', 'accepted')
    const selectorStart = i;
    while (i < len && !/\s|\{/.test(body[i]!)) i++;
    const selector = body.slice(selectorStart, i).trim();

    // Skip whitespace until '{'
    while (i < len && /\s/.test(body[i]!)) i++;
    if (i >= len || body[i] !== '{') break;
    i++; // skip '{'

    // Read balanced content
    let depth = 1;
    const contentStart = i;
    while (i < len && depth > 0) {
      if (body[i] === '{') depth++;
      else if (body[i] === '}') depth--;
      i++;
    }
    const content = body.slice(contentStart, i - 1);
    if (selector) {
      clauses.set(selector, content);
    }
  }

  return clauses;
}

const pluralRulesCache = new Map<string, Intl.PluralRules>();
function getPluralRules(locale: string): Intl.PluralRules {
  let rules = pluralRulesCache.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralRulesCache.set(locale, rules);
  }
  return rules;
}

/** Formats an ICU message string with variables, plurals, and selects. */
export function formatMessage(
  pattern: string,
  values?: TranslationValues,
  locale: Locale = 'en',
): string {
  if (!pattern || !values) return pattern;

  let result = '';
  let i = 0;
  const len = pattern.length;

  while (i < len) {
    if (pattern[i] === '{') {
      let depth = 1;
      const start = i + 1;
      i++;
      while (i < len && depth > 0) {
        if (pattern[i] === '{') depth++;
        else if (pattern[i] === '}') depth--;
        i++;
      }

      if (depth === 0) {
        const expression = pattern.slice(start, i - 1).trim();
        const firstComma = expression.indexOf(',');

        if (firstComma === -1) {
          // Simple variable: {varName}
          const val = values[expression];
          result += val !== undefined && val !== null ? String(val) : `{${expression}}`;
        } else {
          const varName = expression.slice(0, firstComma).trim();
          const rest = expression.slice(firstComma + 1).trim();
          const secondComma = rest.indexOf(',');

          if (secondComma === -1) {
            result += `{${expression}}`;
          } else {
            const type = rest.slice(0, secondComma).trim();
            const body = rest.slice(secondComma + 1).trim();

            if (type === 'plural') {
              const countVal = values[varName];
              const count = Number(countVal ?? 0);
              const clauses = parseIcuClauses(body);

              // 1. Exact match e.g. '=0' or '=1'
              let chosen = clauses.get(`=${count}`);
              if (chosen === undefined) {
                // 2. Plural rule match e.g. 'one', 'other'
                const rule = getPluralRules(locale).select(count);
                chosen = clauses.get(rule) ?? clauses.get('other');
              }

              if (chosen !== undefined) {
                const replacedHash = chosen.replaceAll('#', String(count));
                result += formatMessage(replacedHash, values, locale);
              } else {
                result += `{${expression}}`;
              }
            } else if (type === 'select') {
              const selectVal = String(values[varName] ?? '');
              const clauses = parseIcuClauses(body);
              const chosen = clauses.get(selectVal) ?? clauses.get('other');

              if (chosen !== undefined) {
                result += formatMessage(chosen, values, locale);
              } else {
                result += `{${expression}}`;
              }
            } else {
              result += `{${expression}}`;
            }
          }
        }
      } else {
        result += pattern.slice(start - 1);
        break;
      }
    } else {
      result += pattern[i];
      i++;
    }
  }

  return result;
}

/** Formats rich text containing XML-like tags such as `<terms>Terms of Service</terms>` */
export function formatRichMessage(
  pattern: string,
  values?: TranslationValues,
  locale: Locale = 'en',
): ReactNode {
  const formatted = formatMessage(pattern, values, locale);

  if (!values || !/<([a-zA-Z0-9_]+)>([\s\S]*?)<\/\1>/.test(formatted)) {
    return formatted;
  }

  const nodes: ReactNode[] = [];
  const tagRegex = /<([a-zA-Z0-9_]+)>([\s\S]*?)<\/\1>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(formatted)) !== null) {
    const [fullMatch, tagName, innerText] = match;
    const matchStart = match.index;

    if (matchStart > lastIndex) {
      nodes.push(formatted.slice(lastIndex, matchStart));
    }

    const handler = values[tagName!];
    if (typeof handler === 'function') {
      const children = formatRichMessage(innerText!, values, locale);
      nodes.push(handler(children));
    } else {
      nodes.push(fullMatch);
    }

    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < formatted.length) {
    nodes.push(formatted.slice(lastIndex));
  }

  return nodes.length === 1 ? nodes[0] : nodes;
}
