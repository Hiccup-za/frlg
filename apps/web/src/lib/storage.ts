import type { AppState, GameKey, PokemonEntry, PokemonStatus } from "./types";

const STORAGE_KEY = "pokétracker_v1";

function normalizeStatus(v: PokemonStatus | boolean | undefined): PokemonStatus {
  if (v === true) return "caught";
  if (v === "seen" || v === "caught") return v;
  return "none";
}

function migrateState(saved: AppState): AppState {
  const migrated = { ...saved, avatarSlug: saved.avatarSlug ?? "master-ball" };
  const gameData = { ...migrated.gameData };
  for (const g of ["fr", "lg"] as GameKey[]) {
    const gd = gameData[g];
    const raw = gd.caught as Record<number, PokemonStatus | boolean>;
    const normalized: Record<number, PokemonStatus> = {};
    for (const [k, v] of Object.entries(raw)) {
      normalized[Number(k)] = normalizeStatus(v);
    }
    // Migrate shiny field: normalize if present, default to empty object
    const rawShiny = (gd.shiny ?? {}) as Record<number, PokemonStatus | boolean>;
    const normalizedShiny: Record<number, PokemonStatus> = {};
    for (const [k, v] of Object.entries(rawShiny)) {
      normalizedShiny[Number(k)] = normalizeStatus(v);
    }
    gameData[g] = {
      ...gd,
      caught: normalized,
      shiny: normalizedShiny,
      inventory: gd.inventory ?? {},
    };
  }
  return { ...migrated, gameData };
}

export function makeInitialGameData() {
  return {
    badges: [false, false, false, false, false, false, false, false],
    party: [null, null, null, null, null, null] as (PokemonEntry | null)[],
    caught: {} as Record<number, PokemonStatus>,
    shiny: {} as Record<number, PokemonStatus>,
    inventory: {} as Record<string, boolean>,
  };
}

export function makeInitialState(): AppState {
  return {
    username: "",
    avatarSlug: "master-ball",
    games: [],
    gameData: {
      fr: makeInitialGameData(),
      lg: makeInitialGameData(),
    },
    allPokemon: [],
  };
}

export function loadState(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    return migrateState(parsed);
  } catch {
    return null;
  }
}

export function saveState(state: Omit<AppState, "allPokemon">): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota exceeded or private mode — silently fail
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function isValidGame(game: string): game is GameKey {
  return game === "fr" || game === "lg";
}
