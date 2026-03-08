"use client";

import { useRouter } from "next/navigation";

export default function ProfileButton() {
  const router = useRouter();

  return (
    <button
      className="profile-btn"
      onClick={() => router.push("/profile")}
      aria-label="Profile"
    >
      PROFILE
    </button>
  );
}
