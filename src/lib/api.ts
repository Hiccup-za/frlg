import type {
  PokemonEntry,
  PokeAPIListResponse,
  PokeAPISpeciesResponse,
  PokeAPIEvolutionChain,
  EvolutionChainLink,
} from "./types";
import { POKEBALL_RARITY_ORDER } from "./constants";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export interface PokeballEntry {
  slug: string;
  label: string;
}

/** Fetch all pokeballs from PokeAPI (standard + special balls), sorted common → rarest */
export async function fetchPokeballs(): Promise<PokeballEntry[]> {
  const [standardRes, specialRes] = await Promise.all([
    fetch(`${POKEAPI_BASE}/item-category/34`),
    fetch(`${POKEAPI_BASE}/item-category/33`),
  ]);
  if (!standardRes.ok || !specialRes.ok) throw new Error("PokeAPI pokeballs fetch failed");
  const [standard, special] = await Promise.all([
    standardRes.json() as Promise<{ items: { name: string }[] }>,
    specialRes.json() as Promise<{ items: { name: string }[] }>,
  ]);
  const slugs = new Set<string>();
  const result: PokeballEntry[] = [];
  const exclude = new Set(["lastrange-ball", "lapoke-ball", "lagreat-ball", "laultra-ball", "laheavy-ball", "laleaden-ball", "lagigaton-ball", "lafeather-ball", "lawing-ball", "lajet-ball", "laorigin-ball"]);
  for (const item of [...standard.items, ...special.items]) {
    const slug = item.name;
    if (slugs.has(slug) || exclude.has(slug)) continue;
    slugs.add(slug);
    const label = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    result.push({ slug, label });
  }
  const orderMap = new Map(POKEBALL_RARITY_ORDER.map((s, i) => [s, i]));
  result.sort((a, b) => {
    const ia = orderMap.get(a.slug) ?? 999;
    const ib = orderMap.get(b.slug) ?? 999;
    return ia - ib;
  });
  return result;
}

/** PokeAPI item sprite — 30×30 PNG from the sprites repo */
export function getItemSpriteUrl(slug: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;
}

/** Gen III FireRed/LeafGreen front sprite (same pixel art as the GBA games) */
export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/${id}.png`;
}

/** Modern front sprite — used as fallback when Gen III sprite is missing */
export function getFallbackSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/** Gen III FireRed/LeafGreen shiny front sprite */
export function getShinySpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/shiny/${id}.png`;
}

/** Modern shiny front sprite — used as fallback when Gen III shiny sprite is missing */
export function getShinyFallbackSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
}

/** GET /pokemon?limit=151&offset=0 — returns all 151 Kanto Pokémon in dex order */
export async function fetchKantoPokemon(): Promise<PokemonEntry[]> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=151&offset=0`);
  if (!res.ok) throw new Error(`PokeAPI ${res.status}`);
  const data: PokeAPIListResponse = await res.json();
  return data.results.map((p, i) => ({ name: p.name, id: i + 1 }));
}

/**
 * Two-step fetch: GET /pokemon-species/{id} → evolution_chain.url → GET /evolution-chain/{id}
 * Returns the full evolution chain with level/item/trade requirements.
 */
async function fetchEvolutionChain(pokemonId: number): Promise<PokeAPIEvolutionChain> {
  const sRes = await fetch(`${POKEAPI_BASE}/pokemon-species/${pokemonId}`);
  if (!sRes.ok) throw new Error(`Species ${sRes.status}`);
  const species: PokeAPISpeciesResponse = await sRes.json();

  const cRes = await fetch(species.evolution_chain.url);
  if (!cRes.ok) throw new Error(`Chain ${cRes.status}`);
  return cRes.json();
}

const evolutionRequirementCache: Record<string, string | null> = {};

/** Format item name from API (e.g. "moon-stone") to display (e.g. "Moon Stone") */
function formatItemName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Returns a human-readable string for the next evolution requirement, or null if
 * the Pokémon has no evolution or is already fully evolved.
 */
export async function getNextEvolutionRequirement(
  pokemonId: number,
  pokemonName: string
): Promise<string | null> {
  const cacheKey = `${pokemonId}-${pokemonName.toLowerCase()}`;
  if (cacheKey in evolutionRequirementCache) {
    return evolutionRequirementCache[cacheKey];
  }
  const chain = await fetchEvolutionChain(pokemonId);
  const targetName = pokemonName.toLowerCase();

  function findAndGetRequirement(
    link: EvolutionChainLink,
    name: string
  ): string | null {
    const currentName = link.species.name.toLowerCase();
    if (currentName === name) {
      if (link.evolves_to.length === 0) return null;
      const firstEvo = link.evolves_to[0];
      const details = firstEvo.evolution_details?.[0];
      if (!details) return null;

      const trigger = details.trigger?.name ?? "";
      if (trigger === "level-up" && details.min_level != null) {
        return `Lv. ${details.min_level}`;
      }
      if (trigger === "use-item" && details.item) {
        return `Item: ${formatItemName(details.item.name)}`;
      }
      if (trigger === "trade") {
        return "Trade";
      }
      if (trigger === "level-up") {
        return "Level up";
      }
      return trigger.replace(/-/g, " ");
    }
    for (const child of link.evolves_to) {
      const result = findAndGetRequirement(child, name);
      if (result !== undefined) return result;
    }
    return undefined as unknown as string | null;
  }

  const result = findAndGetRequirement(chain.chain, targetName);
  const value = result === undefined ? null : result;
  evolutionRequirementCache[cacheKey] = value;
  return value;
}
