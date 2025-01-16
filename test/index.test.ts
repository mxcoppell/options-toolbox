/// <reference types="jest" />

import { getMonthlyOptionExpirationDates, isMarketHoliday, generateHolidays } from '../src';

describe('Monthly Options Dates', () => {
  describe('generateHolidays', () => {
    it('should generate holidays for a single year', () => {
      const holidays = generateHolidays(2024, 2024);
      expect(holidays).toContain('2024-01-01'); // New Year's Day
      expect(holidays).toContain('2024-01-15'); // MLK Day
      expect(holidays).toContain('2024-02-19'); // Presidents Day
      expect(holidays).toContain('2024-03-29'); // Good Friday
      expect(holidays).toContain('2024-05-27'); // Memorial Day
      expect(holidays).toContain('2024-06-19'); // Juneteenth
      expect(holidays).toContain('2024-07-04'); // Independence Day
      expect(holidays).toContain('2024-09-02'); // Labor Day
      expect(holidays).toContain('2024-11-28'); // Thanksgiving
      expect(holidays).toContain('2024-12-25'); // Christmas
    });

    it('should handle weekend holiday observances', () => {
      const holidays2022 = generateHolidays(2022, 2022);
      expect(holidays2022).toContain('2022-12-26'); // Christmas observed (Monday)

      const holidays2021 = generateHolidays(2021, 2021);
      expect(holidays2021).toContain('2021-07-05'); // Independence Day observed (Monday)
    });

    it('should include special closures when in range', () => {
      const holidays2001 = generateHolidays(2001, 2001);
      expect(holidays2001).toContain('2001-09-11');
      expect(holidays2001).toContain('2001-09-12');
      expect(holidays2001).toContain('2001-09-13');
      expect(holidays2001).toContain('2001-09-14');

      const holidays2012 = generateHolidays(2012, 2012);
      expect(holidays2012).toContain('2012-10-29');
      expect(holidays2012).toContain('2012-10-30');
    });

    it('should throw error for years outside supported range', () => {
      expect(() => generateHolidays(1999, 2000)).toThrow('Holiday data is only available between 2000 and 2050');
      expect(() => generateHolidays(2000, 2051)).toThrow('Holiday data is only available between 2000 and 2050');
    });

    it('should handle Juneteenth addition from 2021', () => {
      const holidays2020 = generateHolidays(2020, 2020);
      expect(holidays2020).not.toContain('2020-06-19');

      const holidays2021 = generateHolidays(2021, 2021);
      expect(holidays2021).toContain('2021-06-18'); // Observed on Friday since 19th is Saturday
    });
  });

  describe('isMarketHoliday', () => {
    it('should correctly identify holidays', () => {
      const newYearsDay = new Date('2024-01-01T12:00:00');
      const regularDay = new Date('2024-01-02T12:00:00');
      expect(isMarketHoliday(newYearsDay)).toBe(true); // New Year's Day
      expect(isMarketHoliday(regularDay)).toBe(false); // Regular day
    });

    it('should throw error for dates outside supported range', () => {
      expect(() => isMarketHoliday(new Date('1999-12-31T12:00:00'))).toThrow();
      expect(() => isMarketHoliday(new Date('2051-01-01T12:00:00'))).toThrow();
    });

    it('should handle special closures', () => {
      expect(isMarketHoliday(new Date('2001-09-11T12:00:00'))).toBe(true);
      expect(isMarketHoliday(new Date('2012-10-29T12:00:00'))).toBe(true);
      expect(isMarketHoliday(new Date('2018-12-05T12:00:00'))).toBe(true);
    });
  });

  describe('getMonthlyOptionExpirationDates', () => {
    it('should generate correct expiration dates for 2024', () => {
      const dates = getMonthlyOptionExpirationDates(2024, 2024);
      expect(dates).toEqual([
        '2024-01-19',
        '2024-02-16',
        '2024-03-15', // Note: March 29 is Good Friday but doesn't affect expiration
        '2024-04-19',
        '2024-05-17',
        '2024-06-21',
        '2024-07-19',
        '2024-08-16',
        '2024-09-20',
        '2024-10-18',
        '2024-11-15',
        '2024-12-20'
      ]);
    });

    it('should handle holiday adjustments', () => {
      // Test a year where a holiday falls on the third Friday
      const dates = getMonthlyOptionExpirationDates(2021, 2021);
      expect(dates).toContain('2021-06-17'); // June expiration moves to Thursday due to Juneteenth
    });

    it('should handle multi-year ranges', () => {
      const dates = getMonthlyOptionExpirationDates(2023, 2024);
      expect(dates).toHaveLength(24); // 12 months * 2 years
      expect(dates[0]).toBe('2023-01-20');
      expect(dates[dates.length - 1]).toBe('2024-12-20');
    });

    it('should throw error for invalid year ranges', () => {
      expect(() => getMonthlyOptionExpirationDates(1999, 2000)).toThrow();
      expect(() => getMonthlyOptionExpirationDates(2000, 2051)).toThrow();
      expect(() => getMonthlyOptionExpirationDates(2025, 2024)).toThrow('Start year must be less than or equal to end year');
    });

    it('should handle edge cases around year boundaries', () => {
      const dates = getMonthlyOptionExpirationDates(2023, 2024);
      expect(dates).toContain('2023-12-15'); // Last expiration of 2023
      expect(dates).toContain('2024-01-19'); // First expiration of 2024
    });
  });
}); 