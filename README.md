# mini-apps

Small apps Minitap tests itself against. Each app lives in its own folder and is a
self-contained, standard project. Minitest's monorepo support points one Minitest app at
one `source_folder`, and the GitHub builder runs that technology's normal build from there,
exactly as it does for a customer.

| Folder | App | Stack | What it is for |
|---|---|---|---|
| [`minisweeper/`](minisweeper/) | Mini Sweeper | Flutter (Android, iOS, web) | A small Minesweeper used for demos and onboarding examples. |
| [`luigi/`](luigi/) | Luigi's Pizzeria | FastAPI + ElevenLabs voice agent (web) | The voice-agent demo target: Mini phones Luigi and checks the order API for bugs you can't hear. |
| [`croissant/`](croissant/) | Croissant | Expo: React Native (Android, iOS) | A bakery app Minitest runs a fixed suite of scenarios on, to measure how stable its verdicts are. |
| [`pantry/`](pantry/) | Pantry | Expo: React Native (Android, iOS) | A grocery app with the pop-ups, prompts and late content of a real customer app, used to test replay. No backend. |

The repository was called `demo-app` until November 2026. GitHub redirects the old URL.

## Mini Sweeper (`minisweeper/`)

Classic Minesweeper with three difficulty levels, flags, a timer and a reset face.
Details in [`minisweeper/README.md`](minisweeper/README.md).

```bash
cd minisweeper
flutter pub get
flutter run                  # pick a device or simulator
flutter test
flutter build apk --debug    # → build/app/outputs/flutter-apk/
flutter build web            # → build/web/
```

**In Minitest:** create a Flutter app with source folder `minisweeper`. No environment
variables are needed.

## Luigi's Pizzeria (`luigi/`)

A web phone line backed by an ElevenLabs agent, plus the order API it writes to, with
runtime "bug switches" for demos. Deployed on Cloud Run (`luigi`, project `minitap-dev`).
Everything (switches, deployment, provisioning) is in [`luigi/README.md`](luigi/README.md).

```bash
cd luigi
uv sync
uv run uvicorn app.main:app --reload   # http://localhost:8000
uv run pytest
```

**In Minitest:** a web app whose target URL is the deployed Cloud Run service. It is not
built from this repo by Minitest; it is deployed by hand (see its README).

## Croissant (`croissant/`)

A bakery (menu, cart, checkout, order tracking, loyalty, family account, custom cakes)
on Android and iOS, backed by Appwrite. Minitest runs a fixed suite of scenarios on it in
a dedicated dev tenant. How to build and run it is in [`croissant/README.md`](croissant/README.md).

```bash
cd croissant
npm ci
npm run typecheck && npm test
npx expo run:android         # or: npx expo run:ios
```

**In Minitest:** one Expo app with source folder `croissant`, built by the GitHub builder
for Android and iOS. No environment variables are needed.

## Pantry (`pantry/`)

A grocery delivery app with no backend, built to look and misbehave like a customer app: random "What's
new" sheet, cookie sheet, permission prompts, rating dialog, A/B copy and late content, all seeded and
listed in [`pantry/CHAOS.md`](pantry/CHAOS.md) (`EXPO_PUBLIC_CHAOS=off` turns it off). Test accounts and
details in [`pantry/README.md`](pantry/README.md). Owned by the replay work: do not repurpose it.

```bash
cd pantry
npm ci
npm run typecheck && npm test
npx expo run:android         # or: npx expo run:ios
```

**In Minitest:** one Expo app with source folder `pantry`, built by the GitHub builder for Android and
iOS, in the dev Mini-Skills tenant. No environment variables are needed.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) builds and tests only the apps a
change touches: Mini Sweeper (`flutter analyze`, `flutter test`, debug APK, web build),
Luigi (`pytest`), Croissant and Pantry (`npm ci`, typecheck, tests, `expo export -p web` as a
build check).

## Adding an app

1. Create a top-level folder with a standard project for its technology (no build
   artifacts committed; the GitHub builder builds from source).
2. Give it its own `README.md` and `.gitignore`.
3. Add a job to `.github/workflows/ci.yml` filtered on its folder.
4. Add a row to the table above, and point its Minitest app at the folder.
