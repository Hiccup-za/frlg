"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, useAppActions } from "@/context/AppContext";
import { getItemSpriteUrl } from "@/lib/api";
import { fetchPokeballs, type PokeballEntry } from "@/lib/api";
import { FALLBACK_POKEBALLS, getAvatarTier, isProAvatar, isProUser } from "@/lib/constants";
import { clearState } from "@/lib/storage";
import type { GameKey } from "@/lib/types";
import NavLogo from "@/components/NavLogo";

const GAME_TITLES: Record<GameKey, string> = {
  fr: "FIRE RED",
  lg: "LEAF GREEN",
};

export default function ProfileScreen() {
  const router = useRouter();
  const { state, dispatch, isLoading } = useApp();
  const { setProfile, setAvatar, resetGameData, removeGame } = useAppActions();
  const [pokeballs, setPokeballs] = useState<PokeballEntry[]>([]);
  const [pokeballsLoading, setPokeballsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<GameKey | null>(null);

  useEffect(() => {
    if (!isLoading && !state.username) {
      router.replace("/");
    }
  }, [isLoading, state.username, router]);

  useEffect(() => {
    setEditName(state.username);
  }, [state.username]);

  useEffect(() => {
    fetchPokeballs()
      .then(setPokeballs)
      .catch(() => setPokeballs(FALLBACK_POKEBALLS))
      .finally(() => setPokeballsLoading(false));
  }, []);

  function handleStartEdit() {
    setEditName(state.username);
    setError("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setEditName(state.username);
    setError("");
    setIsEditing(false);
  }

  function handleSave() {
    const trimmed = editName.trim();
    if (!trimmed) {
      setError("Trainer name cannot be empty");
      return;
    }
    setError("");
    setProfile(trimmed, state.games);
    setIsEditing(false);
  }

  function handleResetGameData(game: GameKey) {
    resetGameData(game);
    setResetSuccess(game);
    setTimeout(() => setResetSuccess(null), 2500);
  }

  function handleRemoveGame(game: GameKey) {
    removeGame(game);
    const remaining = state.games.filter((g) => g !== game);
    if (remaining.length === 0) {
      router.replace("/");
    }
  }

  function handleClearAllData() {
    clearState();
    dispatch({ type: "CLEAR" });
    router.replace("/");
  }

  if (isLoading || !state.username) {
    return (
      <div className="profile-screen">
        <div className="loading">LOADING</div>
      </div>
    );
  }

  return (
    <div className="profile-screen">
      <div className="nav-bar">
        <NavLogo />
        <div className="nav-right">
          <button
            className="settings-back-btn"
            onClick={() => router.push("/dashboard")}
            aria-label="Back to dashboard"
          >
            BACK
          </button>
        </div>
      </div>

      <div className="profile-content">
        <h1 className="settings-heading">Profile</h1>

        <div className="profile-section">
          <h2 className="settings-game-title">Trainer Name</h2>
          <div className="profile-trainer-row">
            {isEditing ? (
              <div className="profile-edit-group">
                <input
                  type="text"
                  className="profile-edit-input"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  maxLength={12}
                  autoFocus
                  aria-label="Trainer name"
                />
                {error && <span className="profile-error">{error}</span>}
                <div className="profile-edit-actions">
                  <button
                    className="settings-action-btn neutral"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="settings-action-btn neutral"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-view-row">
                <span className="profile-trainer-name">{state.username}</span>
                <button
                  className="settings-action-btn neutral"
                  onClick={handleStartEdit}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2 className="settings-game-title">Avatar</h2>
          <div className="profile-avatar-row">
            {pokeballsLoading ? (
              <div className="profile-avatar-loading">Loading balls…</div>
            ) : (
              <div className="profile-avatar-grid">
                {pokeballs.map((ball) => {
                  const tier = getAvatarTier(ball.slug);
                  const isPro = isProUser(state.username);
                  const isLocked = isProAvatar(ball.slug) && !isPro;
                  return (
                  <button
                    key={ball.slug}
                    type="button"
                    className={`profile-avatar-option${state.avatarSlug === ball.slug ? " selected" : ""}${tier === "special" ? " special" : ""}${tier === "rarest" ? " rarest" : ""}${isLocked ? " locked" : ""}`}
                    onClick={() => {
                      if (isLocked) return;
                      setAvatar(ball.slug);
                    }}
                    title={isLocked ? "Pro feature" : ball.label}
                  >
                    {state.avatarSlug === ball.slug && (
                      <span className="profile-avatar-check" aria-hidden>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                    {isLocked && (
                      <span className="profile-avatar-lock" aria-hidden title="Pro">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getItemSpriteUrl(ball.slug)}
                      alt={ball.label}
                      className="profile-avatar-img"
                    />
                    <span className="profile-avatar-label">{ball.label}</span>
                  </button>
                );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="settings-content">
          <h1 className="settings-heading">Settings</h1>

          <div className="profile-section settings-game settings-games">
            <h2 className="settings-game-title">GAMES</h2>
            {state.games.length === 0 ? (
              <p className="settings-empty">No games added yet.</p>
            ) : (
              <div className="settings-actions">
                {state.games.map((game) => (
                  <div key={game} className={`settings-game-row ${game}`}>
                    <span className="settings-game-row-title">{GAME_TITLES[game]}</span>
                    <div className="settings-game-row-actions">
                      {resetSuccess === game ? (
                        <span className="settings-reset-success">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Data Reset
                        </span>
                      ) : (
<button
                        className="settings-action-btn warning"
                        onClick={() => handleResetGameData(game)}
                      >
                        Reset Data
                      </button>
                      )}
                      <button
                        className="settings-action-btn orange"
                        onClick={() => handleRemoveGame(game)}
                      >
                        Remove Game
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-section settings-game account">
            <h2 className="settings-game-title">Data</h2>
            <div className="settings-actions">
              <div className="settings-action-row">
                <div className="settings-action-info">
                  <span className="settings-action-label">Clear All Data</span>
                  <span className="settings-action-desc">Permanently delete your trainer profile and all game data from this device. This cannot be undone.</span>
                </div>
                {confirmingDelete ? (
                  <div className="settings-confirm-group">
                    <span className="settings-confirm-label">Are you sure?</span>
                    <button
                      className="settings-action-btn danger-fill"
                      onClick={handleClearAllData}
                    >
                      Yes, Clear
                    </button>
                    <button
                      className="settings-action-btn neutral"
                      onClick={() => setConfirmingDelete(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="settings-action-btn danger-fill"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    Clear All Data
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section settings-game">
            <h2 className="settings-game-title">Data Sources</h2>
            <div className="settings-data-sources-list">
              <a
                href="https://pokeapi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-data-source-row"
              >
                <div className="settings-action-info">
                  <span className="settings-action-label">PokeAPI</span>
                  <span className="settings-action-desc">https://pokeapi.co</span>
                </div>
              </a>
              <a
                href="https://github.com/PokeAPI/sprites"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-data-source-row"
              >
                <div className="settings-action-info">
                  <span className="settings-action-label">PokeAPI Sprites</span>
                  <span className="settings-action-desc">https://github.com/PokeAPI/sprites</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
