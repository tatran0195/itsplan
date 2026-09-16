import type { ComponentProps } from 'react';
import { cn } from '../lib/utils';

export function repoMark({
  className,
  title = 'repo',
  variant = 'tile',
  ...props
}: ComponentProps<'svg'> & { title?: string; variant?: 'tile' | 'bare' }) {
  return (
    <svg
      aria-label={title}
      className={cn(variant === 'tile' && 'overflow-hidden rounded-[22%]', className)}
      role="img"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {variant === 'tile' ? <rect fill="#181612" height="512" rx="104" width="512" /> : null}
      <path
        d="M148 368V144L364 368V144"
        fill="none"
        stroke={variant === 'tile' ? '#FBF7EE' : 'currentColor'}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="88"
      />
    </svg>
  );
}

export function repoWordmark({
  className,
  title = 'repo',
  ...props
}: ComponentProps<'span'> & { title?: string }) {
  // The brand name is always set in Latin script "repo", including in
  // Arabic-locale UI (same as how "Mintlify" stays Latin in Arabic copy).
  return (
    <span
      aria-label={title}
      className={cn(
        'inline-block leading-none font-extrabold tracking-normal select-none',
        className,
      )}
      dir="ltr"
      role="img"
      {...props}
    >
      repo
    </span>
  );
}
