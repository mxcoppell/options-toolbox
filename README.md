# Options Toolbox

Calculate monthly stock options expiration dates with market holiday handling.

## Features

- Calculate monthly option expiration dates (third Friday of each month)
- Handle market holidays and weekend adjustments
- Support for special market closures
- TypeScript support with type definitions
- Comprehensive test coverage

## Installation

```bash
npm install @mxcoppell/options-toolbox
```

## Usage

```typescript
import { getMonthlyOptionExpirationDates, isMarketHoliday, generateHolidays } from '@mxcoppell/options-toolbox';

// Get monthly option expiration dates for 2024
const dates = getMonthlyOptionExpirationDates(2024, 2024);
console.log(dates);
// ['2024-01-19', '2024-02-16', '2024-03-15', ...]

// Check if a date is a market holiday
const isHoliday = isMarketHoliday(new Date('2024-01-01'));
console.log(isHoliday); // true

// Generate list of market holidays for a year range
const holidays = generateHolidays(2024, 2024);
console.log(holidays);
// ['2024-01-01', '2024-01-15', '2024-02-19', ...]
```

## Market Holidays

The following market holidays are included:
- New Year's Day
- Martin Luther King Jr. Day (Third Monday in January)
- Presidents Day (Third Monday in February)
- Good Friday
- Memorial Day (Last Monday in May)
- Juneteenth National Independence Day (June 19, since 2021)
- Independence Day (July 4)
- Labor Day (First Monday in September)
- Thanksgiving Day (Fourth Thursday in November)
- Christmas Day (December 25)

### Holiday Observance Rules
- If the holiday falls on a Saturday, it is usually observed on the preceding Friday
- If the holiday falls on a Sunday, it is usually observed on the following Monday

### Special Market Closures
- September 11-14, 2001 (September 11 attacks)
- October 29-30, 2012 (Hurricane Sandy)
- December 5, 2018 (President George H.W. Bush Day of Mourning)
- March 23, 2020 (COVID-19 Trading Floor Closure)

## API Reference

### getMonthlyOptionExpirationDates(startYear: number, endYear: number): string[]
Returns an array of monthly option expiration dates between the specified years (inclusive).
- Dates are in YYYY-MM-DD format
- Throws error if years are outside supported range (2000-2050)
- Throws error if start year is greater than end year

### isMarketHoliday(date: Date): boolean
Checks if a given date is a market holiday.
- Returns true if the date is a holiday, false otherwise
- Throws error if date is outside supported range

### generateHolidays(startYear: number, endYear: number): string[]
Generates a list of market holidays between the specified years.
- Returns array of dates in YYYY-MM-DD format
- Includes special market closures if within range
- Throws error if years are outside supported range

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 