// FightProp ids and formatting per Enka's own official reference:
// https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/docs/gi/api.md
// These are Enka's final, pre-calculated stats — not recomputed here.
export const FIGHT_PROP_LABELS: { [id: string]: string } = {
  "2000": "Max HP",
  "2001": "ATK",
  "2002": "DEF",
  "28": "Elemental Mastery",
  "20": "CRIT Rate",
  "22": "CRIT DMG",
  "23": "Energy Recharge",
  "26": "Healing Bonus",
  "30": "Physical DMG Bonus",
  "40": "Pyro DMG Bonus",
  "41": "Electro DMG Bonus",
  "42": "Hydro DMG Bonus",
  "43": "Dendro DMG Bonus",
  "44": "Anemo DMG Bonus",
  "45": "Geo DMG Bonus",
  "46": "Cryo DMG Bonus",
};

// Display order for the "core" stats block (element DMG bonus is looked up separately per character).
export const CORE_FIGHT_PROP_IDS = ["2000", "2001", "2002", "28", "20", "22", "23"];

const PERCENT_FIGHT_PROP_IDS = new Set(["20", "22", "23", "26", "30", "40", "41", "42", "43", "44", "45", "46"]);

export function formatFightProp(id: string, value: number): string {
  if (PERCENT_FIGHT_PROP_IDS.has(id)) return `${(value * 100).toFixed(1)}%`;
  return value.toFixed(1).replace(/\.0$/, "");
}

// elementType from genshin-db (e.g. "ELEMENT_PYRO") -> the FightProp id for that
// element's DMG Bonus stat. Verified against real character objects (Amber ->
// ELEMENT_PYRO, Xingqiu -> ELEMENT_HYDRO, etc) — genshin-db uses the standard
// element names here, not Enka's own internal ones (Fire/Water/Wind/...).
const ELEMENT_TYPE_TO_DMG_BONUS_ID: { [elementType: string]: string } = {
  ELEMENT_PYRO: "40",
  ELEMENT_ELECTRO: "41",
  ELEMENT_HYDRO: "42",
  ELEMENT_DENDRO: "43",
  ELEMENT_ANEMO: "44",
  ELEMENT_GEO: "45",
  ELEMENT_CRYO: "46",
};

export function getElementalDmgBonusPropId(elementType: string): string | undefined {
  return ELEMENT_TYPE_TO_DMG_BONUS_ID[elementType];
}

// Named AppendProp ids used on artifact main/substats and weapon stats — a separate
// id space from the numeric FightProp ids above, per the same Enka reference. Enka
// pre-formats these statValues as display-ready numbers (e.g. 11.1 meaning 11.1%
// for a percent stat), so percent ones only need a "%" suffix, not *100.
const APPEND_PROP_LABELS: { [id: string]: { label: string; percent: boolean } } = {
  FIGHT_PROP_BASE_ATTACK: { label: "Base ATK", percent: false },
  FIGHT_PROP_HP: { label: "HP", percent: false },
  FIGHT_PROP_ATTACK: { label: "ATK", percent: false },
  FIGHT_PROP_DEFENSE: { label: "DEF", percent: false },
  FIGHT_PROP_HP_PERCENT: { label: "HP%", percent: true },
  FIGHT_PROP_ATTACK_PERCENT: { label: "ATK%", percent: true },
  FIGHT_PROP_DEFENSE_PERCENT: { label: "DEF%", percent: true },
  FIGHT_PROP_CRITICAL: { label: "CRIT Rate", percent: true },
  FIGHT_PROP_CRITICAL_HURT: { label: "CRIT DMG", percent: true },
  FIGHT_PROP_CHARGE_EFFICIENCY: { label: "Energy Recharge", percent: true },
  FIGHT_PROP_HEAL_ADD: { label: "Healing Bonus", percent: true },
  FIGHT_PROP_ELEMENT_MASTERY: { label: "Elemental Mastery", percent: false },
  FIGHT_PROP_PHYSICAL_ADD_HURT: { label: "Physical DMG Bonus", percent: true },
  FIGHT_PROP_FIRE_ADD_HURT: { label: "Pyro DMG Bonus", percent: true },
  FIGHT_PROP_ELEC_ADD_HURT: { label: "Electro DMG Bonus", percent: true },
  FIGHT_PROP_WATER_ADD_HURT: { label: "Hydro DMG Bonus", percent: true },
  FIGHT_PROP_WIND_ADD_HURT: { label: "Anemo DMG Bonus", percent: true },
  FIGHT_PROP_ICE_ADD_HURT: { label: "Cryo DMG Bonus", percent: true },
  FIGHT_PROP_ROCK_ADD_HURT: { label: "Geo DMG Bonus", percent: true },
  FIGHT_PROP_GRASS_ADD_HURT: { label: "Dendro DMG Bonus", percent: true },
};

export function formatAppendProp(id: string, value: number): { label: string; value: string } {
  const entry = APPEND_PROP_LABELS[id];
  if (!entry) return { label: id, value: String(value) };
  return { label: entry.label, value: entry.percent ? `${value}%` : String(value) };
}
