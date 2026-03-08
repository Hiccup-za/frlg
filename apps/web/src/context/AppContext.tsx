"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AppState, GameKey, PokemonEntry } from "@/lib/types";
import { loadState, saveState, makeInitialState, makeInitialGameData } from "@/lib/storage";
import { fetchKantoPokemon } from "@/lib/api";
import { KANTO_151 } from "@/lib/constants";

// ─── Actions ────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_POKEMON_LIST"; payload: PokemonEntry[] }
  | { type: "SET_PROFILE"; username: string; games: GameKey[] }
  | { type: "SET_AVATAR"; avatarSlug: string }
  | { type: "TOGGLE_BADGE"; game: GameKey; idx: number }
  | { type: "SET_PARTY_SLOT"; game: GameKey; slotIdx: number; pokemon: { id: number; name: string } | null }
  | { type: "CYCLE_POKEMON_STATUS"; game: GameKey; pokemonId: number }
  | { type: "CYCLE_SHINY_STATUS"; game: GameKey; pokemonId: number }
  | { type: "TOGGLE_ITEM"; game: GameKey; itemId: string }
  | { type: "REMOVE_GAME"; game: GameKey }
  | { type: "RESET_GAME_DATA"; game: GameKey }
  | { type: "LOAD_SAVED"; saved: AppState }
  | { type: "CLEAR" };

// ─── Reducer ────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_POKEMON_LIST":
      return { ...state, allPokemon: action.payload };

    case "SET_PROFILE": {
      const next = { ...state, username: action.username, games: action.games };
      saveState(next);
      return next;
    }

    case "SET_AVATAR": {
      const next = { ...state, avatarSlug: action.avatarSlug };
      saveState(next);
      return next;
    }

    case "TOGGLE_BADGE": {
      const badges = [...state.gameData[action.game].badges];
      badges[action.idx] = !badges[action.idx];
      const next = {
        ...state,
        gameData: {
          ...state.gameData,
          [action.game]: { ...state.gameData[action.game], badges },
        },
      };
      saveState(next);
      return next;
    }

    case "SET_PARTY_SLOT": {
      const party = [...state.gameData[action.game].party];
      party[action.slotIdx] = action.pokemon;
      const caught = { ...state.gameData[action.game].caught };
      if (action.pokemon) caught[action.pokemon.id] = "caught";
      const next = {
        ...state,
        gameData: {
          ...state.gameData,
          [action.game]: { ...state.gameData[action.game], party, caught },
        },
      };
      saveState(next);
      return next;
    }

    case "CYCLE_POKEMON_STATUS": {
      const caught = { ...state.gameData[action.game].caught };
      const current = caught[action.pokemonId] ?? "none";
      const nextStatus =
        current === "none" ? "seen" : current === "seen" ? "caught" : "none";
      caught[action.pokemonId] = nextStatus;
      const next = {
        ...state,
        gameData: {
          ...state.gameData,
          [action.game]: { ...state.gameData[action.game], caught },
        },
      };
      saveState(next);
      return next;
    }

    case "CYCLE_SHINY_STATUS": {
      const shiny = { ...state.gameData[action.game].shiny };
      const current = shiny[action.pokemonId] ?? "none";
      const nextStatus =
        current === "none" ? "seen" : current === "seen" ? "caught" : "none";
      shiny[action.pokemonId] = nextStatus;
      const next = {
        ...state,
        gameData: {
          ...state.gameData,
          [action.game]: { ...state.gameData[action.game], shiny },
        },
      };
      saveState(next);
      return next;
    }

    case "TOGGLE_ITEM": {
      const inventory = { ...state.gameData[action.game].inventory };
      inventory[action.itemId] = !inventory[action.itemId];
      const next = {
        ...state,
        gameData: {
          ...state.gameData,
          [action.game]: { ...state.gameData[action.game], inventory },
        },
      };
      saveState(next);
      return next;
    }

    case "REMOVE_GAME": {
      const next = {
        ...state,
        games: state.games.filter((g) => g !== action.game),
      };
      saveState(next);
      return next;
    }

    case "RESET_GAME_DATA": {
      const next = {
        ...state,
        gameData: {
          ...state.gameData,
          [action.game]: makeInitialGameData(),
        },
      };
      saveState(next);
      return next;
    }

    case "LOAD_SAVED":
      return { ...action.saved, allPokemon: state.allPokemon };

    case "CLEAR": {
      const fresh = makeInitialState();
      saveState(fresh);
      return fresh;
    }

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, makeInitialState());
  const [isLoading, setIsLoading] = useReducer(
    (_: boolean, next: boolean) => next,
    true
  );

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      dispatch({ type: "LOAD_SAVED", saved });
    }

    fetchKantoPokemon()
      .then((list) => dispatch({ type: "SET_POKEMON_LIST", payload: list }))
      .catch(() => {
        const fallback = KANTO_151.map((name, i) => ({ name, id: i + 1 }));
        dispatch({ type: "SET_POKEMON_LIST", payload: fallback });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useAppActions() {
  const { dispatch } = useApp();

  const setProfile = useCallback(
    (username: string, games: GameKey[]) =>
      dispatch({ type: "SET_PROFILE", username, games }),
    [dispatch]
  );

  const setAvatar = useCallback(
    (avatarSlug: string) => dispatch({ type: "SET_AVATAR", avatarSlug }),
    [dispatch]
  );

  const toggleBadge = useCallback(
    (game: GameKey, idx: number) =>
      dispatch({ type: "TOGGLE_BADGE", game, idx }),
    [dispatch]
  );

  const setPartySlot = useCallback(
    (game: GameKey, slotIdx: number, pokemon: { id: number; name: string } | null) =>
      dispatch({ type: "SET_PARTY_SLOT", game, slotIdx, pokemon }),
    [dispatch]
  );

  const cyclePokemonStatus = useCallback(
    (game: GameKey, pokemonId: number) =>
      dispatch({ type: "CYCLE_POKEMON_STATUS", game, pokemonId }),
    [dispatch]
  );

  const cycleShinyStatus = useCallback(
    (game: GameKey, pokemonId: number) =>
      dispatch({ type: "CYCLE_SHINY_STATUS", game, pokemonId }),
    [dispatch]
  );

  const { state } = useApp();

  const addGame = useCallback(
    (game: GameKey) =>
      dispatch({ type: "SET_PROFILE", username: state.username, games: [...state.games, game] }),
    [dispatch, state.username, state.games]
  );

  const removeGame = useCallback(
    (game: GameKey) => dispatch({ type: "REMOVE_GAME", game }),
    [dispatch]
  );

  const resetGameData = useCallback(
    (game: GameKey) => dispatch({ type: "RESET_GAME_DATA", game }),
    [dispatch]
  );

  const toggleItem = useCallback(
    (game: GameKey, itemId: string) =>
      dispatch({ type: "TOGGLE_ITEM", game, itemId }),
    [dispatch]
  );

  return { setProfile, setAvatar, toggleBadge, setPartySlot, cyclePokemonStatus, cycleShinyStatus, addGame, removeGame, resetGameData, toggleItem };
}
