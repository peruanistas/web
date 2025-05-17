
/**
 * Formats a date-like type to a human-readable format used and loved by Peruanistas.
 */
export function formatDate(rawDate: number | string | Date) {
  const date = new Date(rawDate);

  let weekday = new Intl.DateTimeFormat(navigator.language, { weekday: 'short' }).format(date);
  const month = new Intl.DateTimeFormat(navigator.language, { month: 'short' }).format(date);
  const day = date.getDate();

  weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  const timeFormat = new Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);

  return `${weekday}, ${month} ${day} · ${timeFormat}`;
}
