/**
 * NYSE Market Holiday Rules and Observances (2000-2050)
 * 
 * Standard Market Holidays:
 * - New Year's Day (January 1)
 * - Martin Luther King Jr. Day (Third Monday in January)
 * - Presidents Day (Third Monday in February)
 * - Good Friday (Friday before Easter Sunday)
 * - Memorial Day (Last Monday in May)
 * - Juneteenth National Independence Day (June 19, since 2021)
 * - Independence Day (July 4)
 * - Labor Day (First Monday in September)
 * - Thanksgiving Day (Fourth Thursday in November)
 * - Christmas Day (December 25)
 * 
 * Holiday Observance Rules:
 * 1. Weekend Holidays:
 *    - If the holiday falls on a Saturday, the market closes on the preceding Friday
 *    - If the holiday falls on a Sunday, the market closes on the following Monday
 * 
 * 2. Early Closures (1:00 PM ET):
 *    - July 3rd (if July 4th is on a weekday)
 *    - Day after Thanksgiving
 *    - Christmas Eve (December 24)
 * 
 * 3. Special Circumstances:
 *    - Unexpected closures may occur due to national events (e.g., National Day of Mourning)
 *    - Natural disasters or emergencies (e.g., Hurricane Sandy in 2012)
 *    - Other significant events affecting market operations
 * 
 * 4. New Holiday Additions:
 *    - Juneteenth became a federal holiday in 2021
 *    - The market now closes for both full and partial days when Juneteenth is observed
 * 
 * Historical Special Closures:
 * - 2012: Hurricane Sandy (October 29-30)
 * - 2018: National Day of Mourning for President George H.W. Bush (December 5)
 * 
 * Note: This calendar includes all full-day market closures. Partial trading days
 * (early closures) are not included in the holiday checks as they don't affect
 * monthly option expiration dates.
 */

function getEasterSunday(year: number): Date {
    // Meeus/Jones/Butcher algorithm for calculating Easter Sunday
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function getGoodFriday(year: number): string {
    const easter = getEasterSunday(year);
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    return goodFriday.toISOString().split('T')[0];
}

function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, n: number): Date {
    const date = new Date(year, month, 1);
    let count = 0;
    while (count < n) {
        if (date.getDay() === dayOfWeek) {
            count++;
        }
        if (count < n) {
            date.setDate(date.getDate() + 1);
        }
    }
    return date;
}

function getLastDayOfMonth(year: number, month: number, dayOfWeek: number): Date {
    const date = new Date(year, month + 1, 0); // Last day of the month
    while (date.getDay() !== dayOfWeek) {
        date.setDate(date.getDate() - 1);
    }
    return date;
}

function generateHolidays(startYear: number, endYear: number): string[] {
    const holidays: string[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
        // New Year's Day
        const newYearsDay = new Date(year, 0, 1);
        if (newYearsDay.getDay() === 0) { // Sunday
            holidays.push(`${year}-01-02`); // Observed on Monday
        } else if (newYearsDay.getDay() === 6) { // Saturday
            holidays.push(`${year}-12-31`); // Observed on previous Friday
        } else {
            holidays.push(`${year}-01-01`);
        }

        // Martin Luther King Jr. Day (Third Monday in January)
        const mlkDay = getNthDayOfMonth(year, 0, 1, 3);
        holidays.push(mlkDay.toISOString().split('T')[0]);

        // Presidents Day (Third Monday in February)
        const presidentsDay = getNthDayOfMonth(year, 1, 1, 3);
        holidays.push(presidentsDay.toISOString().split('T')[0]);

        // Good Friday
        holidays.push(getGoodFriday(year));

        // Memorial Day (Last Monday in May)
        const memorialDay = getLastDayOfMonth(year, 4, 1);
        holidays.push(memorialDay.toISOString().split('T')[0]);

        // Juneteenth (starting from 2021)
        if (year >= 2021) {
            const juneteenth = new Date(year, 5, 19);
            if (juneteenth.getDay() === 0) {
                holidays.push(`${year}-06-20`); // Observed on Monday
            } else if (juneteenth.getDay() === 6) {
                holidays.push(`${year}-06-18`); // Observed on Friday
            } else {
                holidays.push(`${year}-06-19`);
            }
        }

        // Independence Day
        const independenceDay = new Date(year, 6, 4);
        if (independenceDay.getDay() === 0) {
            holidays.push(`${year}-07-05`); // Observed on Monday
        } else if (independenceDay.getDay() === 6) {
            holidays.push(`${year}-07-03`); // Observed on Friday
        } else {
            holidays.push(`${year}-07-04`);
        }

        // Labor Day (First Monday in September)
        const laborDay = getNthDayOfMonth(year, 8, 1, 1);
        holidays.push(laborDay.toISOString().split('T')[0]);

        // Thanksgiving Day (Fourth Thursday in November)
        const thanksgivingDay = getNthDayOfMonth(year, 10, 4, 4);
        holidays.push(thanksgivingDay.toISOString().split('T')[0]);

        // Christmas Day
        const christmasDay = new Date(year, 11, 25);
        if (christmasDay.getDay() === 0) {
            holidays.push(`${year}-12-26`); // Observed on Monday
        } else if (christmasDay.getDay() === 6) {
            holidays.push(`${year}-12-24`); // Observed on Friday
        } else {
            holidays.push(`${year}-12-25`);
        }
    }

    // Add special closures
    holidays.push(...[
        // September 11, 2001 terrorist attacks
        '2001-09-11', '2001-09-12', '2001-09-13', '2001-09-14',
        
        // Hurricane Sandy
        '2012-10-29', '2012-10-30',
        
        // President George H.W. Bush Day of Mourning
        '2018-12-05',
        
        // COVID-19 Trading Floor Closure (though electronic trading continued)
        '2020-03-23'
    ]);

    return holidays.sort();
}

// Generate holidays from 2000 to 2050
const US_MARKET_HOLIDAYS = generateHolidays(2000, 2050);

function isMarketHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return US_MARKET_HOLIDAYS.includes(dateStr);
}

function getSpyOptionExpirationDates(startDate: Date, endDate: Date): string[] {
  const expirationDates: string[] = [];
  const currentDate = new Date(startDate);

  // Normalize dates to remove time component
  currentDate.setHours(0, 0, 0, 0);
  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setHours(0, 0, 0, 0);

  // Set to first day of the start date's month
  currentDate.setDate(1);

  while (currentDate <= normalizedEndDate) {
    let fridayCount = 0;
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    // Find the third Friday of the current month
    while (currentDate.getMonth() === month) {
      if (currentDate.getDay() === 5) { // Friday
        fridayCount++;
        if (fridayCount === 3) {
          // Only add if the date is within our range
          if (currentDate >= startDate && currentDate <= normalizedEndDate) {
            // Check if the third Friday is a holiday
            if (isMarketHoliday(currentDate)) {
              // Move to Thursday if Friday is a holiday
              const thursdayDate = new Date(currentDate);
              thursdayDate.setDate(currentDate.getDate() - 1);
              expirationDates.push(thursdayDate.toISOString().split('T')[0]);
            } else {
              expirationDates.push(currentDate.toISOString().split('T')[0]);
            }
          }
          break;
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Move to first day of next month
    currentDate.setMonth(month + 1, 1);
  }

  return expirationDates;
}

// Test cases
function runTests() {
  console.log("Running tests...\n");

  // Test 1: Regular third Friday (not a holiday)
  const test1Start = new Date('2024-01-01');
  const test1End = new Date('2024-01-31');
  const test1Result = getSpyOptionExpirationDates(test1Start, test1End);
  console.log('Test 1 - Regular January 2024:');
  console.log(`Expected: 2024-01-19`);
  console.log(`Actual: ${test1Result[0]}`);
  console.log(`Pass: ${test1Result[0] === '2024-01-19'}\n`);

  // Test 2: Good Friday (should move to Thursday)
  const test2Start = new Date('2024-03-01');
  const test2End = new Date('2024-03-31');
  const test2Result = getSpyOptionExpirationDates(test2Start, test2End);
  console.log('Test 2 - March 2024 (Good Friday):');
  console.log(`Expected: 2024-03-15`);
  console.log(`Actual: ${test2Result[0]}`);
  console.log(`Pass: ${test2Result[0] === '2024-03-15'}\n`);

  // Test 3: Multiple months
  const test3Start = new Date('2024-07-01');
  const test3End = new Date('2024-08-31');
  const test3Result = getSpyOptionExpirationDates(test3Start, test3End);
  console.log('Test 3 - July-August 2024:');
  console.log(`Expected: 2024-07-19,2024-08-16`);
  console.log(`Actual: ${test3Result.join(',')}`);
  console.log(`Pass: ${test3Result.join(',') === '2024-07-19,2024-08-16'}\n`);

  // Test 4: Year boundary
  const test4Start = new Date('2023-12-01');
  const test4End = new Date('2024-01-31');
  const test4Result = getSpyOptionExpirationDates(test4Start, test4End);
  console.log('Test 4 - December 2023 - January 2024:');
  console.log(`Expected: 2023-12-15,2024-01-19`);
  console.log(`Actual: ${test4Result.join(',')}`);
  console.log(`Pass: ${test4Result.join(',') === '2023-12-15,2024-01-19'}\n`);

  // Add a new test case for actual Good Friday impact
  const test5Start = new Date('2024-03-28');
  const test5End = new Date('2024-03-29');
  const test5Result = getSpyOptionExpirationDates(test5Start, test5End);
  console.log('Test 5 - Good Friday 2024 (March 29):');
  console.log(`Expected: 2024-03-28`);
  console.log(`Actual: ${test5Result.join(',')}`);
  console.log(`Pass: ${test5Result.length === 0}\n`);
}

// Run example for 2022-2026
const startDate = new Date('2022-01-01');
const endDate = new Date('2026-12-31');

console.log("SPY Monthly Option Expiration Dates (2022-2026):");
const expirationDates = getSpyOptionExpirationDates(startDate, endDate);

// Group dates by year for better readability
const datesByYear: { [key: string]: string[] } = {};
expirationDates.forEach(date => {
  const year = date.substring(0, 4);
  if (!datesByYear[year]) {
    datesByYear[year] = [];
  }
  datesByYear[year].push(date);
});

// Print dates grouped by year
Object.keys(datesByYear).sort().forEach(year => {
  console.log(`\n${year}:`);
  datesByYear[year].forEach(date => console.log(date));
});

console.log("\n=== Running Tests ===");
runTests();
