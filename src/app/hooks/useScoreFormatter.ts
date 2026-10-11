import { useTranslation } from 'react-i18next';

// Format values already converted to the displayed 0–100 scale.
export function useScoreFormatter() {
  const { t, i18n } = useTranslation();
  const formatter = new Intl.NumberFormat(i18n.resolvedLanguage ?? i18n.language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return (value: number | null) => value === null ? t('screening.unavailableValue') : formatter.format(value);
}
