import { useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from 'react';
import { Activity, ArrowDown, ArrowRight, Stethoscope } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { InterpretationNote } from './InterpretationNote';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

function ScoreExplanationLink({ children, label, onClick }: {
  children?: ReactNode;
  label: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href="#learning-process-title"
      aria-label={label}
      onClick={onClick}
      className="text-teal-700 underline underline-offset-4 hover:text-teal-900 focus-visible:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      {children}<ArrowDown size={12} className="ml-1 inline-block align-text-bottom" aria-hidden="true" focusable="false" />
    </a>
  );
}

function AbbreviationHelp({ term }: { term: 'sit' | 'ai' | 'asc' | 'adhd' }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const abbreviation = t(`learningOverview.abbreviations.${term}.label`);
  const fullName = t(`learningOverview.abbreviations.${term}.fullName`);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={t('learningOverview.abbreviations.helpLabel', { abbreviation, fullName })}
          className="rounded-sm underline decoration-dotted underline-offset-4 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={(event) => {
            // Keep help open on touch/click as well as the tooltip's hover and focus triggers.
            event.preventDefault();
            setOpen(true);
          }}
        >
          {abbreviation}
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="max-w-64 text-sm">{fullName}</TooltipContent>
    </Tooltip>
  );
}

interface LearningOverviewProps {
  onOpenScreening: () => void;
  onOpenAssessment: () => void;
}

export function LearningOverview({ onOpenScreening, onOpenAssessment }: LearningOverviewProps) {
  const { t } = useTranslation();
  const processHeadingRef = useRef<HTMLHeadingElement>(null);
  const processSectionRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<Animation | null>(null);

  useEffect(() => () => highlightRef.current?.cancel(), []);

  const showScoreExplanation: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const heading = processHeadingRef.current;
    const section = processSectionRef.current;
    if (!heading || !section) return;

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

  const abbreviationHelp = {
    nowrap: <span className="whitespace-nowrap" />,
    sit: <AbbreviationHelp term="sit" />,
    ai: <AbbreviationHelp term="ai" />,
    asc: <AbbreviationHelp term="asc" />,
    adhd: <AbbreviationHelp term="adhd" />,
  };
  const actionClassName = 'inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';

  return (
    <article className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 break-words">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">{t('learningOverview.title')}</h1>
        <p className="text-sm text-gray-600 leading-relaxed"><Trans i18nKey="learningOverview.introduction" components={abbreviationHelp} /></p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section aria-labelledby="learning-screening-title" className="flex flex-col gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Activity size={20} className="text-teal-600 shrink-0 mt-1" aria-hidden="true" />
            <h2 id="learning-screening-title" className="text-lg font-bold text-gray-900 min-w-0">{t('learningOverview.screening.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed"><Trans i18nKey="learningOverview.screening.description" components={{
            ...abbreviationHelp,
            scoreExplanation: <ScoreExplanationLink label={t('learningOverview.screening.explanationLinkLabel')} onClick={showScoreExplanation} />,
          }} /></p>
          <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.screening.threshold')}</p>
          <button type="button" onClick={onOpenScreening} className={`${actionClassName} mt-auto self-start`}>
            {t('learningOverview.screening.action')}
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </button>
        </section>

        <section aria-labelledby="learning-assessment-title" className="flex flex-col gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Stethoscope size={20} className="text-teal-600 shrink-0 mt-1" aria-hidden="true" />
            <h2 id="learning-assessment-title" className="text-lg font-bold text-gray-900 min-w-0">{t('learningOverview.assessment.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed"><Trans i18nKey="learningOverview.assessment.description" components={{
            ...abbreviationHelp,
            scoreExplanation: <ScoreExplanationLink label={t('learningOverview.assessment.explanationLinkLabel')} onClick={showScoreExplanation} />,
          }} /></p>
          <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.assessment.interpretation')}</p>
          <button type="button" onClick={onOpenAssessment} className={`${actionClassName} mt-auto self-start`}>
            {t('learningOverview.assessment.action')}
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </button>
        </section>
      </div>

      <section ref={processSectionRef} aria-labelledby="learning-process-title" className="space-y-4 rounded-lg">
        <h2 ref={processHeadingRef} id="learning-process-title" tabIndex={-1} className="scroll-mt-4 text-lg font-bold text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600">{t('learningOverview.process.title')}</h2>
        <ol className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {(['recording', 'training', 'score'] as const).map((step, index) => (
            <li key={step} className="min-w-0 border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold tabular-nums text-teal-600" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-sm font-bold text-gray-900">{t(`learningOverview.process.${step}.title`)}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed"><Trans i18nKey={`learningOverview.process.${step}.description`} components={abbreviationHelp} /></p>
            </li>
          ))}
        </ol>
        <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.practicalUse')}</p>
      </section>

      <section aria-labelledby="learning-information-title" className="space-y-4">
        <h2 id="learning-information-title" className="text-lg font-bold text-gray-900">{t('learningOverview.information.title')}</h2>
        <dl className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm leading-relaxed">
          {(['measurement', 'reference', 'model'] as const).map((kind) => (
            <div key={kind} className="border-t border-gray-200 pt-4 space-y-1">
              <dt className="font-bold text-gray-900">{t(`learningOverview.information.${kind}.label`)}</dt>
              <dd className="text-gray-600">{t(`learningOverview.information.${kind}.description`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <InterpretationNote
        title={t('learningOverview.interpretation.title')}
        titleId="learning-interpretation-title"
      >
        {t('learningOverview.interpretation.description')}
      </InterpretationNote>
    </article>
  );
}
