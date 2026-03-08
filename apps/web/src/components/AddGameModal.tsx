"use client";

import { useEffect } from "react";
import { useApp, useAppActions } from "@/context/AppContext";
import type { GameKey } from "@/lib/types";

const ALL_GAMES: GameKey[] = ["fr", "lg"];

const GAME_META: Record<GameKey, { art: string; title: string }> = {
  fr: { art: "/Charizard.png", title: "FIRE RED" },
  lg: { art: "/Venusaur.png", title: "LEAF GREEN" },
};

interface AddGameModalProps {
  onClose: () => void;
}

export default function AddGameModal({ onClose }: AddGameModalProps) {
  const { state } = useApp();
  const { addGame } = useAppActions();

  const missingGames = ALL_GAMES.filter((g) => !state.games.includes(g));

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSelect(game: GameKey) {
    addGame(game);
    onClose();
  }

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="add-game-modal auth-card">
        <div className="add-game-header">
          <h3 className="add-game-title">Add Game</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="game-select">
          {missingGames.map((game) => {
            const { art, title } = GAME_META[game];
            return (
              <button
                key={game}
                type="button"
                className={`game-card ${game}`}
                onClick={() => handleSelect(game)}
              >
                <div className="card-header">
                  <div className={`card-header-title ${game === "fr" ? "fr-text" : "lg-text"}`}>
                    {title}
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art} alt={title} className="card-cover-art" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
