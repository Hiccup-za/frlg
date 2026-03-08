"use client";

import { useState } from "react";
import { useApp, useAppActions } from "@/context/AppContext";
import { getSpriteUrl, getFallbackSpriteUrl, getShinySpriteUrl, getShinyFallbackSpriteUrl } from "@/lib/api";
import type { GameKey, PokemonStatus } from "@/lib/types";

interface PokedexGridProps {
  game: GameKey;
  isShiny?: boolean;
}

export default function PokedexGrid({ game, isShiny = false }: PokedexGridProps) {
  const { state } = useApp();
  const { cyclePokemonStatus, cycleShinyStatus } = useAppActions();
  const [query, setQuery] = useState("");

  const statusMap = isShiny ? state.gameData[game].shiny : state.gameData[game].caught;
  const seenCount = Object.values(statusMap).filter(
    (s: PokemonStatus) => s === "seen" || s === "caught"
  ).length;
  const caughtCount = Object.values(statusMap).filter((s: PokemonStatus) => s === "caught").length;
  const pct = Math.round((caughtCount / 151) * 100);

  const q = query.trim().toLowerCase();
  const filteredIds = q
    ? Array.from({ length: 151 }, (_, i) => i + 1).filter((id) => {
        const name = state.allPokemon[id - 1]?.name ?? "";
        return name.toLowerCase().includes(q);
      })
    : Array.from({ length: 151 }, (_, i) => i + 1);

  return (
    <div className="pokedex-section">
      <div className={`section-label${isShiny ? " shiny-label" : ""}`}>
        {isShiny ? "SHINY DEX" : "POKÉDEX"}
      </div>

      <div className="pokedex-search-wrap">
        <input
          type="text"
          placeholder="Search Pokémon to add to Pokédex..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pokedex-search-input"
        />
      </div>

      <div className="progress-label">
        <span>{seenCount} / 151 {isShiny ? "ENCOUNTERED" : "SEEN"} · {caughtCount} / 151 {isShiny ? "CAUGHT SHINY" : "CAUGHT"}</span>
        <span>{pct}%</span>
      </div>

      <div className="progress-bar-wrap">
        <div
          className={`progress-bar-fill ${game === "fr" ? "fr-bar" : "lg-bar"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="pokedex-grid">
        {filteredIds.map((id) => {
          const name = state.allPokemon[id - 1]?.name ?? `pokemon-${id}`;
          const status = (statusMap[id] ?? "none") as PokemonStatus;
          const isSeen = status === "seen" || status === "caught";
          const isCaught = status === "caught";

          return (
            <div
              key={id}
              className={`dex-card ${isCaught ? "caught" : isSeen ? "seen" : "not-caught"}${isShiny ? " shiny-card" : ""}`}
              onClick={() => isShiny ? cycleShinyStatus(game, id) : cyclePokemonStatus(game, id)}
            >
              <span className="dex-num">#{String(id).padStart(3, "0")}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isShiny ? getShinySpriteUrl(id) : getSpriteUrl(id)}
                alt={isSeen ? name : "???"}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = isShiny ? getShinyFallbackSpriteUrl(id) : getFallbackSpriteUrl(id);
                }}
              />
              <span className="dex-name">{isSeen ? name : "???"}</span>
              {isCaught && (
                <div className="caught-check">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredIds.length === 0 && (
        <div className="pokedex-no-results">
          No Pokémon matching &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
