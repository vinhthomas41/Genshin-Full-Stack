"use client";
import React, { useState } from "react";
import genshindb from "genshin-db";
import starS from "../../public/selectedStar.png";
import star from "../../public/Star.png";
import Image from "next/image";
import LinkedUidsPanel from "./linkedUidsPanel";
import type { LinkedUidRecord, ProfileState } from "@/lib/linkedUids";

interface passedData {
  charList: genshindb.Character[];
  sendData: (newChar: genshindb.Character) => void;
  favorites: string[] | null;
  favoriteClick: (char: genshindb.Character) => void;
  userUid: string | null;
  linkedUids: LinkedUidRecord[];
  profiles: { [genshinUid: string]: ProfileState };
  onLinkUid: (genshinUid: string) => void;
  onUnlinkUid: (record: LinkedUidRecord) => void;
  onRefreshUid: (genshinUid: string) => void;
}

const Sidebar: React.FC<passedData> = ({
  charList,
  sendData,
  favorites,
  favoriteClick,
  userUid,
  linkedUids,
  profiles,
  onLinkUid,
  onUnlinkUid,
  onRefreshUid,
}) => {
  const [favoriteMode, setFavoriteMode] = useState<boolean>(false);

  return (
    <div className="h-full w-60 overflow-y-auto border-r-4 border-glow font-mono flex-shrink-0 panel-glow [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-glow" id="sidebar">
      <div className="sticky top-0 z-10 border-b-4 border-glow bg-black">
        <div
          className="flex w-full cursor-pointer justify-center border-b border-glow/20 py-3 text-xs uppercase tracking-widest hover:bg-glow hover:text-black transition-colors"
          onClick={() => setFavoriteMode(!favoriteMode)}
        >
          {favoriteMode ? <>Favorites: on</> : <>Favorites: off</>}
        </div>
        <LinkedUidsPanel
          userUid={userUid}
          linkedUids={linkedUids}
          profiles={profiles}
          onLinkUid={onLinkUid}
          onUnlinkUid={onUnlinkUid}
          onRefreshUid={onRefreshUid}
        />
      </div>
      <ul className="divide-y divide-glow/20" id="sidebarList">
        {charList
          .filter((character) => (favoriteMode && favorites?.includes(character.name)) || !favoriteMode)
          .map((character) => (
            <li
              key={character.name}
              className="flex cursor-pointer items-center p-2 px-3 text-sm uppercase tracking-wide hover:bg-glow hover:text-black transition-colors"
              onClick={() => sendData(character)}
            >
              {character.images.hoyowiki_icon ? (
                <Image src={character.images.hoyowiki_icon} alt={character.name} width={40} height={40} className="w-10 mr-2" />
              ) : (
                <div className="h-10 w-10 mr-2 border border-glow/20" />
              )}
              {character.name}
              <div className="group relative ml-auto w-7">
                {!favorites!.includes(character.name) ? (
                  <>
                    <Image src={star.src} alt="star" className="absolute opacity-100 group-hover:opacity-0" width={28} height={28} onClick={() => favoriteClick(character)} />
                    <Image src={starS.src} alt="selected star" width={28} height={28} className="opacity-0 group-hover:opacity-100" />
                  </>
                ) : (
                  <Image src={starS.src} alt="selected star" width={28} height={28} onClick={() => favoriteClick(character)} />
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;