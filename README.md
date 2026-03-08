# Dex

A web app for tracking your Pokémon party, Pokédex progress, and gym badges across your Pokémon games.

---

## Tech Stack

- Vanilla HTML/CSS/JS — single file, no build step required
- **PokeAPI** — primary data source (free, no auth, no rate limiting for reasonable use)
- **localStorage** — client-side persistence for trainer profile and game progress

---

## API Integration

### Primary API: PokeAPI
**Base URL:** `https://pokeapi.co/api/v2`  
**Docs:** https://pokeapi.co/docs/v2  
**Auth:** None required  
**Rate limit:** None enforced for reasonable usage (~100 req/min is fine)

#### Endpoints in use

| Purpose | Endpoint | Returns |
|---|---|---|
| Load Kanto Pokédex (151) | `GET /pokemon?limit=151&offset=0` | `{ results: [{ name, url }] }` |
| Pokémon detail (types, stats) | `GET /pokemon/{id}` | Full Pokémon object |
| Evolution chain | `GET /pokemon-species/{id}` → `evolution_chain.url` → `GET /evolution-chain/{id}` | Nested chain with level/item requirements |

#### Sprites

Sprites are served from PokeAPI's public GitHub sprites repository — the same pixel art used in the GBA games:

```
# Generation III FireRed/LeafGreen front sprite (primary)
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/{id}.png

# Modern front sprite (fallback if Gen III missing)
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
```

Sprites are loaded directly as `<img>` tags with `onerror` fallback chaining. No proxy or backend needed — these are public CDN URLs.

---

## Why This Was Built in Claude

This app was prototyped in Claude's artifact sandbox, which **blocks all external network requests** (fetch, XHR, and image loading from external domains). In that environment:

- `fetch('https://pokeapi.co/...')` fails silently → worked around with an embedded Kanto name list
- `<img src="https://raw.githubusercontent.com/...">` fails to load → sprites appeared broken

**None of these restrictions apply in a normal browser environment.** The code is written correctly for production — Cursor/your local environment will have full network access and everything will work as intended.

---

## Running Locally

This is a Turborepo monorepo. Use Bun:

```bash
bun install
bun run dev      # Start Next.js dev server
bun run build    # Build for production
bun run start    # Start production server
```

The app lives in `apps/web/`.

---

## App Structure

### Screens

1. **Auth Screen** — Trainer name input + game selection (FireRed / LeafGreen / both)
2. **Dashboard** — One card per selected game showing Pokédex count and badge progress
3. **Game Screen** — Party slots + full scrollable Pokédex for that game

### State Shape (localStorage key: `pokétracker_v1` — kept for backwards compatibility)

```json
{
  "username": "ASH",
  "games": ["fr", "lg"],
  "gameData": {
    "fr": {
      "badges": [true, true, false, false, false, false, false, false],
      "party": [
        { "id": 6, "name": "charizard" },
        null, null, null, null, null
      ],
      "caught": {
        "1": true,
        "4": true,
        "6": true
      }
    },
    "lg": { "badges": [...], "party": [...], "caught": {} }
  }
}
```

### Key Functions

| Function | Purpose |
|---|---|
| `fetchKantoPokemon()` | Calls PokeAPI for the 151-Pokémon list |
| `fetchPokemonDetail(id)` | Full Pokémon data including types and species URL |
| `fetchEvolutionChain(pokemonId)` | Two-step fetch: species → evolution chain |
| `getSpriteUrl(id)` | Returns Gen III FireRed/LeafGreen sprite URL |
| `getFallbackSpriteUrl(id)` | Returns modern sprite URL as fallback |
| `renderPokedex()` | Builds the 151-card scrollable Pokédex grid |
| `renderParty()` | Renders the 6 party slots |
| `toggleCaught(id, card, name)` | Marks/unmarks a Pokémon as caught, updates progress |
| `toggleBadge(game, idx)` | Toggles a gym badge on/off |

---

## Potential Enhancements for Cursor

- **Evolution requirements display** — `fetchEvolutionChain()` is already wired up; surface the data on Pokédex card click (e.g. "Evolves at Lv. 16")
- **Type badges** on Pokédex cards using `fetchPokemonDetail()`
- **Move from localStorage to a real backend** (Supabase, Firebase, etc.) for cross-device sync
- **Shiny sprite toggle** — PokeAPI sprites repo has shiny variants at `.../shiny/{id}.png`
- **Search by type** — filter Pokédex grid by type using PokeAPI type data
- **Multiple save slots** — currently one trainer profile per browser

---

## Notes

- The app uses **6 party slots** (matching the actual game's party limit of 6)
- Pokédex covers exactly **151 Kanto Pokémon** — no Johto, Hoenn, etc.
- Badge count on dashboard cards is **clickable directly** without entering the game screen
- Pokédex cards are **click-to-toggle caught** with no navigation on click, per spec
- Uncaught Pokémon show as a **dark silhouette** with `???` as the name
