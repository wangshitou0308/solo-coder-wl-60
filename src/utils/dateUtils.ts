import type { ExpiryStatusResult, SeasonType } from '../types';

export function getDaysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getExpiryStatus(expiryDate: string | Date, openDate?: string | Date): ExpiryStatusResult {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const days = getDaysBetween(now, expiry);

  let effectiveDays = days;

  if (openDate) {
    const open = new Date(openDate);
    const daysSinceOpen = getDaysBetween(open, now);
    const openShelfLife = 180;
    const openExpiryDays = openShelfLife - daysSinceOpen;
    effectiveDays = Math.min(days, openExpiryDays);
  }

  if (effectiveDays < 0) {
    return {
      status: 'expired',
      days: effectiveDays,
      color: '#C1584F'
    };
  }

  if (effectiveDays <= 7) {
    return {
      status: 'urgent',
      days: effectiveDays,
      color: '#E8A838'
    };
  }

  if (effectiveDays <= 30) {
    return {
      status: 'soon',
      days: effectiveDays,
      color: '#D4952C'
    };
  }

  return {
    status: 'normal',
    days: effectiveDays,
    color: '#7A9E7E'
  };
}

export function getSeasonByMonth(): SeasonType {
  const month = new Date().getMonth() + 1;

  if (month >= 3 && month <= 5) {
    return '春季';
  }
  if (month >= 6 && month <= 8) {
    return '夏季';
  }
  if (month >= 9 && month <= 11) {
    return '秋季';
  }
  return '冬季';
}

export function getNextSeason(): SeasonType {
  const seasonOrder: SeasonType[] = ['春季', '夏季', '秋季', '冬季'];
  const current = getSeasonByMonth();
  const idx = seasonOrder.indexOf(current);
  return seasonOrder[(idx + 1) % 4];
}

export function isDateExpired(date: string | Date): boolean {
  return getDaysBetween(new Date(), date) < 0;
}

export function todayStr(): string {
  return formatDate(new Date());
}

export function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return formatDate(d);
}
