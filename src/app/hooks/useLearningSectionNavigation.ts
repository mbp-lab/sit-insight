import { useEffect, useRef, type MouseEvent } from 'react';

export function useLearningSectionNavigation(pageKey?: string) {
  const highlightRef = useRef<Animation | null>(null);

  useEffect(() => () => highlightRef.current?.cancel(), [pageKey]);

  return (event: MouseEvent<HTMLAnchorElement>, headingId: string, sectionId: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const heading = document.getElementById(headingId);
    const section = document.getElementById(sectionId);
    if (!heading || !section) return;
    event.preventDefault();

    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ behavior: 'auto', block: 'start' });
    highlightRef.current?.cancel();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const highlight = {
      backgroundColor: 'var(--color-teal-100)',
      boxShadow: '0 0 0 12px var(--color-teal-100)',
    };
    const clear = { backgroundColor: 'transparent', boxShadow: '0 0 0 12px transparent' };
    // Keep dark text legible during one pulse; reduced motion gets a brief static cue.
    highlightRef.current = section.animate(
      reducedMotion ? [highlight, highlight] : [
        { ...clear, offset: 0 },
        { ...highlight, offset: 0.15 },
        { ...highlight, offset: 0.4 },
        { ...clear, offset: 1 },
      ],
      { duration: reducedMotion ? 1200 : 2200, easing: 'ease-out' },
    );
  };
}
