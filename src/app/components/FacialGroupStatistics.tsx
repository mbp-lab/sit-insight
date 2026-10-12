import { useTranslation } from 'react-i18next';
import { Prose } from './AbbreviationHelp';
import { FacialFeatureLabel } from './FacialFeatureLabel';

type GroupStatistics = {
  mean: number;
  std: number;
  median: number;
  iqr: number;
  valid_n: number;
};
type FacialStatisticsRow = {
  feature_id: string;
  display_name: string;
  unit: string;
  groups: Partial<Record<string, GroupStatistics>>;
};
const groups = ['control', 'asc', 'adhd', 'sad', 'mdd'] as const;

export function FacialGroupStatistics({ rows }: { rows: FacialStatisticsRow[] }) {
  const { t } = useTranslation();
  // A common count must be supplied for every displayed feature; zero is valid.
  const commonCounts = Object.fromEntries(groups.map(group => {
    const counts = rows.map(row => row.groups[group]?.valid_n);
    const first = counts[0];
    return [group, counts.length > 0 && typeof first === 'number' && Number.isFinite(first)
      && counts.every(count => count === first) ? first : undefined];
  }));

  return <>
    <Prose className="mb-3 text-sm text-gray-700 leading-relaxed">{t('facialView.groupStats.introduction')}</Prose>
    <Prose className="mb-2 text-sm text-gray-600 leading-relaxed">{t('facialView.groupStats.populationUnknown')}</Prose>
    <Prose className="mb-4 text-sm text-gray-600 leading-relaxed">{t('facialView.groupStats.filtersIndependent')}</Prose>
    <details className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
      <summary className="cursor-pointer font-semibold rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">{t('facialView.groupStats.helpTitle')}</summary>
      <div className="mt-3 space-y-2 leading-relaxed">
        <Prose>{t('facialView.groupStats.legend.meanSd')}</Prose>
        <Prose>{t('facialView.groupStats.legend.medianIqr')}</Prose>
        <Prose>{t('facialView.groupStats.legend.n')}</Prose>
        <Prose>{t('facialView.groupStats.legend.variability')}</Prose>
      </div>
      <Prose className="mt-3 leading-relaxed"><strong>{t('facialView.groupStats.exampleLabel')} </strong>{t('facialView.groupStats.example')}</Prose>
    </details>
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full min-w-[720px] text-sm text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <th scope="col" className="p-3 font-semibold">{t('assessment.table.feature')}</th>
            {groups.map(group => <th key={group} scope="col" className="p-3 text-center font-semibold">
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                <span>{t(`assessment.table.${group === 'mdd' ? 'depression' : group}`)}</span>
                {commonCounts[group] !== undefined && <span className="font-normal whitespace-nowrap">n = {commonCounts[group]}</span>}
              </div>
            </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(row => <tr key={row.feature_id} className="hover:bg-gray-50/55 transition-colors">
            <th scope="row" className="p-3 text-gray-900 font-medium min-w-52 max-w-xs">
              <FacialFeatureLabel featureId={row.feature_id} fallbackName={row.display_name} />
              <div className="mt-1 font-normal text-gray-600">{t(`features.${row.feature_id}.unit`, { defaultValue: row.unit, nsSeparator: false })}</div>
            </th>
            {groups.map(group => {
              const stats = row.groups[group];
              if (!stats) return <td key={group} className="p-3 text-center text-gray-500">–</td>;
              return <td key={group} className="p-3 text-center text-gray-700">
                <div className="font-semibold whitespace-nowrap">{stats.mean.toFixed(2)} ± {stats.std.toFixed(2)}</div>
                <div className="mt-1 text-gray-600">{t('facialView.groupStats.medianLabel')}: {stats.median.toFixed(2)} ({stats.iqr.toFixed(2)})</div>
                {commonCounts[group] === undefined && <div className="mt-1 text-gray-600">n = {stats.valid_n ?? '–'}</div>}
              </td>;
            })}
          </tr>)}
        </tbody>
      </table>
    </div>
  </>;
}
