import { ArrowDown } from 'lucide-react';
import type { MouseEventHandler, ReactNode } from 'react';

export function LearningSectionLink({ children, targetId, label, onClick }: {
  children?: ReactNode;
  targetId: string;
  label?: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href={`#${targetId}`}
      aria-label={label}
      onClick={onClick}
      className="text-teal-700 underline underline-offset-4 hover:text-teal-900 focus-visible:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      {children}<ArrowDown size={12} className="ml-1 inline-block align-text-bottom" aria-hidden="true" focusable="false" />
    </a>
  );
}
