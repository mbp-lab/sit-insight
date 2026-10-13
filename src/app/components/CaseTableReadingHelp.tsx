import { useTranslation } from 'react-i18next';
import { Prose } from './AbbreviationHelp';

const entries = ['patientValue', 'referenceMean', 'standardizedDeviation', 'referencePercentile'] as const;

/** Definitions for case/reference tables, which differ from Learning group summaries. */
export function CaseTableReadingHelp() {
  const { t } = useTranslation();

  return <details className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
    <summary className="cursor-pointer font-semibold rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
      {t('caseTableHelp.title')}
    </summary>
    <dl className="mt-3 space-y-3 leading-relaxed">
      {entries.map(entry => <div key={entry}>
        <dt className="font-semibold">{t(`caseTableHelp.${entry}.title`)}</dt>
        <dd className="mt-1"><Prose>{t(`caseTableHelp.${entry}.body`)}</Prose></dd>
      </div>)}
    </dl>
  </details>;
}
