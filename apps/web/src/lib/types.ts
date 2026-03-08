export type GameKey = "fr" | "lg";

export type ItemCategory = "key" | "hm" | "important" | "stone" | "fossil";

export interface ItemEntry {
  id: string;
  label: string;
  category: ItemCategory;
  spriteSlug: string;
}

/** Pokemon Pokedex status: none = not seen, seen = seen but not caught, caught = captured */
export type PokemonStatus = "none" | "seen" | "caught";

export interface PokemonEntry {
  id: number;
  name: string;
}

export interface GameData {
  badges: boolean[];
  party: (PokemonEntry | null)[];
  caught: Record<number, PokemonStatus>;
  shiny: Record<number, PokemonStatus>;
  inventory: Record<string, boolean>;
}

export interface AppState {
  username: string;
  avatarSlug: string;
  games: GameKey[];
  gameData: Record<GameKey, GameData>;
  allPokemon: PokemonEntry[];
}

// PokeAPI response shapes
export interface PokeAPIListResponse {
  results: { name: string; url: string }[];
}

export interface PokeAPISpeciesResponse {
  evolution_chain: { url: string };
}

export interface EvolutionChainLink {
  species: { name: string; url: string };
  evolution_details: {
    min_level: number | null;
    item: { name: string } | null;
    trigger: { name: string };
  }[];
  evolves_to: EvolutionChainLink[];
}

export interface PokeAPIEvolutionChain {
  chain: EvolutionChainLink;
}
