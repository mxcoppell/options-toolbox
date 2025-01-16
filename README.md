# Monthly Options Expiration Dates

A TypeScript/JavaScript package to calculate monthly stock options expiration dates, with proper handling of market holidays.

## Features

- Calculate monthly option expiration dates (third Friday of each month)
- Handles all US market holidays from 2000 to 2050
- Automatically adjusts for holidays (moves to Thursday when Friday is a holiday)
- Includes special market closures (9/11, Hurricane Sandy, etc.)
- Written in TypeScript with full type definitions
- Validates date ranges against available holiday data

## Installation

```bash
npm install @mxcoppell/monthly-options-dates
```

## Usage

```typescript
import { getMonthlyOptionExpirationDates, isMarketHoliday, generateHolidays } from '@mxcoppell/monthly-options-dates';

// Get expiration dates for specific years
const expirationDates = getMonthlyOptionExpirationDates(2024, 2024);
console.log(expirationDates);
// Output: ['2024-01-19', '2024-02-16', '2024-03-15', ...]

// Check if a date is a market holiday
const date = new Date('2024-01-01');
const isHoliday = isMarketHoliday(date);
console.log(isHoliday); // true (New Year's Day)

// Generate holidays for a specific period
const holidays = generateHolidays(2024, 2024);
console.log(holidays);
// Output: ['2024-01-01', '2024-01-15', '2024-02-19', ...]

// Error handling for unsupported years
try {
    const dates = getMonthlyOptionExpirationDates(1990, 1991);
} catch (error) {
    console.error(error.message); // "Holiday data is only available between 2000 and 2050"
}
```

## Supported Date Range

This package includes holiday data from 2000 to 2050. Any attempt to get expiration dates or holiday information outside this range will throw an error.

## Market Holidays Included

- New Year's Day
- Martin Luther King Jr. Day
- Presidents Day
- Good Friday
- Memorial Day
- Juneteenth National Independence Day (from 2021)
- Independence Day
- Labor Day
- Thanksgiving Day
- Christmas Day

Special closures:
- September 11, 2001 terrorist attacks (Sep 11-14, 2001)
- Hurricane Sandy (Oct 29-30, 2012)
- President George H.W. Bush Day of Mourning (Dec 5, 2018)
- COVID-19 Trading Floor Closure (Mar 23, 2020)

## Holiday Observance Rules

- If a holiday falls on a Saturday, the market closes on the preceding Friday
- If a holiday falls on a Sunday, the market closes on the following Monday
- Good Friday is always observed on the Friday before Easter Sunday
- Juneteenth (June 19) follows the same weekend observance rules as other holidays

## API Reference

### getMonthlyOptionExpirationDates(startYear: number, endYear: number): string[]

Returns an array of monthly option expiration dates for the specified years (inclusive). Throws an error if years are outside the supported range (2000-2050).

### isMarketHoliday(date: Date): boolean

Returns true if the given date is a US market holiday. Throws an error if the date is outside the supported range.

### generateHolidays(startYear: number, endYear: number): string[]

Returns an array of all market holidays between the start and end years (inclusive). Throws an error if years are outside the supported range.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 