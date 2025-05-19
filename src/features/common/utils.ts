import { PE_DISTRICTS } from '@common/data/geo';

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


/**
 * Formats a date-like type to a human-readable format used and loved by Peruanistas.
 * Same as formatDate but with an alternative format
 */
export function formatDate2(rawDate: number | string | Date) {
  const date = new Date(rawDate);

  const month = new Intl.DateTimeFormat(navigator.language, { month: 'short' }).format(date);
  const day = date.getDate();
  const year = date.getFullYear();
  // const timeFormat = new Intl.DateTimeFormat(navigator.language, {
  //   hour: 'numeric',
  //   minute: '2-digit',
  //   hour12: true
  // }).format(date);
  return `${day} ${month} ${year}`;
}


export function getDistrictsForDepartment(departmentCode: string) {
  return Object.entries(PE_DISTRICTS).filter(([, district]) => {
    return district.code.startsWith(departmentCode);
  });
}
