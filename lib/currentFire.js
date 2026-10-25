// The current Fire is stored in the Supabase table `fire_event` (one row) and is updated from the R&T Hub.
// The constants below are only a fallback, used if that row cannot be read. Keep them roughly current.
// RSVPs are tied to the date text exactly — changing it starts a fresh list.
// Date format: 'Oct 12, 2026' (abbreviated month, no weekday; September is 'Sept').
// Address format: '102 Feick Dr, Bernville' (no state). An empty address or notes hides that row.
import { supabase } from './supabaseClient';

export const CURRENT_FIRE_DATE = 'Nov 9, 2026';
export const CURRENT_FIRE_TIME = '6:00 PM';
export const CURRENT_FIRE_LOCATION = "Steve's Farm";
export const CURRENT_FIRE_ADDRESS = '102 Feick Drive, Bernville';
export const CURRENT_FIRE_NOTES = '';

const FALLBACK_FIRE = {
  date: CURRENT_FIRE_DATE,
  time: CURRENT_FIRE_TIME,
  location: CURRENT_FIRE_LOCATION,
  address: CURRENT_FIRE_ADDRESS,
  notes: CURRENT_FIRE_NOTES,
};

// { date, time, location, address, notes } for the current Fire. Call from pages and routes that are force-dynamic.
export async function getCurrentFire() {
  try {
    const { data, error } = await supabase
      .from('fire_event')
      .select('fire_date, fire_time, location, address, notes')
      .eq('id', 1)
      .maybeSingle();
    if (error || !data) return FALLBACK_FIRE;
    return {
      date: data.fire_date,
      time: data.fire_time,
      location: data.location,
      address: data.address || '',
      notes: data.notes || '',
    };
  } catch (err) {
    return FALLBACK_FIRE;
  }
}

export const FIRE_PAGE_URL = 'https://f3thegrill.com/fire';
export const FIRE_TIME_ZONE = 'America/New_York';
// Used when CURRENT_FIRE_TIME has no end time.
export const FIRE_DURATION_HOURS = 3;

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

function parseDate(dateText) {
  const match = String(dateText).trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!match) throw new Error(`Unrecognized fire date: ${dateText}`);
  const month = MONTHS[match[1].toLowerCase()];
  if (month === undefined) throw new Error(`Unrecognized fire month: ${match[1]}`);
  return { year: Number(match[3]), month, day: Number(match[2]) };
}

function parseClock(text) {
  const match = String(text).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) throw new Error(`Unrecognized fire time: ${text}`);
  let hour = Number(match[1]);
  const minute = Number(match[2] || '0');
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return { hour, minute };
}

// "6:00 PM" or "6:00 PM – 9:00 PM".
function parseTimeRange(timeText) {
  const parts = String(timeText).split(/\s*[–—-]\s*/);
  const start = parseClock(parts[0]);
  if (parts.length > 1 && parts[1]) return { start, end: parseClock(parts[1]) };
  const endTotal = start.hour * 60 + start.minute + FIRE_DURATION_HOURS * 60;
  return {
    start,
    end: { hour: Math.floor(endTotal / 60) % 24, minute: endTotal % 60 },
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function stamp({ year, month, day }, { hour, minute }) {
  return `${year}${pad(month + 1)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
}

export function getCurrentFireEvent(fire) {
  const date = parseDate(fire.date);
  const { start, end } = parseTimeRange(fire.time);
  const title = 'F3 Hamburg Fire';
  const location = [fire.location, fire.address].filter(Boolean).join(', ');
  const description = fire.notes
    ? `${fire.notes}\n\n${FIRE_PAGE_URL}`
    : FIRE_PAGE_URL;
  const uid = `f3-fire-${date.year}${pad(date.month + 1)}${pad(date.day)}@f3thegrill.com`;
  return { title, location, description, date, start, end, uid };
}

export function googleCalendarUrl(fire) {
  const event = getCurrentFireEvent(fire);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${stamp(event.date, event.start)}/${stamp(event.date, event.end)}`,
    ctz: FIRE_TIME_ZONE,
    location: event.location,
    details: event.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function icsEscape(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

// Fold long lines at 75 octets (RFC 5545).
function fold(line) {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const parts = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    while (end > start && (bytes[end - 1] & 0xc0) === 0x80) end -= 1;
    if (end === start) end = Math.min(start + limit, bytes.length);
    parts.push(bytes.subarray(start, end).toString('utf8'));
    start = end;
    limit = 74;
  }
  return parts.join('\r\n ');
}

export function buildFireIcs(fire) {
  const event = getCurrentFireEvent(fire);
  const dtStart = stamp(event.date, event.start);
  const dtEnd = stamp(event.date, event.end);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//F3 Hamburg//Fire//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'X-LIC-LOCATION:America/New_York',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'TZNAME:EDT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;TZID=America/New_York:${dtStart}`,
    `DTEND;TZID=America/New_York:${dtEnd}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `LOCATION:${icsEscape(event.location)}`,
    `DESCRIPTION:${icsEscape(event.description)}`,
    `URL:${FIRE_PAGE_URL}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:F3 Hamburg Fire tomorrow',
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
