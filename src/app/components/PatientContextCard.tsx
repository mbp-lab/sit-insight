import { ChevronDown, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PatientContextCardProps {
  participantId?: string;
  token: string;
  faceTrackingValue: number;
  onLock: () => void;
  compact?: boolean;
}

export function PatientContextCard({ participantId, token, faceTrackingValue, onLock, compact = false }: PatientContextCardProps) {
  const { t } = useTranslation();
  const identifier = t('sidebar.patientIdentifier', { id: participantId ?? '–' });
  const content = (
    <>
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          {!compact && <div className="font-black text-xl text-gray-900 mb-1 break-words">{identifier}</div>}
          <div className="text-[10px] text-gray-400 font-mono tracking-wider break-all">{token}</div>
        </div>
        <button
          type="button"
          onClick={onLock}
          title={t('portal.lockSession')}
          className="shrink-0 p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          aria-label={t('portal.lockSession')}
        >
          <Lock size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="text-[13px] text-gray-500">{t('sidebar.sitDate')}: {t('sidebar.sitDateValue')}</div>
      <div className="mt-2 space-y-1.5 text-[12px] text-gray-500">
        <div className="flex justify-between gap-2">
          <span>{t('sidebar.analysisStatus')}</span>
          <span className="font-semibold text-gray-700">{t('sidebar.statusComplete')}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span>{t('sidebar.dataQuality')}</span>
          <span className="font-semibold text-gray-700">{t('sidebar.qualityUsable')}</span>
        </div>
      </div>
      <details className="mt-2 text-[12px] text-gray-500">
        <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">{t('sidebar.details')}</summary>
        <div className="mt-2 flex justify-between gap-2">
          <span>{t('quality.faceTracking')}</span>
          <span className="font-semibold text-gray-700">{faceTrackingValue}%</span>
        </div>
        <div className="mt-2 flex justify-between gap-2">
          <span>{t('quality.audioQuality')}</span>
          <span className="font-semibold text-gray-700">{t('sidebar.qualityUsable')}</span>
        </div>
      </details>
    </>
  );

  if (compact) {
    return (
      <details className="group rounded-xl border border-gray-200 bg-gray-50">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl p-3 hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-[12px] font-bold uppercase tracking-widest text-gray-600">{t('sidebar.currentPatient')}</span>
            <span className="mt-1 block text-sm font-semibold text-gray-900 break-words">{identifier}</span>
          </span>
          <ChevronDown size={16} className="shrink-0 text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="border-t border-gray-200 p-3">{content}</div>
      </details>
    );
  }

  return <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">{content}</div>;
}
