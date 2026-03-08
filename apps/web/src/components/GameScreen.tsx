"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isValidGame } from "@/lib/storage";
import PartySlots from "@/components/PartySlots";
import PokedexGrid from "@/components/PokedexGrid";
import GymBadges from "@/components/GymBadges";
import SearchModal from "@/components/SearchModal";
import InventoryPanel from "@/components/InventoryPanel";
import type { GameKey } from "@/lib/types";
import NavLogo from "@/components/NavLogo";

interface GameScreenProps {
  game: string;
}

export default function GameScreen({ game }: GameScreenProps) {
  const router = useRouter();
  const { state, isLoading } = useApp();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [view, setView] = useState<"dex" | "shiny" | "inventory">("dex");

  const isShiny = view === "shiny";
  const showInventory = view === "inventory";

  // Auth guard + valid game guard
  useEffect(() => {
    if (isLoading) return;
    if (!state.username || state.games.length === 0) {
      router.replace("/");
      return;
    }
    if (!isValidGame(game) || !state.games.includes(game as GameKey)) {
      router.replace("/dashboard");
    }
  }, [isLoading, state.username, state.games, game, router]);

  if (isLoading || !state.username || !isValidGame(game)) {
    return (
      <div className="game-screen">
        <div className="loading">LOADING</div>
      </div>
    );
  }

  const validGame = game as GameKey;
  const isFr = validGame === "fr";
  const title = isFr ? "FIRE RED" : "LEAF GREEN";

  return (
    <div className="game-screen">
      <div className="nav-bar">
        <NavLogo />
        <div className="nav-right">
          <button className="back-btn" onClick={() => router.push("/dashboard")}>
            BACK
          </button>
        </div>
      </div>

      <div className="game-header">
        <div>
          <div className={`game-header-title ${isFr ? "fr-text" : "lg-text"}`}>
            {title}
          </div>
          <div className="game-header-sub">KANTO REGION — 151 POKÉMON</div>
        </div>
        <div className="header-toggles">
          <button
            className={`shiny-toggle-btn${isShiny ? " active" : ""}`}
            onClick={() => setView((v) => (v === "shiny" ? "dex" : "shiny"))}
            title={isShiny ? "Switch to normal Pokédex" : "Switch to shiny Pokédex"}
          >
            SHINY
          </button>
          <button
            className={`shiny-toggle-btn inventory-toggle-btn${showInventory ? " active" : ""}`}
            onClick={() => setView((v) => (v === "inventory" ? "dex" : "inventory"))}
            title={showInventory ? "Switch to Pokédex" : "Switch to Inventory"}
          >
            BAG
          </button>
        </div>
      </div>

      <div className="section-label">PARTY POKÉMON</div>

      <PartySlots game={validGame} onAddRequest={(idx) => setActiveSlot(idx)} />

      <GymBadges game={validGame} />

      {showInventory ? (
        <InventoryPanel game={validGame} />
      ) : (
        <PokedexGrid game={validGame} isShiny={isShiny} />
      )}

      {activeSlot !== null && (
        <SearchModal
          game={validGame}
          slotIdx={activeSlot}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  );
}
