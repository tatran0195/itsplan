import type { Locale } from './locales';

export interface Formatter {
  dateTime(date: Date | number | string, options?: Intl.DateTimeFormatOptions): string;
  relativeTime(
    date: Date | number | string,
    referenceNowOrOptions?:
      Date | number | string | { now?: Date | number | string; unit?: Intl.RelativeTimeFormatUnit },
  ): string;
  number(value: number | bigint, options?: Intl.NumberFormatOptions): string;
}

export function createFormatter(locale: Locale): Formatter {
  return {
    dateTime(date, options) {
      const d = date instanceof Date ? date : new Date(date);
      return new Intl.DateTimeFormat(locale, options).format(d);
    },
    relativeTime(date, referenceNowOrOptions) {
      const targetDate = date instanceof Date ? date : new Date(date);
      let nowDate: Date = new Date();
      let customUnit: Intl.RelativeTimeFormatUnit | undefined;

      if (referenceNowOrOptions instanceof Date) {
        nowDate = referenceNowOrOptions;
      } else if (
        typeof referenceNowOrOptions === 'number' ||
        typeof referenceNowOrOptions === 'string'
      ) {
        nowDate = new Date(referenceNowOrOptions);
      } else if (referenceNowOrOptions && typeof referenceNowOrOptions === 'object') {
        if (referenceNowOrOptions.now) {
          nowDate =
            referenceNowOrOptions.now instanceof Date
              ? referenceNowOrOptions.now
              : new Date(referenceNowOrOptions.now);
        }
        customUnit = referenceNowOrOptions.unit;
      }

      const diffSec = Math.round((targetDate.getTime() - nowDate.getTime()) / 1000);
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

      if (customUnit) {
        switch (customUnit) {
          case 'second':
          case 'seconds':
            return rtf.format(diffSec, 'second');
          case 'minute':
          case 'minutes':
            return rtf.format(Math.round(diffSec / 60), 'minute');
          case 'hour':
          case 'hours':
            return rtf.format(Math.round(diffSec / 3600), 'hour');
          case 'day':
          case 'days':
            return rtf.format(Math.round(diffSec / 86400), 'day');
          case 'month':
          case 'months':
            return rtf.format(Math.round(diffSec / 2592000), 'month');
          case 'year':
          case 'years':
            return rtf.format(Math.round(diffSec / 31536000), 'year');
          default:
            return rtf.format(diffSec, customUnit);
        }
      }

      const absSec = Math.abs(diffSec);
      if (absSec < 60) {
        return rtf.format(diffSec, 'second');
      }
      const diffMin = Math.round(diffSec / 60);
      if (Math.abs(diffMin) < 60) {
        return rtf.format(diffMin, 'minute');
      }
      const diffHour = Math.round(diffSec / 3600);
      if (Math.abs(diffHour) < 24) {
        return rtf.format(diffHour, 'hour');
      }
      const diffDay = Math.round(diffSec / 86400);
      if (Math.abs(diffDay) < 30) {
        return rtf.format(diffDay, 'day');
      }
      const diffMonth = Math.round(diffSec / 2592000);
      if (Math.abs(diffMonth) < 12) {
        return rtf.format(diffMonth, 'month');
      }
      const diffYear = Math.round(diffSec / 31536000);
      return rtf.format(diffYear, 'year');
    },
    number(value, options) {
      return new Intl.NumberFormat(locale, options).format(value);
    },
  };
}
