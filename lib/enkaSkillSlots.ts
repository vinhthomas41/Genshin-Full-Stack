import skillSlotData from "./data/enkaSkillSlots.json";

// Enka's avatarInfoList[].skillLevelMap is keyed by internal numeric skill ids
// (e.g. "10017"), not by "combat1/combat2/combat3" — genshin-db doesn't expose those
// ids either, so there's no direct way to tell which key is Normal Attack vs Skill
// vs Burst from the API response alone.
//
// This table was derived from Enka's own community-maintained data
// (https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json),
// whose per-character "Skills" map tags each skill id with a "Skill_A_"/"Skill_S_"/
// "Skill_E_" prefix. Cross-checked against a real showcase (UID 618285856): for
// Amber/Bennett/Ganyu/Xingqiu, "A" landed on Normal Attack, "S" on Elemental Skill,
// and "E" on Elemental Burst consistently — likely "A"ttack, "S"kill, and "E"nergy
// (bursts consume energy), since no character in the source data has a "Q" tag.
// combatsp/combatju (Mona/Ayaka's alt sprint, Ororon's extra kit) aren't included:
// Mona and Ayaka's alt-sprint has no separate level in Enka's data at all, so there's
// nothing to sync for those slots — they're left at their own default.
//
// Traveler is looked up by `${avatarId}-${skillDepotId}` first (falling back to the
// plain avatarId) since Aether/Lumine keep one avatarId across all elements and only
// skillDepotId changes — see lib/enkaCharacterMap.ts for the full writeup.
const skillSlots = skillSlotData as { [avatarKey: string]: { [skillId: string]: "A" | "S" | "E" } };

export interface CombatTalentLevelDefaults {
  combat1?: number;
  combat2?: number;
  combat3?: number;
}

export function getCombatTalentLevels(
  avatarId: number,
  skillDepotId: number,
  skillLevelMap: { [skillId: string]: number },
): CombatTalentLevelDefaults {
  const slots = skillSlots[`${avatarId}-${skillDepotId}`] ?? skillSlots[String(avatarId)];
  if (!slots) return {};

  const defaults: CombatTalentLevelDefaults = {};
  for (const [skillId, level] of Object.entries(skillLevelMap)) {
    switch (slots[skillId]) {
      case "A":
        defaults.combat1 = level;
        break;
      case "S":
        defaults.combat2 = level;
        break;
      case "E":
        defaults.combat3 = level;
        break;
    }
  }
  return defaults;
}
