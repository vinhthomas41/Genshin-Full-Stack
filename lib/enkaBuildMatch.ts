import genshindb from "genshin-db";
import { mapAvatarIdToCharacter } from "./enkaCharacterMap";
import type { EnkaAvatarInfo } from "./enka";
import type { LinkedUidRecord, ProfileState } from "./linkedUids";

export interface CharacterBuildMatch {
  genshinUid: string;
  nickname: string;
  avatar: EnkaAvatarInfo;
}

export function findBuildMatches(
  character: genshindb.Character,
  linkedUids: LinkedUidRecord[],
  profiles: { [genshinUid: string]: ProfileState },
): CharacterBuildMatch[] {
  const matches: CharacterBuildMatch[] = [];
  for (const { genshinUid } of linkedUids) {
    const profile = profiles[genshinUid];
    if (!profile || profile.status !== "loaded") continue;
    const result = profile.result;
    if (!("avatarInfoList" in result) || !result.avatarInfoList) continue;
    for (const avatar of result.avatarInfoList) {
      const mapped = mapAvatarIdToCharacter(avatar.avatarId);
      if (mapped && mapped.id === character.id) {
        matches.push({ genshinUid, nickname: result.playerInfo.nickname, avatar });
      }
    }
  }
  return matches;
}
