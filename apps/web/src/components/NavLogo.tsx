"use client";

import { getItemSpriteUrl } from "@/lib/api";

export default function NavLogo() {
  const avatarSlug = "master-ball";
  const label = avatarSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="nav-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getItemSpriteUrl(avatarSlug)}
        alt={label}
        className="nav-logo-img"
      />
      <span className="nav-title">DEX</span>
    </div>
  );
}
