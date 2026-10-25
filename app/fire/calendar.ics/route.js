import { buildFireIcs, getCurrentFire } from '../../../lib/currentFire';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(buildFireIcs(await getCurrentFire()), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename=f3-fire.ics',
      'Cache-Control': 'no-store',
    },
  });
}
