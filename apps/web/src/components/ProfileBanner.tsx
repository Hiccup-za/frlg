"use client";

import { useApp } from "@/context/AppContext";
import { getItemSpriteUrl } from "@/lib/api";

export default function ProfileBanner() {
  const { state } = useApp();

  const avatarSlug = state.avatarSlug ?? "master-ball";

  return (
    <div className="profile-greeting-row">
      <span className="profile-greeting-text">Welcome back,</span>
      <div className="profile-greeting-identity">
        <div className="profile-greeting-avatar-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getItemSpriteUrl(avatarSlug)}
            alt=""
            className="profile-greeting-avatar"
          />
        </div>
        <span className="profile-greeting-name">{state.username}</span>
      </div>
    </div>
  );
}
