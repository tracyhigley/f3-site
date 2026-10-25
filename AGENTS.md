# Rules for AI tools working on f3thegrill.com

This is the F3 Hamburg – The Grill website. A non-programmer (Ron) asks for small changes and then reviews them; Tracy (the repository owner) may also review. Keep changes small and explain them in plain language.

## Stack
Next.js 14 (App Router) + React 18, Supabase (database), hosted on Vercel. Pages are in `app/`, components in `components/`, helpers in `lib/`, styles in `app/globals.css`, images in `public/`. Check your work with `npm ci` then `npm run build` (there are no automated tests).

## Workflow (always)
1. For small website changes Ron requests, work directly on `main`. Pull requests and preview reviews are not required.
2. Make the smallest change that does what Ron asked. Keep each change in a separate commit so it can be reverted.
3. Run `npm run build` before publishing. If it fails, fix it or stop and say so. Stop any development server you started before building; both use `.next`.
4. Commit and push the change to `main` to trigger the connected Vercel production deployment. Use a normal push; never force-push. If GitHub rules block it, report the blocker rather than opening a pull request or bypassing protections.
5. Check the deployment result when access is available. Tell Ron what changed, which pages to check on https://f3thegrill.com, and whether deployment was confirmed. A successful push alone does not prove deployment succeeded.
6. Ron checks the live website after publishing. If something is wrong, fix it or revert the specific change with a new commit and publish again. Do not reset shared history. Reverting website code does not undo database changes.

## Do not
- Do not change anything about the Fire details. They are managed in the R&T Hub and stored in the Supabase table `fire_event`. Do not edit `lib/currentFire.js` or the Fire date, time, location, address or notes. Layout and styling of `app/fire/page.js` is fine.
- Do not change `lib/supabaseClient.js`, database tables, security policies, or any data. Do not add or paste secret keys, tokens or passwords anywhere.
- Do not add or upgrade packages (`package.json`, `package-lock.json`) without asking Ron first.
- Do not submit, delete or test RSVPs, backblasts or any form on the live site or a preview link. Both use the real production database.
- Do not delete pages or large amounts of content without asking.

## If unsure
Ask Ron in plain language before changing anything that is not clearly part of his request.
