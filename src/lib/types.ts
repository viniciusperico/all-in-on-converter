
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
  description: string;
};

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: CONVERTER_TOOLS.CURRENCY,
    id: 'currency',
    icon: Coins,
    nameKey: 'currencyConverter',
    description: 'Convert between popular currencies with real-time exchange rates.',
  },
  {
    name: CONVERTER_TOOLS.MEASUREMENT,
    id: 'measurement',
    icon: Ruler,
    nameKey: 'measurementConverter',
    description: 'Convert units of length, weight, and temperature.',
  },
  {
    name: CONVERTER_TOOLS.FINANCIAL,
    id: 'financial',
    icon: Landmark,
    nameKey: 'financialConverter',
    description: 'Calculate simple and compound interest for your investments.',
  },
  {
    name: CONVERTER_TOOLS.HEALTH,
    id: 'health',
    icon: HeartPulse,
    nameKey: 'healthConverter',
    description: 'Calculate health metrics like BMI and daily calorie needs.',
  },
];

export const TOOL_NAME_TO_ID_MAP: { [key in ToolName]: ToolDefinition['id'] } = {
  [CONVERTER_TOOLS.CURRENCY]: 'currency',
  [CONVERTER_TOOLS.MEASUREMENT]: 'measurement',
  [CONVERTER_TOOLS.FINANCIAL]: 'financial',
  [CONVERTER_TOOLS.HEALTH]: 'health',
};
