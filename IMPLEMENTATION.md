# Implementation verification

Reviewed 19 November 2026. Owner-directed changes: Penang service area; quote-required travel; explicitly demo-only cancellation policy.

## Completed

- Landing offer, venue explanation, travel rule, three native FAQ disclosures, footer WhatsApp link.
- Local EH initials asset, object-cover rendering, and styled EH fallback on image failure. No usable portrait was supplied; no portrait was invented.
- Five real routes, sessionStorage draft/confirmation, validation-aware route guards, step progress and 180ms position-only transitions.
- Full labelled contact/location/profile form, Malaysian mobile normalization, numerical bounds, first-error focus and accessible errors.
- Month-labelled weekday date pages with whole cards, previous/next buttons, complete time ranges, MYT timezone, one-hour lead-time filtering and explicit availability states.
- Editable review, separate travel quote, loading feedback, repeat-submit protection, saved reference, calendar download and WhatsApp summary draft.
- Responsive desktop composition, full-row mobile numerical fields, focus indicators and reduced-motion support.

## Verification

PASS: 10 domain tests locally and in GitHub Actions. Includes empty/invalid forms, numerical boundaries, phone validation, MYT midnight, month/weekend boundaries, exact lead-time cutoff, corrupt stored data, unknown travel totals, ICS UTC times/escaping/UTF-8 folding.

PASS: GitHub Actions production build and TypeScript compilation for implementation commit 5916c68bd0ca0184b1b6877b73b8c7e7a71bbbe8. Vercel deployment reports success for the same commit. Final documentation and touch-target adjustment are checked by the follow-up run.

PASS: measured source-color contrast: white on primary green 9.46:1; muted text on paper 6.06:1; error text on white 7.23:1. These cover the main palette, not every rendered combination.

PASS: code-inspected action wiring: landing CTA routes to details; What to expect targets a real section; FAQ uses native details; form blocks errors and focuses first; schedule arrows page dates; date changes clear time with status; time choices set selection; review edit links retain draft; confirmation writes session record; calendar produces an ICS blob; WhatsApp uses the existing resolved contact and encoded summary; home and new-demo actions route/reset intentionally.

PENDING: browser click-through, responsive screenshots, keyboard-only testing, runtime image-error fallback and live accessibility checks for the upgraded app. The Vercel preview redirects to login. Local Next.js execution was blocked because npm package downloads failed with network DNS restrictions. No browser pass or full WCAG AA conformance is claimed.

The previous application's screens were browser-tested during the audit; those results are not counted as verification of this refactor.

## Remaining product limits

This is a portfolio prototype, not a backend booking service. Availability is illustrative, no cross-user reservation locks exist, payment is not collected, and no email or WhatsApp message is automatically sent. Travel quotes and venue admission require discussion. The initials portrait can be replaced when the owner supplies a photo.

## Design gate

PASS: direction documented in DESIGN.md; no fabricated credentials, testimonials, performance scores, portrait, payment or reservation claims.
PASS: primary actions, semantics, states, honest pricing, authored visual treatment and minimal comments inspected in source.
PENDING: rendered interaction/responsiveness gate, blocked by preview authentication. Keep the PR in draft until preview QA is completed.
