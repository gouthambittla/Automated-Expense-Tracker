import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/**
 * Format a date (Date or parseable string) to: "weekday, D month"
 * Example: "friday, 10 april"
 */
export function formatDayDateMonth(value: Date | string | null | undefined): string {
    if (!value) return '';
    const d = value instanceof Date ? dayjs(value) : dayjs(String(value), ['D MMM', 'D MMMM', 'MMM D', 'MMMM D', 'YYYY-MM-DD', dayjs.ISO_8601], true);
    if (!d.isValid()) return String(value);
    // format then lowercase as requested
    return d.format('dddd, D MMMM').toLowerCase();
}

export default formatDayDateMonth;
