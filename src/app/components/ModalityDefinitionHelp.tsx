import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export type DefinedModality = 'facial' | 'mimicry' | 'gaze' | 'head' | 'vocal';

export function ModalityDefinitionHelp({ modality }: { modality: DefinedModality }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const label = t(`modalities.${modality}.label`);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={t('modalities.definitionHelpLabel', { modality: label })}
          className="max-w-full cursor-help rounded-sm text-left [font:inherit] underline decoration-dotted underline-offset-4 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          onClick={(event) => {
            // Match Learning's abbreviation help: hover, focus, and touch/click open the definition.
            event.preventDefault();
            setOpen(true);
          }}
        >
          {label}
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="text-sm leading-relaxed">
        {t(`modalities.${modality}.definition`)}
      </TooltipContent>
    </Tooltip>
  );
}
