# Pantry

A grocery delivery app: onboarding, categories, search with filters, product pages with sizes, a cart with
promo codes, checkout (address, delivery slot, card), order tracking and an account with profile and
notification settings. Expo + React Native for Android and iOS (the web build is only a CI check).

It is Minitap's replay test target: it behaves like a customer app, with the pop-ups, permission prompts,
A/B copy and late content that make recorded tests drift. Everything unpredictable is listed in
[`CHAOS.md`](CHAOS.md), with the switch that turns it off. There are no planted bugs.

There is **no backend**: the catalog ships with the app, and the cart, orders and account live on the phone
(AsyncStorage). Network latency is simulated.

## Test accounts

| Email | Password | Sign-in code |
|---|---|---|
| `ana@pantry.test` | `pantry-ana-1` | none |
| `ben@pantry.test` | `pantry-ben-1` | `000000` |

Promo codes: `WELCOME10` (10 % from €15), `FRESH5` (5 %). Delivery is €2.99, free from €35. Any 16-digit
card number with a valid `MM/YY` and a 3-digit CVC is accepted; nothing is charged.

## Run

```bash
npm ci
npx expo run:android      # or: npx expo run:ios
npm run typecheck && npm test
npx expo export -p web    # build check
```

Deep links use the `pantry://` scheme with the screens' paths (`pantry://cart`, `pantry://product/bananas`,
`pantry://category/fruits`, `pantry://checkout`). Bundle id and Android package: `ai.minitap.pantry`.

`patches/expo-modules-jsi+58.0.21.patch` is the same Xcode 26 fix as Croissant's.

## Layout

| Path | What |
|---|---|
| `src/app/` | Screens (expo-router): tabs Home, Search, Cart, Orders, Account, plus product, category, sign-in, checkout, order, profile, notifications |
| `src/lib/` | Catalog, pricing, accounts, orders, permissions, and `chaos.ts` |
| `src/state/` | The persisted app state and the cart |
| `src/ui/` | Theme, components, sheets and dialogs |

Every interactive element has a stable `testID`.
