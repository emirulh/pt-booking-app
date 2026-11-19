# Emirul Hakimi PT booking

A mobile-first portfolio prototype for RM35, 90-minute personal training sessions in Penang. Built with Next.js App Router, React and TypeScript.

## Run

Use Node.js 24, then:

```sh
npm ci
npm run dev
```

`npm run build` creates a production build. `node --test tests/*.test.mjs` checks validation, MYT date boundaries, lead time, storage parsing, pricing and RFC-style calendar formatting.

## Product flow

- `/`: trainer, transparent offer, venue information, sample policy, FAQ and contact.
- `/book/details`: accessible validation, Malaysian mobile number, email, age/measurements, experience and Penang venue.
- `/book/schedule`: weekday dates, month labels, whole-card paging and 90-minute ranges. Uses MYT / UTC+8, with a rolling one-hour lead time checked again at confirmation.
- `/book/review`: editable client/session summary and honest price breakdown.
- `/book/confirmed`: generated reference, immutable saved summary, calendar download and WhatsApp draft.

Drafts and the latest confirmation persist in sessionStorage; browser Back/Forward uses real routes. Route guards recover missing or expired selections. Corrupt/blocked storage has a visible recovery notice. Clicking confirm twice does not create duplicate records for the same draft.

## Demo boundary

No backend, account, real reservation, notification or payment exists. Availability is illustrative and cannot prevent cross-user conflicts. Data stays in the current browser session unless the visitor explicitly opens WhatsApp, whose draft contains name, venue, date/time, reference and price (not body measurements or email). Calendar events are marked tentative and explicitly named demo events.

The owner selected Penang, quote-required travel and a demo-only policy. George Town city center is the displayed distance reference point. Within 10km: RM0 travel; beyond/unsure: RM35 plus a quote, never a fabricated surcharge. Gym admission is separate. Sample policy: free cancellation/rescheduling with at least 12 hours' notice; shorter notice requires discussion.

The old portrait and payment QR URLs were broken. A local EH initials SVG is the current honest avatar; replace it with an owner-approved portrait when supplied. The component uses object-fit: cover and falls back to styled initials if loading fails. Real payment instructions have been removed from this simulation.

WhatsApp destination was resolved from the original application's existing wa.link/q7ublu contact. No message is sent automatically.

## Architecture

Pure booking rules live in `lib/booking.ts`. A shared provider owns versioned session state. Route screens handle their own forms and interactions; shared components render progress, summaries and pricing. Calendar data escapes user text, folds UTF-8 lines and uses UTC instants.

## Accessibility and testing

Persistent labels, inline errors, first-error focus, native form/FAQ controls, selected-state semantics, large targets, focus indicators and reduced-motion support are implemented. Layout allows document scrolling and mobile input fields occupy full rows. Accessibility conformance requires runtime verification; no WCAG certification or performance score is claimed.

GitHub Actions installs locked dependencies, executes domain tests and builds the app. The implementation report records actual execution results and any remaining limitations.
