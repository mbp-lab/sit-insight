import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExpandedAbbreviations } from './AbbreviationHelp';
import { HelpTooltip } from './HelpTooltip';

/** Shared movement definitions for the case and Learning tables. */
export function FacialFeatureLabel({ featureId, fallbackName }: { featureId: string; fallbackName: string }) {
  const { t, i18n } = useTranslation();
  // Exported feature IDs contain colons; they are literal keys, not namespaces.
  const name = t(`features.${featureId}.name`, { defaultValue: fallbackName, nsSeparator: false });
  const helpKey = `features.${featureId}.tooltip`;
  return (
    <div className="flex items-start gap-2">
      <span className="font-semibold text-gray-900">{name}</span>
      {i18n.exists(helpKey, { nsSeparator: false }) && <HelpTooltip
        content={<ExpandedAbbreviations>{t(helpKey, { nsSeparator: false })}</ExpandedAbbreviations>}
        className="bg-black text-white border border-white/10 text-sm"
      >
        <button type="button" aria-label={name} className="mt-0.5 shrink-0 rounded-sm p-0.5 text-gray-500 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
          <Info size={14} aria-hidden="true" />
        </button>
      </HelpTooltip>}
    </div>
  );
}
