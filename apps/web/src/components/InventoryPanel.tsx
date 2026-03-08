"use client";

import { useState } from "react";
import { useApp, useAppActions } from "@/context/AppContext";
import { INVENTORY_ITEMS, ITEM_CATEGORY_LABELS } from "@/lib/constants";
import { getItemSpriteUrl } from "@/lib/api";
import type { GameKey, ItemCategory } from "@/lib/types";

interface InventoryPanelProps {
  game: GameKey;
}

const CATEGORY_ORDER: ItemCategory[] = ["key", "hm", "important", "stone", "fossil"];


export default function InventoryPanel({ game }: InventoryPanelProps) {
  const { state } = useApp();
  const { toggleItem } = useAppActions();
  const inventory = state.gameData[game].inventory;

  const [collapsed, setCollapsed] = useState<Partial<Record<ItemCategory, boolean>>>({});

  const toggleCollapse = (cat: ItemCategory) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const totalItems = INVENTORY_ITEMS.length;
  const obtainedCount = INVENTORY_ITEMS.filter((item) => inventory[item.id]).length;

  return (
    <div className="inventory-section">
      <div className="section-label">
        INVENTORY
        <span className="inventory-count">{obtainedCount}/{totalItems}</span>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const items = INVENTORY_ITEMS.filter((item) => item.category === cat);
        const catObtained = items.filter((item) => inventory[item.id]).length;
        const isCollapsed = collapsed[cat];

        return (
          <div key={cat} className="inventory-category">
            <button
              className="inventory-category-header"
              onClick={() => toggleCollapse(cat)}
              aria-expanded={!isCollapsed}
            >
              <span className="inventory-category-label">{ITEM_CATEGORY_LABELS[cat]}</span>
              <span className="inventory-category-count">{catObtained}/{items.length}</span>
              <span className="inventory-category-chevron">{isCollapsed ? "▶" : "▼"}</span>
            </button>

            {!isCollapsed && (
              <div className="inventory-grid">
                {items.map((item) => {
                  const obtained = !!inventory[item.id];
                  return (
                    <button
                      key={item.id}
                      className={`item-card${obtained ? " obtained" : ""}${` ${game}`}`}
                      onClick={() => toggleItem(game, item.id)}
                      title={obtained ? `${item.label} — obtained (click to undo)` : `${item.label} — not obtained`}
                    >
                      {obtained && <span className="item-card-obtained-badge">✓</span>}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getItemSpriteUrl(item.spriteSlug)}
                        alt={item.label}
                        className="item-card-sprite"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                      <span className="item-card-label">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
