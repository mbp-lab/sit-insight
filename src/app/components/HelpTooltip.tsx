import { useState, type ReactElement, type ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

/** Help-only triggers also open on touch; navigation tooltips stay independent. */
export function HelpTooltip({ children, content, className }: { children: ReactElement; content: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild onClick={event => { event.preventDefault(); setOpen(true); }}>
        {children}
      </TooltipTrigger>
      <TooltipContent sideOffset={8} className={className}>{content}</TooltipContent>
    </Tooltip>
  );
}
