import { useMemo } from 'react';

export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'MXN' | 'COP' | 'CLP' | 'PEN';

export interface CurrencyFormatConfig {
  code: CurrencyCode;
  label: string;
  locale: string;
  symbol: string;
  groupSeparator: string;
  decimalSeparator: string;
  fractionDigits: number;
}

interface CurrencyDefinition {
  code: CurrencyCode;
  locale: string;
  label: string;
  fractionDigits?: number;
}

const BASE_CURRENCY_DEFINITIONS: CurrencyDefinition[] = [
  { code: 'ARS', locale: 'es-AR', label: 'Peso argentino (ARS)' },
  { code: 'USD', locale: 'en-US', label: 'Dólar estadounidense (USD)' },
  { code: 'EUR', locale: 'es-ES', label: 'Euro (EUR)' },
  { code: 'MXN', locale: 'es-MX', label: 'Peso mexicano (MXN)' },
  { code: 'COP', locale: 'es-CO', label: 'Peso colombiano (COP)' },
  { code: 'CLP', locale: 'es-CL', label: 'Peso chileno (CLP)', fractionDigits: 0 },
  { code: 'PEN', locale: 'es-PE', label: 'Sol peruano (PEN)' },
];

const extractSeparators = (
  locale: string,
  code: CurrencyCode,
  fractionDigits: number,
) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  const parts = formatter.formatToParts(12345.67);
  const group = parts.find((part) => part.type === 'group')?.value ?? '.';
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? ',';
  const symbol = parts.find((part) => part.type === 'currency')?.value ?? code;

  return { group, decimal, symbol };
};

const buildCurrencyConfig = (definition: CurrencyDefinition): CurrencyFormatConfig => {
  const fractionDigits =
    typeof definition.fractionDigits === 'number' ? definition.fractionDigits : 2;
  const { group, decimal, symbol } = extractSeparators(
    definition.locale,
    definition.code,
    fractionDigits,
  );

  return {
    code: definition.code,
    label: definition.label,
    locale: definition.locale,
    fractionDigits,
    groupSeparator: group,
    decimalSeparator: decimal,
    symbol,
  };
};

const ALL_CURRENCY_CONFIGS = BASE_CURRENCY_DEFINITIONS.map(buildCurrencyConfig);

const currencyConfigMap = ALL_CURRENCY_CONFIGS.reduce<Record<string, CurrencyFormatConfig>>(
  (acc, config) => {
    acc[config.code] = config;
    return acc;
  },
  {},
);

export const DEFAULT_CURRENCY_CODE: CurrencyCode = 'ARS';

export const CURRENCY_OPTIONS = ALL_CURRENCY_CONFIGS;

export const getCurrencyConfig = (code?: string): CurrencyFormatConfig => {
  if (!code) {
    return currencyConfigMap[DEFAULT_CURRENCY_CODE];
  }

  const normalizedCode = code.toUpperCase();
  return currencyConfigMap[normalizedCode] ?? currencyConfigMap[DEFAULT_CURRENCY_CODE];
};

export const normalizeAmountInput = (
  input: string,
  config: CurrencyFormatConfig,
): string => {
  if (!input) {
    return '';
  }

  const cleaned = input.replace(/\s+/g, '').replace(/[^\d.,]/g, '');
  if (!cleaned) {
    return '';
  }

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  const decimalIndex = Math.max(lastComma, lastDot);

  if (decimalIndex === -1) {
    const integerDigits = cleaned.replace(/\D/g, '');
    if (!integerDigits) {
      return '';
    }
    const normalized = integerDigits.replace(/^0+(?=\d)/, '');
    return normalized || '0';
  }

  const integerPartRaw = cleaned.slice(0, decimalIndex).replace(/\D/g, '');
  const decimalPartRaw = cleaned.slice(decimalIndex + 1).replace(/\D/g, '');

  const limitedDecimal = decimalPartRaw.slice(0, config.fractionDigits);

  if (!integerPartRaw && !limitedDecimal) {
    return '';
  }

  const normalizedInteger = (integerPartRaw.replace(/^0+(?=\d)/, '') || '0') as string;

  if (!limitedDecimal) {
    return normalizedInteger;
  }

  return `${normalizedInteger}.${limitedDecimal}`;
};

export const formatAmountDisplay = (
  value: string,
  config: CurrencyFormatConfig,
): string => {
  if (!value) {
    return '';
  }

  const [integerPartRaw = '', decimalPartRaw = ''] = value.split('.');
  const integerDigits = integerPartRaw.replace(/\D/g, '') || '0';
  const groupedInteger = integerDigits.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    config.groupSeparator,
  );

  if (!decimalPartRaw) {
    return groupedInteger;
  }

  return `${groupedInteger}${config.decimalSeparator}${decimalPartRaw}`;
};

export const parseAmount = (value: string): number => {
  if (!value) {
    return 0;
  }

  const sanitized = value.replace(/[^0-9.]/g, '');
  if (!sanitized) {
    return 0;
  }

  const parsed = Number.parseFloat(sanitized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const numberToInputValue = (
  amount: number,
  config: CurrencyFormatConfig,
): string => {
  if (!Number.isFinite(amount)) {
    return '';
  }

  if (config.fractionDigits === 0) {
    return Math.round(amount).toString();
  }

  const fixed = amount.toFixed(config.fractionDigits);
  return fixed.replace(/\.?0+$/, '');
};

export const useCurrencyFormatter = (config: CurrencyFormatConfig) => {
  return useMemo(() => {
    const baseOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: config.fractionDigits,
    };

    const withSymbolFormatter = new Intl.NumberFormat(config.locale, {
      ...baseOptions,
      style: 'currency',
      currency: config.code,
      currencyDisplay: 'symbol',
    });

    const withoutSymbolFormatter = new Intl.NumberFormat(config.locale, baseOptions);

    const format = (value: number, withSymbol = true) => {
      const formatter = withSymbol ? withSymbolFormatter : withoutSymbolFormatter;
      return formatter.format(value);
    };

    return { format };
  }, [config]);
};
