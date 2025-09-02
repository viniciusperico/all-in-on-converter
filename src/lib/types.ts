
import type { LucideIcon } from 'lucide-react';
import { Coins, Ruler, Landmark, HeartPulse } from 'lucide-react';
import { translations } from './translations';

export const CONVERTER_TOOLS = {
  CURRENCY: 'Currency Converter',
  MEASUREMENT: 'Measurement Converter',
  FINANCIAL: 'Financial Converter',
  HEALTH: 'Health Converter',
} as const;

export type ToolName = typeof CONVERTER_TOOLS[keyof typeof CONVERTER_TOOLS];

export type ToolDefinition = {
  name: ToolName;
  id: 'currency' | 'measurement' | 'financial' | 'health';
  icon: LucideIcon;
  nameKey: keyof typeof translations.en;
  descriptionKey: keyof typeof translations.en;
};

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: CONVERTER_TOOLS.CURRENCY,
    id: 'currency',
    icon: Coins,
    nameKey: 'currencyConverter',
    descriptionKey: 'currencyDescription',
  },
  {
    name: CONVERTER_TOOLS.MEASUREMENT,
    id: 'measurement',
    icon: Ruler,
    nameKey: 'measurementConverter',
    descriptionKey: 'measurementDescription',
  },
  {
    name: CONVERTER_TOOLS.FINANCIAL,
    id: 'financial',
    icon: Landmark,
    nameKey: 'financialConverter',
    descriptionKey: 'financialDescription',
  },
  {
    name: CONVERTER_TOOLS.HEALTH,
    id: 'health',
    icon: HeartPulse,
    nameKey: 'healthConverter',
    descriptionKey: 'healthDescription',
  },
];

export const TOOL_NAME_TO_ID_MAP: { [key in ToolName]: ToolDefinition['id'] } = {
  [CONVERTER_TOOLS.CURRENCY]: 'currency',
  [CONVERTER_TOOLS.MEASUREMENT]: 'measurement',
  [CONVERTER_TOOLS.FINANCIAL]: 'financial',
  [CONVERTER_TOOLS.HEALTH]: 'health',
};
