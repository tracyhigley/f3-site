import { supabase } from '../../lib/supabaseClient';
import QWorkoutSlot from '../../components/QWorkoutSlot';
import AddEventButton from '../../components/AddEventButton';
import CalendarEventPill from '../../components/CalendarEventPill';

export const dynamic = 'force-dynamic';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const LOGO_URL = 'https://niuixeomaexekptkamcn.supabase.co/storage/v1/object/public/recap-photos/site/logo-v3.webp';

function toDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function buildMonthWeeks(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default async function Calendar() {
  // Always computed from today's date on the server, so the three months
  // shown automatically roll forward at the start of each month.
  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const months = [0, 1, 2].map((offset) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const rangeStart = toDateKey(months[0].year, months[0].month, 1);
  const lastMonth = months[months.length - 1];
  const lastDay = new Date(lastMonth.year, lastMonth.month + 1, 0).getDate();
  const rangeEnd = toDateKey(lastMonth.year, lastMonth.month, lastDay);

  const [{ data: customEvents }, { data: qSignups }, { data: people }] = await Promise.all([
    supabase
      .from('calendar_events')
      .select('*')
      .gte('event_date', rangeStart)
      .lte('event_date', rangeEnd)
      .order('event_date', { ascending: true }),
    supabase
      .from('q_signups')
      .select('id, event_date, person_id, people(name)')
      .gte('event_date', rangeStart)
      .lte('event_date', rangeEnd),
    supabase.from('people').select('id, name').order('name'),
  ]);

  const eventsByDate = {};
  (customEvents || []).forEach((e) => {
    if (!eventsByDate[e.event_date]) eventsByDate[e.event_date] = [];
    eventsByDate[e.event_date].push(e);
  });

  const signupsByDate = {};
  (qSignups || []).forEach((s) => {
    signupsByDate[s.event_date] = {
      id: s.id,
      person_id: s.person_id,
      person_name: s.people?.name || 'Unknown',
    };
  });

  return (
    <main className="container calendar-page">
      <p className="page-eyebrow">The Grill</p>
      <h1 className="page-title">Calendar</h1>
      <p className="calendar-intro">
        Tap any Tuesday or Saturday workout to sign up as Q — open slots are shown until someone claims them.
      </p>

      <AddEventButton />

      {months.map(({ year, month }) => {
        const weeks = buildMonthWeeks(year, month);
        return (
          <section key={`${year}-${month}`} className="calendar-month">
            <h2 className="calendar-month-title">
              {MONTH_NAMES[month]} {year}
            </h2>
            <div className="calendar-grid">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="calendar-weekday">
                  {label}
                </div>
              ))}
              {weeks.map((week, wi) =>
                week.map((day, di) => {
                  if (day === null) {
                    return <div key={`${wi}-${di}`} className="calendar-day empty" />;
                  }

                  const dateKey = toDateKey(year, month, day);
                  const weekday = new Date(year, month, day).getDay();
                  const isTuesday = weekday === 2;
                  const isSaturday = weekday === 6;
                  const dayCustomEvents = eventsByDate[dateKey] || [];
                  const isToday = dateKey === todayKey;

                  return (
                    <div key={dateKey} className={`calendar-day${isToday ? ' today' : ''}`}>
                      <span className="calendar-date">{day}</span>
                      {(isTuesday || isSaturday) && (
                        <QWorkoutSlot
                          dateKey={dateKey}
                          dayLabel={`${isTuesday ? 'Tuesday' : 'Saturday'}, ${MONTH_NAMES[month]} ${day}`}
                          timeLabel={isTuesday ? '5:15–6:00 PM' : '7:00–8:00 AM'}
                          logoUrl={LOGO_URL}
                          initialSignup={signupsByDate[dateKey] || null}
                          people={people || []}
                        />
                      )}
                      {dayCustomEvents.map((e) =>
                        e.icon_url ? (
                          <div key={e.id} className="calendar-event-workout">
                            <span className="calendar-event-title">{e.title}</span>
                            {e.time_label && (
                              <span className="calendar-event-subtitle">{e.time_label}</span>
                            )}
                            <img src={e.icon_url} alt="" className="calendar-event-logo-large" />
                          </div>
                        ) : (
                          <CalendarEventPill key={e.id} event={e} />
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}
