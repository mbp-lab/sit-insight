import { useId, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from './ui/utils';

interface InterpretationNoteProps {
  title?: ReactNode;
  children: ReactNode;
  id?: string;
  titleId?: string;
  headingAs?: 'h2' | 'h3';
  className?: string;
}

export function InterpretationNote({ title, children, id, titleId, headingAs: Heading = 'h2', className }: InterpretationNoteProps) {
  const generatedTitleId = useId();
  const headingId = titleId ?? generatedTitleId;

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn('flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-900', className)}
    >
      <AlertTriangle size={16} className="shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        {title && <Heading id={headingId} className="text-xs font-bold leading-relaxed">{title}</Heading>}
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
    </section>
  );
}
