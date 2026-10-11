export type Currency = 'YER' | 'SAR' | 'USD';

export const CURRENCY_RATES = {
  YER: 1,
  SAR: 0.002, // 1 SAR = 500 YER (default Sanaa)
  USD: 0.000526, // 1 USD = 1900 YER (default)
};

// Global active exchange rates that can be updated dynamically
export let dynamicRates = {
  sarInYer: 500,
  usdInYer: 1900,
  region: 'صنعاء (المناطق الشمالية)'
};

export function setGlobalExchangeRates(sarRate?: number, usdRate?: number, region?: string) {
  if (sarRate && sarRate > 0) {
    dynamicRates.sarInYer = sarRate;
    CURRENCY_RATES.SAR = 1 / sarRate;
  }
  if (usdRate && usdRate > 0) {
    dynamicRates.usdInYer = usdRate;
    CURRENCY_RATES.USD = 1 / usdRate;
  }
  if (region) {
    dynamicRates.region = region;
  }
}

export const CURRENCY_LABELS: Record<Currency, string> = {
  YER: 'ريال يمني (YER)',
  SAR: 'ريال سعودي (SAR)',
  USD: 'دولار أمريكي (USD)',
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  YER: 'ريال',
  SAR: 'ر.س',
  USD: '$',
};

export function formatPrice(priceInYer: number, currency: Currency = 'YER'): string {
  if (currency === 'YER') {
    return `${Math.round(priceInYer).toLocaleString('en-US')} ريال`;
  }
  if (currency === 'SAR') {
    const sar = Math.round(priceInYer / dynamicRates.sarInYer);
    return `${sar.toLocaleString('en-US')} ر.س`;
  }
  if (currency === 'USD') {
    const usd = (priceInYer / dynamicRates.usdInYer).toFixed(1);
    return `$${usd}`;
  }
  return `${Math.round(priceInYer).toLocaleString('en-US')} ريال`;
}

export function convertFromYer(priceInYer: number, currency: Currency): number {
  if (currency === 'YER') return priceInYer;
  if (currency === 'SAR') return Math.round(priceInYer / dynamicRates.sarInYer);
  if (currency === 'USD') return Number((priceInYer / dynamicRates.usdInYer).toFixed(2));
  return priceInYer;
}
