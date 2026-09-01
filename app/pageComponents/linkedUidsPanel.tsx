"use client";
import { useEffect, useState } from "react";
import type { LinkedUidRecord, ProfileState } from "@/lib/linkedUids";

interface passedData {
  userUid: string | null;
  linkedUids: LinkedUidRecord[];
  profiles: { [genshinUid: string]: ProfileState };
  onLinkUid: (genshinUid: string) => void;
  onUnlinkUid: (record: LinkedUidRecord) => void;
  onRefreshUid: (genshinUid: string) => void;
}

const UID_REGEX = /^\d{9}$/;

const LinkedUidsPanel: React.FC<passedData> = ({
  userUid,
  linkedUids,
  profiles,
  onLinkUid,
  onUnlinkUid,
  onRefreshUid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newUidInput, setNewUidInput] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  // Only ticks while the panel is open — it's just driving the refresh countdown display.
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  function linkUid() {
    setLinkError(null);
    const trimmed = newUidInput.trim();
    if (!UID_REGEX.test(trimmed)) {
      setLinkError("Enter a 9-digit Genshin UID.");
      return;
    }
    if (!userUid) {
      setLinkError("Still setting up your session — try again in a moment.");
      return;
    }
    if (linkedUids.some((record) => record.genshinUid === trimmed)) {
      setLinkError("That UID is already linked.");
      return;
    }
    onLinkUid(trimmed);
    setNewUidInput("");
  }

  function refreshSecondsRemaining(genshinUid: string): number {
    const profile = profiles[genshinUid];
    if (!profile || profile.status !== "loaded") return 0;
    const result = profile.result;
    if (!("cachedAt" in result)) return 0;
    const remainingMs = result.cachedAt + result.ttl * 1000 - now;
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  function describeProfile(profile: ProfileState | undefined): string {
    if (!profile || profile.status === "loading") return "Loading…";
    if (profile.status === "error") return profile.message;
    const result = profile.result;
    if ("error" in result) return result.error;
    if ("showcaseEmpty" in result) {
      return `${result.playerInfo?.nickname ?? "This player"}'s showcase is empty or private.`;
    }
    return `${result.playerInfo.nickname} — Lv ${result.playerInfo.level}`;
  }

  return (
    <>
      <div
        className="flex w-full cursor-pointer justify-center py-3 text-xs uppercase tracking-widest hover:bg-glow hover:text-black transition-colors"
        onClick={() => setIsOpen(true)}
      >
        Linked UIDs{linkedUids.length > 0 ? ` (${linkedUids.length})` : ""}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 font-mono"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md border-4 border-glow bg-black text-white panel-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-4 border-glow px-4 py-2">
              <p className="text-glow text-xs uppercase tracking-widest">Linked Genshin UIDs</p>
              <button
                className="px-2 text-xs uppercase tracking-widest hover:bg-glow hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="flex gap-2 border-b border-glow/20 p-4">
              <input
                className="flex-1 border-b border-glow bg-black px-2 py-1 text-sm outline-none"
                type="text"
                placeholder="9-digit UID"
                value={newUidInput}
                onChange={(e) => setNewUidInput(e.target.value)}
              />
              <button
                className="border border-glow px-3 text-xs uppercase tracking-widest hover:bg-glow hover:text-black transition-colors"
                onClick={linkUid}
              >
                Link
              </button>
            </div>
            {linkError && <p className="px-4 pb-2 text-xs text-red-400">{linkError}</p>}

            <ul className="divide-y divide-glow/20 max-h-80 overflow-y-auto">
              {linkedUids.length === 0 && (
                <li className="px-4 py-3 text-xs text-white/50">No linked UIDs yet.</li>
              )}
              {linkedUids.map((record) => {
                const profile = profiles[record.genshinUid];
                const remaining = refreshSecondsRemaining(record.genshinUid);
                return (
                  <li key={record.docId} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">{record.genshinUid}</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="border border-glow/40 px-2 py-1 text-xs uppercase tracking-widest hover:bg-glow hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                          disabled={remaining > 0 || profile?.status === "loading"}
                          onClick={() => onRefreshUid(record.genshinUid)}
                        >
                          {remaining > 0 ? `Refresh (${remaining}s)` : "Refresh"}
                        </button>
                        <button
                          className="border border-glow/40 px-2 py-1 text-xs uppercase tracking-widest hover:bg-glow hover:text-black transition-colors"
                          onClick={() => onUnlinkUid(record)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-white/60">{describeProfile(profile)}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkedUidsPanel;
