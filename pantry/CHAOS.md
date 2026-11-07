# What makes Pantry unpredictable

Pantry is a test target for Minitap's replay: a grocery app that behaves like a real customer app, with the
interruptions and timing changes that make a recorded test drift. It has **no planted bugs**: every flow
below works; only *when* and *how* it shows changes. All of it goes through `src/lib/chaos.ts`.

## Control mode

| App environment variable | Effect |
|---|---|
| `EXPO_PUBLIC_CHAOS=off` | Every random behaviour and every delay below is off: no "What's new", variant A everywhere, no reshuffle, no late content, no orders error. |
| `EXPO_PUBLIC_CHAOS_SEED=<text>` | Fixes the seed (default: a random seed made on first launch, kept for the install). Same seed, same launch number, same draws. It also picks the A/B variants. |

The behaviours marked **always** are product behaviour, not chaos: control mode keeps them.

## Random, seeded

A/B variants are drawn **per build**: every install of one build shows the same variant, as a real experiment keeps a user in one arm. They come from `BUILD_VARIANT_SEED` in `src/lib/chaos.ts` (or `EXPO_PUBLIC_CHAOS_SEED`). Everything else is drawn per launch from the install's own seed.

| Behaviour | Where | Draw | Default |
|---|---|---|---|
| "What's new in Pantry" bottom sheet (Got it) | Home | per launch | 30 % of launches |
| Promo banner A "Free delivery from €35" / B "10% off your first order" | Home | per build | 50 % B |
| Add button "Add to cart" / "Add to basket" | product cards, product page | per build | 50 % B |
| "Place order" and "Back to cart" swap places | Checkout | per build | 50 % swapped |
| "Recommended for you" order reshuffled | Home | per launch | always reshuffled |
| "Something went wrong. Please try again." + Retry (Retry always works) | Orders | per launch, first load only | 15 % |
| Prices show a placeholder first | product cards, product page | per product and launch | 0–4 s |
| Product photos show a placeholder first | everywhere | per product and launch | 0–6 s |
| "Checking status…" before the order timeline | Order | per order and launch | 0–8 s |

## Always (deterministic)

| Behaviour | When |
|---|---|
| Onboarding carousel (3 pages, Skip / Next / Get started) | first launch |
| Cookie sheet "We value your privacy" (Accept all / Manage choices → toggles, Save choices) | first launch on Home; again every 3rd launch while only essential cookies are kept |
| Notification permission (system prompt) | once per install, after the cookie choice |
| Location permission (system prompt) | "Use my location" on Checkout |
| Rating dialog "Enjoying Pantry?" (stars, Submit / Not now) | after placing a second order, once per account |
| Deal of the day: one product 20 % off, chosen from the date | changes at midnight |
| Order status Order placed → Being packed (2 min) → Out for delivery (5 min) → Delivered (15 min) | from the time the order was placed |
| Two-step sign-in code for ben@pantry.test (`000000`) | every sign-in of that account |
| Sign out confirmation (system alert) | Account → Sign out |
