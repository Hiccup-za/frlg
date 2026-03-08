"use client";

import { useApp, useAppActions } from "@/context/AppContext";
import { GYM_INFO } from "@/lib/constants";
import type { GameKey } from "@/lib/types";

const BADGE_IMAGES: Record<string, string> = {
  Boulder: "/badges/boulder.png",
  Cascade: "/badges/cascade.png",
  Thunder: "/badges/thunder.png",
  Rainbow: "/badges/rainbow.png",
  Soul: "/badges/soul.png",
  Marsh: "/badges/marsh.png",
  Volcano: "/badges/volcano.png",
  Earth: "/badges/earth.png",
};

interface GymBadgesProps {
  game: GameKey;
}

export default function GymBadges({ game }: GymBadgesProps) {
  const { state } = useApp();
  const { toggleBadge } = useAppActions();
  const badges = state.gameData[game].badges;

  return (
    <div className="gym-badges-section">
      <div className="section-label">GYM BADGES</div>

      <div className="gym-badges-grid">
        {GYM_INFO.map((info, i) => {
          const earned = badges[i];
          const imgSrc = BADGE_IMAGES[info.badge];

          return (
            <div
              key={i}
              className={`gym-badge-card ${earned ? "earned" : "not-earned"} ${game}`}
              onClick={() => toggleBadge(game, i)}
            >
              <div className="gym-badge-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={info.badge}
                  className="gym-badge-img"
                />
              </div>
              <div className="gym-badge-info">
                <span className="gym-badge-name">{info.badge} Badge</span>
                <span className="gym-badge-gym">{info.gym}</span>
                <span className="gym-badge-leader">{info.leader}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
