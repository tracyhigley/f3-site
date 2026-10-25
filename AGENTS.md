# Rules for AI tools working on f3thegrill.com

This is the F3 Hamburg – The Grill website. A non-programmer (Ron) asks for small changes and then reviews them; Tracy (the repository owner) may also review. Keep changes small and explain them in plain language.

## Stack
Next.js 14 (App Router) + React 18, Supabase (database), hosted on Vercel. Pages are in `app/`, components in `components/`, helpers in `lib/`, styles in `app/globals.css`, images in `public/`. Check your work with `npm ci` then `npm run build` (there are no automated tests).

## Workflow (always)
1. Work on a new branch named `site/<short-description>`. Never commit to or push `main`.
2. Make the smallest change that does what Ron asked.
3. Run `npm run build`. If it fails, fix it or stop and say so.
4. Open a pull request into `main` with a plain-English summary of what changed and which pages are affected. Vercel will post a preview link on the pull request. Tell Ron to check that link before merging.
5. Never merge the pull request yourself. Ron merges it.

## Do not
- Do not change anything about the Fire details. They are managed in the R&T Hub and stored in the Supabase table `fire_event`. Do not edit `lib/currentFire.js` or the Fire date, time, location, address or notes. Layout and styling of `app/fire/page.js` is fine.
- Do not change `lib/supabaseClient.js`, database tables, security policies, or any data. Do not add or paste secret keys, tokens or passwords anywhere.
- Do not add or upgrade packages (`package.json`, `package-lock.json`) without asking Ron first.
- Do not submit, delete or test RSVPs, backblasts or any form on a preview link. Preview deployments use the real production database.
- Do not delete pages or large amounts of content without asking.

## If unsure
Ask Ron in plain language before changing anything that is not clearly part of his request.
