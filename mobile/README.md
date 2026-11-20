# EH Training mobile

Expo / React Native companion for the Penang PT booking portfolio. Android and iPhone share native screens and the same validated booking rules as the website in `../lib/booking.ts`.

## Try the app

From this repository:

```sh
cd mobile
npm ci
npx expo start
```

Open the QR code with a matching SDK 58 Expo Go client on Android or iPhone. The computer and phone need network access to each other. If your Expo Go release does not support SDK 58, use an EAS internal build instead. No Expo account credentials or signing keys are committed here.

## Installable preview

```sh
cd mobile
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --profile preview --platform android
```

The preview profile produces an Android APK. For iPhone internal distribution, register your device with EAS and build with `--platform ios`; Apple signing and a developer account are required. Bundle IDs are `com.emirulh.ptbooking`; verify ownership before distribution. Store publication is not configured or performed.

## Implemented

- Native stack navigation, keyboard-aware forms, safe-area layout, screen-reader labels and 52px+ controls.
- Required mobile/email/location and bounded body measurements, plus training experience and travel selection.
- MYT scheduling, weekday dates, one-hour lead time, periodic/foreground availability refresh, full 90-minute ranges.
- Guarded routes, local draft persistence and up to 30 saved demo booking snapshots.
- Review with edit actions and itemized pricing, generated reference, duplicate-submit protection.
- Calendar `.ics` export through the native share sheet, and prefilled WhatsApp drafts. Neither action sends a message automatically. Calendar import depends on installed apps; save the `.ics` file and import it if no calendar target is offered.
- Data clearing with confirmation. Sample personal details are recommended: AsyncStorage is device-local persistence, not an encrypted health-record store.

## Product assumptions

RM35 for 90 minutes. Travel included within 10km of George Town city center. Beyond/unsure requires a quote; no surcharge is invented. Gym admission is separate. The 12-hour cancellation/rescheduling policy is explicitly a demo assumption. EH initials intentionally stand in for an approved portrait. No real reservation, payment, availability inventory, email or notification service exists.

## Verification

```sh
npm run typecheck
npm run lint
node --test ../tests/booking.test.mjs
npm run export
```

Export compiles Android, iOS and web bundles, not signed APK/IPA binaries. Before release, test a physical Android and iPhone: keyboard focus/errors, large text, VoiceOver/TalkBack, background/resume around slot expiry, offline restart, data clearing, WhatsApp handoff and calendar file import. This project has not yet been device-tested or published to app stores.

The website remains at the repository root. Its TypeScript/lint scope excludes the separate mobile project. This branch builds on the unmerged Penang web upgrade.
