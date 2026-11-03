import { es, type Dictionary } from './dictionaries/es';
import { ru } from './dictionaries/ru';
import type { Locale } from './config';

const dictionaries: Record<Locale, Dictionary> = { es, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
