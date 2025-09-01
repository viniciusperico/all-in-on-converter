
'use client';

import React, { useState } from 'react';
import usePersistentState from '@/hooks/use-persistent-state';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/language-context';
import { useInterstitialAd } from '@/contexts/interstitial-ad-context';
import { Label } from '../ui/label';

type Category = 'length' | 'weight' | 'temp' | 'area' | 'volume' | 'speed';

/**
 * @typedef {object} Unit
 * @property {string} id - O identificador único da unidade (ex: 'km').
 * @property {keyof typeof import('@/lib/translations').translations.en} labelKey - A chave para a tradução do nome da unidade.
 */
type Unit<T extends string> = {
  id: T;
  labelKey: keyof typeof import('@/lib/translations').translations.en;
};

/**
 * @typedef {object} Conversion
 * Define a estrutura para armazenar os valores de conversão para cada unidade.
 */
type Conversion<T extends string> = {
  [key in T]: {
    value: string;
  };
};

/**
 * @typedef {object} MeasurementState
 * @property {Category} activeTab - A categoria de conversão atualmente ativa.
 * @property {object} conversions - Um objeto que armazena os valores de entrada para cada categoria.
 */
type MeasurementState = {
  activeTab: Category;
  conversions: {
    length: Conversion<'km' | 'miles'>;
    weight: Conversion<'kg' | 'lbs'>;
    temp: Conversion<'c' | 'f' | 'k'>;
    area: Conversion<'sqm' | 'sqft'>;
    volume: Conversion<'l' | 'gal'>;
    speed: Conversion<'kmh' | 'mph'>;
  };
};

// Estado inicial para os campos de conversão, todos vazios.
const initialConversionState: MeasurementState['conversions'] = {
  length: { km: { value: '' }, miles: { value: '' } },
  weight: { kg: { value: '' }, lbs: { value: '' } },
  temp: { c: { value: '' }, f: { value: '' }, k: { value: '' } },
  area: { sqm: { value: '' }, sqft: { value: '' } },
  volume: { l: { value: '' }, gal: { value: '' } },
  speed: { kmh: { value: '' }, mph: { value: '' } },
};

// Objeto com as fórmulas de conversão para cada categoria e unidade.
const CONVERSIONS = {
  length: {
    km: (v: number) => ({ miles: v * 0.621371 }),
    miles: (v: number) => ({ km: v / 0.621371 }),
  },
  weight: {
    kg: (v: number) => ({ lbs: v * 2.20462 }),
    lbs: (v: number) => ({ kg: v / 2.20462 }),
  },
  temp: {
    c: (v: number) => ({ f: v * (9 / 5) + 32, k: v + 273.15 }),
    f: (v: number) => ({ c: (v - 32) * (5 / 9), k: (v - 32) * (5 / 9) + 273.15 }),
    k: (v: number) => ({ c: v - 273.15, f: (v - 273.15) * (9 / 5) + 32 }),
  },
  area: {
    sqm: (v: number) => ({ sqft: v * 10.764 }),
    sqft: (v: number) => ({ sqm: v / 10.764 }),
  },
  volume: {
    l: (v: number) => ({ gal: v * 0.264172 }),
    gal: (v: number) => ({ l: v / 0.264172 }),
  },
  speed: {
    kmh: (v: number) => ({ mph: v * 0.621371 }),
    mph: (v: number) => ({ kmh: v / 0.621371 }),
  },
};

// Definição das categorias, seus nomes e as unidades que contêm.
const CATEGORIES: { id: Category; labelKey: keyof typeof import('@/lib/translations').translations.en; units: Unit<any>[]; }[] = [
  { id: 'length', labelKey: 'length', units: [{id: 'km', labelKey: 'kilometers'}, {id: 'miles', labelKey: 'miles'}]},
  { id: 'weight', labelKey: 'weight', units: [{id: 'kg', labelKey: 'kilograms'}, {id: 'lbs', labelKey: 'pounds'}]},
  { id: 'temp', labelKey: 'temperature', units: [{id: 'c', labelKey: 'celsius'}, {id: 'f', labelKey: 'fahrenheit'}, {id: 'k', labelKey: 'kelvin'}]},
  { id: 'area', labelKey: 'area', units: [{id: 'sqm', labelKey: 'squareMeters'}, {id: 'sqft', labelKey: 'squareFeet'}]},
  { id: 'volume', labelKey: 'volume', units: [{id: 'l', labelKey: 'liters'}, {id: 'gal', labelKey: 'gallons'}]},
  { id: 'speed', labelKey: 'speed', units: [{id: 'kmh', labelKey: 'kmh'}, {id: 'mph', labelKey: 'mph'}]},
];


/**
 * Componente para conversão de unidades de medida.
 * Apresenta abas para diferentes categorias (comprimento, peso, etc.) e permite
 * a conversão instantânea entre as unidades ao digitar em qualquer um dos campos.
 */
export function MeasurementConverter() {
  const { t } = useLanguage();
  const { triggerInteraction } = useInterstitialAd();
  const [state, setState, isMounted] = usePersistentState<MeasurementState>('measurementState_v2', {
    activeTab: 'length',
    conversions: initialConversionState
  });

  /**
   * Lida com a lógica de conversão quando o valor de um campo de entrada muda.
   * @param {Category} category - A categoria de conversão atual (ex: 'length').
   * @param {string} fromUnit - A unidade de origem da conversão.
   * @param {string} value - O novo valor inserido pelo usuário.
   */
  const handleConversion = (category: Category, fromUnit: string, value: string) => {
    triggerInteraction();
    const numValue = parseFloat(value);

    // Se o valor estiver vazio ou não for um número, limpa todos os campos da categoria.
    if (value === '' || isNaN(numValue)) {
      setState(s => ({
        ...s,
        conversions: {
          ...s.conversions,
          [category]: Object.keys(s.conversions[category]).reduce((acc, key) => ({ ...acc, [key]: { value: '' } }), {}),
        }
      }));
      return;
    }
    
    const conversionFn = CONVERSIONS[category][fromUnit as keyof typeof CONVERSIONS[Category]];
    if (conversionFn) {
        const results = conversionFn(numValue);
        setState(s => ({
            ...s,
            conversions: {
                ...s.conversions,
                [category]: {
                    ...s.conversions[category],
                    [fromUnit]: { value },
                    ...Object.keys(results).reduce((acc, key) => ({
                        ...acc,
                        [key]: { value: (results[key as keyof typeof results] as number).toFixed(2) }
                    }), {})
                }
            }
        }));
    }
  };

  /**
   * Renderiza os campos de entrada para uma determinada categoria de conversão.
   * @param {object} categoryInfo - O objeto de configuração da categoria.
   * @returns {React.ReactNode} O JSX para os conversores da categoria.
   */
  const renderConverter = (categoryInfo: typeof CATEGORIES[number]) => {
    const { id: categoryId, units } = categoryInfo;
    const conversionState = state.conversions[categoryId];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-end gap-4">
        {units.map((unit) => (
          <div className="space-y-2" key={unit.id}>
              <Label htmlFor={`${categoryId}-${unit.id}`}>{t(unit.labelKey)}</Label>
              <Input
                id={`${categoryId}-${unit.id}`}
                type="number"
                placeholder="0.00"
                value={conversionState[unit.id as keyof typeof conversionState]?.value ?? ''}
                onChange={e => handleConversion(categoryId, unit.id, e.target.value)}
                aria-label={t(unit.labelKey)}
              />
            </div>
        ))}
      </div>
    );
  };
  
  if (!isMounted) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('measurementConverter')}</CardTitle>
        <CardDescription>{t('measurementDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={state.activeTab} 
          onValueChange={(val) => setState(s => ({...s, activeTab: val as Category}))} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 h-auto">
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id}>{t(cat.labelKey)}</TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-6 space-y-4">
            {CATEGORIES.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="!mt-0">
                {renderConverter(cat)}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
