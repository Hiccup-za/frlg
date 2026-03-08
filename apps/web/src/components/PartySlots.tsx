"use client";

import { useEffect, useState } from "react";
import { getSpriteUrl, getFallbackSpriteUrl, getNextEvolutionRequirement } from "@/lib/api";
import { useApp, useAppActions } from "@/context/AppContext";
import type { GameKey, PokemonEntry } from "@/lib/types";

interface PartySlotProps {
  game: GameKey;
  onAddRequest: (slotIdx: number) => void;
}

function PartySlotOccupied({
  pokemon,
  slotIdx,
  onRemove,
}: {
  pokemon: PokemonEntry;
  slotIdx: number;
  onRemove: (e: React.MouseEvent) => void;
}) {
  const [evolutionReq, setEvolutionReq] = useState<string | null | "loading">("loading");

  useEffect(() => {
    let cancelled = false;
    setEvolutionReq("loading");
    getNextEvolutionRequirement(pokemon.id, pokemon.name)
      .then((req) => {
        if (!cancelled) setEvolutionReq(req);
      })
      .catch(() => {
        if (!cancelled) setEvolutionReq(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pokemon.id, pokemon.name]);

  return (
    <div className="party-slot occupied">
      <span className="slot-num">{slotIdx + 1}</span>
      <button
        className="remove-slot"
        onClick={onRemove}
        aria-label={`Remove ${pokemon.name}`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="slot-sprite"
        src={getSpriteUrl(pokemon.id)}
        alt={pokemon.name}
        onError={(e) => {
          const img = e.currentTarget;
          img.onerror = null;
          img.src = getFallbackSpriteUrl(pokemon.id);
        }}
      />
      <span className="slot-name">{pokemon.name}</span>
      {evolutionReq === "loading" && (
        <span className="slot-evolution">…</span>
      )}
      {evolutionReq && evolutionReq !== "loading" && (
        <span className="slot-evolution">→ {evolutionReq}</span>
      )}
    </div>
  );
}

export default function PartySlots({ game, onAddRequest }: PartySlotProps) {
  const { state } = useApp();
  const { setPartySlot } = useAppActions();
  const party = state.gameData[game].party;

  function removeFromParty(idx: number, e: React.MouseEvent) {
    e.stopPropagation();
    setPartySlot(game, idx, null);
  }

  return (
    <div className="party-slots">
      {Array.from({ length: 6 }, (_, i) => {
        const pokemon = party[i];

        if (pokemon) {
          return (
            <PartySlotOccupied
              key={i}
              pokemon={pokemon}
              slotIdx={i}
              onRemove={(e) => removeFromParty(i, e)}
            />
          );
        }

        return (
          <div key={i} className="party-slot" onClick={() => onAddRequest(i)}>
            <span className="slot-num">{i + 1}</span>
            <span className="slot-plus">+</span>
          </div>
        );
      })}
    </div>
  );
}
