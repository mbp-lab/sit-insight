import { Activity, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LearningOverview() {
  const { t } = useTranslation();

  return (
    <article className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">{t('learningOverview.title')}</h1>
        <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.introduction')}</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section aria-labelledby="learning-screening-title" className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Activity size={20} className="text-teal-600 shrink-0 mt-1" aria-hidden="true" />
            <h2 id="learning-screening-title" className="text-lg font-bold text-gray-900 min-w-0">{t('learningOverview.screening.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.screening.description')}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.screening.interpretation')}</p>
        </section>

        <section aria-labelledby="learning-assessment-title" className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Stethoscope size={20} className="text-teal-600 shrink-0 mt-1" aria-hidden="true" />
            <h2 id="learning-assessment-title" className="text-lg font-bold text-gray-900 min-w-0">{t('learningOverview.assessment.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.assessment.description')}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.assessment.interpretation')}</p>
        </section>
      </div>

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

      <section aria-labelledby="learning-explore-title" className="space-y-2">
        <h2 id="learning-explore-title" className="text-lg font-bold text-gray-900">{t('learningOverview.explore.title')}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{t('learningOverview.explore.description')}</p>
      </section>
    </article>
  );
}
