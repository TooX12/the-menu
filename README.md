# The Menu

A QR-code menu for restaurants, sold in three packages. A guest scans the code on
the table and the menu opens on their phone, looking like the printed card rather
than a web page.

| | Package | What the guest can do |
|---|---|---|
| **I** | Carta | Read the menu, switch between Spanish, English and French |
| **II** | Carta & Order | Everything in I, plus build an order with cooking preferences, extras and notes, and hand it over as a QR code the waiter scans |
| **III** | Carta, Order & Service | Everything in II, plus call the waiter from the table (with a confirmation step) |

## Running it

```bash
nvm use            # reads .nvmrc — Node 22.12.0
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built output
```

### Version pinning

- `.nvmrc` / `.node-version` — Node 22.12.0, for nvm, fnm and asdf.
- `engines` in `package.json` — the same floor, enforced at install time.
- `.python-version` — 3.12.7 for pyenv. Nothing in the app uses Python today; the
  file is here so that any tooling scripts added later start on a pinned version.

## Routes

Routing is hash-based, so the built output drops onto any static host with no
rewrite rules.

| Route | What it is |
|---|---|
| `#/` | The page that sells the three packages, with a link into each demo |
| `#/menu/carta?table=12` | Package I at table 12 |
| `#/menu/orden?table=12` | Package II |
| `#/menu/servicio?table=12` | Package III |
| `#/table/servicio` | The table card a venue prints: QR, venue name, table number |

The `table` parameter is what makes one printed code different from another. Each
table gets its own code, and the menu carries that number into the order and into
any service call.

## How it is put together

```
src/
  config/packages.ts    The three packages and their capability flags
  data/menu.ts          The menu: five courses, in three languages
  i18n/                 UI strings and the language context
  lib/qr.ts             QR encoder (byte mode, versions 1–10, ECC levels M and L)
  lib/order.ts          Pricing, option defaults, line merging
  lib/ticket.ts         The compact payload a waiter's scanner reads
  state/                Order and service-call reducers
  components/           Menu sheet, dish editor, order review, ticket, call button
  pages/                Landing, menu, table card, not-found
  styles/               Tokens, the paper sheet, controls, the landing page
```

One menu renders all three packages. `PACKAGES[id].capabilities` turns ordering
and the call button on, so there is no second codebase per tier and no way for the
tiers to drift apart.

### The QR codes

`src/lib/qr.ts` is a self-contained encoder — no runtime dependency beyond React
anywhere in the project. It implements ISO/IEC 18004 byte mode for versions 1
through 10: Reed–Solomon over GF(256), block interleaving, the format and version
BCH codes, zig-zag data placement and mask selection by penalty score. Two codes
are produced:

- The **table card** encodes the menu URL for one table.
- The **order ticket** encodes the order itself, in a short format defined in
  `lib/ticket.ts` (`TM1|<ticket>|<table>|<lang>|<lines>`), with `parseTicket()`
  as the counterpart a point-of-sale system would run.

### What is simulated

The demo runs entirely in the browser. Orders and service calls live in React
state, and a service call acknowledges itself after a couple of seconds the way
the floor would. Wiring either one to a real kitchen display or POS means
replacing two call sites — `markReady()` in `state/OrderContext.tsx` and `call()`
in `state/ServiceContext.tsx`.

## Hosting

`npm run build` produces a static `dist/`. `base` is set to `./` in
`vite.config.ts`, so it works from a subdirectory as well as from a domain root.
Any static host will do: Netlify, Vercel, Cloudflare Pages, S3 + CloudFront,
GitHub Pages, or nginx.

Point the printed QR codes at the deployed origin — `lib/ticket.ts#menuUrl`
builds them from `window.location`, so they follow whatever domain the app is
served from.
