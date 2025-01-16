/**
 * Calculate monthly stock options expiration dates with market holiday handling
 * @packageDocumentation
 */

// Constants for supported date range
const EARLIEST_SUPPORTED_YEAR = 2000;
const LATEST_SUPPORTED_YEAR = 2050;

/**
 * Error thrown when a year is outside the supported range
 */
export class YearOutOfRangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'YearOutOfRangeError';
    }
}

/**
 * Error thrown when the start year is greater than the end year
 */
export class InvalidYearRangeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidYearRangeError';
    }
}

/**
 * Validates that a year is within the supported range
 * @param year - The year to validate
 * @throws {YearOutOfRangeError} If the year is outside the supported range
 */
function validateYear(year: number): void {
    if (!Number.isInteger(year)) {
        throw new TypeError('Year must be an integer');
    }
    if (year < EARLIEST_SUPPORTED_YEAR || year > LATEST_SUPPORTED_YEAR) {
        throw new YearOutOfRangeError(
            `Holiday data is only available between ${EARLIEST_SUPPORTED_YEAR} and ${LATEST_SUPPORTED_YEAR}`
        );
    }
}

/**
 * Validates a range of years
 * @param startYear - The start year
 * @param endYear - The end year
 * @throws {YearOutOfRangeError} If either year is outside the supported range
 * @throws {InvalidYearRangeError} If start year is greater than end year
 */
function validateYearRange(startYear: number, endYear: number): void {
    validateYear(startYear);
    validateYear(endYear);
    if (startYear > endYear) {
        throw new InvalidYearRangeError('Start year must be less than or equal to end year');
    }
}

// Helper functions for date calculations
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

/**
 * Generate a list of US market holidays between the specified years
 * @param startYear - The start year (inclusive)
 * @param endYear - The end year (inclusive)
 * @returns Array of holiday dates in YYYY-MM-DD format
 * @throws {YearOutOfRangeError} If years are outside supported range
 * @throws {InvalidYearRangeError} If start year is greater than end year
 * @throws {TypeError} If years are not integers
 */
export function generateHolidays(startYear: number, endYear: number): string[] {
    validateYearRange(startYear, endYear);

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

    // Add special closures if they fall within the requested range
    const specialClosures = [
        // September 11, 2001 terrorist attacks
        ['2001-09-11', '2001-09-12', '2001-09-13', '2001-09-14'],
        
        // Hurricane Sandy
        ['2012-10-29', '2012-10-30'],
        
        // President George H.W. Bush Day of Mourning
        ['2018-12-05'],
        
        // COVID-19 Trading Floor Closure
        ['2020-03-23']
    ];

    specialClosures.forEach(closures => {
        const year = parseInt(closures[0].substring(0, 4));
        if (year >= startYear && year <= endYear) {
            holidays.push(...closures);
        }
    });

    return holidays.sort();
}

/**
 * Check if a given date is a US market holiday
 * @param date - The date to check
 * @returns true if the date is a market holiday, false otherwise
 * @throws {YearOutOfRangeError} If the date is outside supported range
 */
export function isMarketHoliday(date: Date): boolean {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new TypeError('Invalid date provided');
    }
    
    const year = date.getFullYear();
    validateYear(year);
    
    const holidays = generateHolidays(year, year);
    const dateStr = date.toISOString().split('T')[0];
    return holidays.includes(dateStr);
}

/**
 * Get monthly option expiration dates for the specified years
 * @param startYear - The start year (inclusive)
 * @param endYear - The end year (inclusive)
 * @returns Array of expiration dates in YYYY-MM-DD format, sorted chronologically
 * @throws {YearOutOfRangeError} If years are outside supported range
 * @throws {InvalidYearRangeError} If start year is greater than end year
 * @throws {TypeError} If years are not integers
 */
export function getMonthlyOptionExpirationDates(startYear: number, endYear: number): string[] {
    validateYearRange(startYear, endYear);

    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
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
                    // Check if the third Friday is a holiday
                    if (isMarketHoliday(currentDate)) {
                        // Move to Thursday if Friday is a holiday
                        const thursdayDate = new Date(currentDate);
                        thursdayDate.setDate(currentDate.getDate() - 1);
                        expirationDates.push(thursdayDate.toISOString().split('T')[0]);
                    } else {
                        expirationDates.push(currentDate.toISOString().split('T')[0]);
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