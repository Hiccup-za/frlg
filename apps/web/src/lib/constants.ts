import type { ItemEntry } from "./types";

interface GymInfo {
  badge: string;
  gym: string;
  leader: string;
}

export const GYM_INFO: GymInfo[] = [
  { badge: "Boulder", gym: "Pewter City", leader: "Brock" },
  { badge: "Cascade", gym: "Cerulean City", leader: "Misty" },
  { badge: "Thunder", gym: "Vermilion City", leader: "Lt. Surge" },
  { badge: "Rainbow", gym: "Celadon City", leader: "Erika" },
  { badge: "Soul", gym: "Fuchsia City", leader: "Koga" },
  { badge: "Marsh", gym: "Saffron City", leader: "Sabrina" },
  { badge: "Volcano", gym: "Cinnabar Island", leader: "Blaine" },
  { badge: "Earth", gym: "Viridian City", leader: "Giovanni" },
];

export const KANTO_151: string[] = [
  "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard",
  "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree",
  "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot",
  "rattata", "raticate", "spearow", "fearow", "ekans", "arbok",
  "pikachu", "raichu", "sandshrew", "sandslash", "nidoran-f", "nidorina",
  "nidoqueen", "nidoran-m", "nidorino", "nidoking", "clefairy", "clefable",
  "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat",
  "oddish", "gloom", "vileplume", "paras", "parasect", "venonat",
  "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck",
  "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag",
  "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop",
  "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool",
  "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash",
  "slowpoke", "slowbro", "magnemite", "magneton", "farfetchd", "doduo",
  "dodrio", "seel", "dewgong", "grimer", "muk", "shellder",
  "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee",
  "hypno", "krabby", "kingler", "voltorb", "electrode", "exeggcute",
  "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung",
  "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela",
  "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu",
  "starmie", "mr-mime", "scyther", "jynx", "electabuzz", "magmar",
  "pinsir", "tauros", "magikarp", "gyarados", "lapras", "ditto",
  "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte",
  "omastar", "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno",
  "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo", "mew",
];

export const INVENTORY_ITEMS: ItemEntry[] = [
  // Key Items — story gates
  { id: "oaks-parcel",  label: "Oak's Parcel",  category: "key", spriteSlug: "oaks-parcel"  },
  { id: "town-map",     label: "Town Map",       category: "key", spriteSlug: "town-map"     },
  { id: "bicycle",      label: "Bicycle",        category: "key", spriteSlug: "bicycle"      },
  { id: "ss-ticket",    label: "S.S. Ticket",    category: "key", spriteSlug: "ss-ticket"    },
  { id: "coin-case",    label: "Coin Case",      category: "key", spriteSlug: "coin-case"    },
  { id: "lift-key",     label: "Lift Key",       category: "key", spriteSlug: "lift-key"     },
  { id: "silph-scope",  label: "Silph Scope",    category: "key", spriteSlug: "silph-scope"  },
  { id: "poke-flute",   label: "Poké Flute",     category: "key", spriteSlug: "poke-flute"   },
  { id: "card-key",     label: "Card Key",       category: "key", spriteSlug: "card-key"     },
  { id: "gold-teeth",   label: "Gold Teeth",     category: "key", spriteSlug: "gold-teeth"   },
  { id: "secret-key",   label: "Secret Key",     category: "key", spriteSlug: "secret-key"   },
  { id: "tri-pass",     label: "Tri-Pass",       category: "key", spriteSlug: "tri-pass"     },
  { id: "rainbow-pass", label: "Rainbow Pass",   category: "key", spriteSlug: "rainbow-pass" },
  { id: "ruby",         label: "Ruby",           category: "key", spriteSlug: "ruby"         },
  { id: "sapphire",     label: "Sapphire",       category: "key", spriteSlug: "sapphire"     },
  // HMs
  { id: "hm01-cut",        label: "HM01 Cut",        category: "hm", spriteSlug: "hm01" },
  { id: "hm02-fly",        label: "HM02 Fly",        category: "hm", spriteSlug: "hm02" },
  { id: "hm03-surf",       label: "HM03 Surf",       category: "hm", spriteSlug: "hm03" },
  { id: "hm04-strength",   label: "HM04 Strength",   category: "hm", spriteSlug: "hm04" },
  { id: "hm05-flash",      label: "HM05 Flash",      category: "hm", spriteSlug: "hm05" },
  { id: "hm06-rock-smash", label: "HM06 Rock Smash", category: "hm", spriteSlug: "hm06" },
  { id: "hm07-waterfall",  label: "HM07 Waterfall",  category: "hm", spriteSlug: "hm07" },
  // Important Items
  { id: "master-ball", label: "Master Ball", category: "important", spriteSlug: "master-ball" },
  { id: "exp-share",   label: "Exp. Share",  category: "important", spriteSlug: "exp-share"   },
  { id: "vs-seeker",   label: "VS Seeker",   category: "important", spriteSlug: "vs-seeker"   },
  { id: "itemfinder",  label: "Itemfinder",  category: "important", spriteSlug: "dowsing-machine"  },
  { id: "old-rod",     label: "Old Rod",     category: "important", spriteSlug: "old-rod"     },
  { id: "good-rod",    label: "Good Rod",    category: "important", spriteSlug: "good-rod"    },
  { id: "super-rod",   label: "Super Rod",   category: "important", spriteSlug: "super-rod"   },
  // Evolution Stones
  { id: "fire-stone",    label: "Fire Stone",    category: "stone", spriteSlug: "fire-stone"    },
  { id: "water-stone",   label: "Water Stone",   category: "stone", spriteSlug: "water-stone"   },
  { id: "thunder-stone", label: "Thunder Stone", category: "stone", spriteSlug: "thunder-stone" },
  { id: "leaf-stone",    label: "Leaf Stone",    category: "stone", spriteSlug: "leaf-stone"    },
  { id: "moon-stone",    label: "Moon Stone",    category: "stone", spriteSlug: "moon-stone"    },
  // Fossils
  { id: "helix-fossil", label: "Helix Fossil", category: "fossil", spriteSlug: "helix-fossil" },
  { id: "dome-fossil",  label: "Dome Fossil",  category: "fossil", spriteSlug: "dome-fossil"  },
  { id: "old-amber",    label: "Old Amber",    category: "fossil", spriteSlug: "old-amber"    },
];

/** Avatar tiers: common = free, special + rarest = pro-only (when pro is implemented). Matches PokeAPI categories. */
type AvatarTier = "common" | "special" | "rarest";

/** Common avatars — free for all. PokeAPI standard-balls (category 34): poke, great, ultra. */
const POKEBALLS_COMMON: string[] = [
  "poke-ball",
  "great-ball",
  "ultra-ball",
];

/** Special avatars — pro only. PokeAPI special-balls (category 33). */
const POKEBALLS_SPECIAL: string[] = [
  "net-ball",
  "dive-ball",
  "nest-ball",
  "repeat-ball",
  "timer-ball",
  "luxury-ball",
  "premier-ball",
  "dusk-ball",
  "heal-ball",
  "quick-ball",
  "cherish-ball",
  "dream-ball",
  "beast-ball",
];

/** Rarest avatars — pro only. PokeAPI standard-balls (category 34): safari, park, sport, master. */
const POKEBALLS_RAREST: string[] = [
  "safari-ball",
  "park-ball",
  "sport-ball",
  "master-ball",
];

/** Full order: common → special → rarest. Used to sort avatar list. */
export const POKEBALL_RARITY_ORDER: string[] = [
  ...POKEBALLS_COMMON,
  ...POKEBALLS_SPECIAL,
  ...POKEBALLS_RAREST,
];

/** Returns avatar tier for pro gating. Non-null = known ball. */
export function getAvatarTier(slug: string): AvatarTier | null {
  if (POKEBALLS_COMMON.includes(slug)) return "common";
  if (POKEBALLS_SPECIAL.includes(slug)) return "special";
  if (POKEBALLS_RAREST.includes(slug)) return "rarest";
  return null;
}

/** True if avatar requires pro. Use when implementing pro. */
export function isProAvatar(slug: string): boolean {
  const tier = getAvatarTier(slug);
  return tier === "special" || tier === "rarest";
}

/** True if username indicates a pro user (e.g. "Chris Pro"). Soft pro check for demo. */
export function isProUser(username: string): boolean {
  return username.trimEnd().endsWith(" Pro");
}

/** Fallback when PokeAPI fails — balls with known sprites, ordered common → special → rarest */
export const FALLBACK_POKEBALLS: { slug: string; label: string }[] = [
  { slug: "poke-ball", label: "Poke Ball" },
  { slug: "great-ball", label: "Great Ball" },
  { slug: "ultra-ball", label: "Ultra Ball" },
  { slug: "net-ball", label: "Net Ball" },
  { slug: "dive-ball", label: "Dive Ball" },
  { slug: "nest-ball", label: "Nest Ball" },
  { slug: "repeat-ball", label: "Repeat Ball" },
  { slug: "timer-ball", label: "Timer Ball" },
  { slug: "luxury-ball", label: "Luxury Ball" },
  { slug: "premier-ball", label: "Premier Ball" },
  { slug: "dusk-ball", label: "Dusk Ball" },
  { slug: "heal-ball", label: "Heal Ball" },
  { slug: "quick-ball", label: "Quick Ball" },
  { slug: "safari-ball", label: "Safari Ball" },
  { slug: "master-ball", label: "Master Ball" },
];

export const ITEM_CATEGORY_LABELS: Record<string, string> = {
  key:       "KEY ITEMS",
  hm:        "HMs",
  important: "IMPORTANT ITEMS",
  stone:     "EVOLUTION STONES",
  fossil:    "FOSSILS",
};
