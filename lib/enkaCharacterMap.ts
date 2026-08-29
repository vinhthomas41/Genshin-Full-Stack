import genshindb from "genshin-db";

// What we found (verified against a real public showcase, UID 618285856, plus
// Enka's own community-maintained data at
// https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json):
//
// Enka's avatarInfoList[].avatarId is exactly genshin-db's character.id — no
// translation table needed. Confirmed for Amber (10000021), Bennett (10000032),
// Ganyu (10000037), and Xingqiu (10000025) against a live showcase.
//
// Traveler does NOT get a different avatarId per element, contrary to what we'd
// assumed going in. Aether is always avatarId 10000005 and Lumine is always
// 10000007, regardless of which element is active. The active element instead
// shows up in that avatar's separate `skillDepotId` field (501/502/503/504/506/507/508
// for Aether, 701/702/703/704/706/707/708 for Lumine, per Enka's own data — note the
// gaps: no 505/705, so Cryo Traveler isn't represented in that source as of this
// writing). Since the installed genshin-db version (5.2.13) only has one generic
// entry per Traveler gender (elementType "ELEMENT_NONE", no per-element variants),
// the plain id-based lookup below already resolves Traveler correctly — there is no
// separate "elemental variant" in genshin-db to pick between. TRAVELER_SKILL_DEPOT_ELEMENT
// is exported separately for callers (e.g. a future build display) that want to know
// which element is actually equipped, since genshin-db can't tell you that.

let idToCharacter: Map<number, genshindb.Character> | undefined;

function getIdToCharacterMap(): Map<number, genshindb.Character> {
  if (idToCharacter) return idToCharacter;

  idToCharacter = new Map();
  const names = genshindb.characters("names", { matchCategories: true }) ?? [];
  for (const name of names) {
    const character = genshindb.characters(name);
    if (character) idToCharacter.set(character.id, character);
  }
  return idToCharacter;
}

// Sourced from Enka's characters.json store, not verified against a live Cryo
// Traveler showcase — treat as best-effort until confirmed.
export const TRAVELER_SKILL_DEPOT_ELEMENT: { [skillDepotId: number]: string } = {
  501: "None",
  502: "Pyro",
  503: "Hydro",
  504: "Anemo",
  506: "Geo",
  507: "Electro",
  508: "Dendro",
  701: "None",
  702: "Pyro",
  703: "Hydro",
  704: "Anemo",
  706: "Geo",
  707: "Electro",
  708: "Dendro",
};

export function mapAvatarIdToCharacter(avatarId: number): genshindb.Character | undefined {
  const character = getIdToCharacterMap().get(avatarId);
  if (!character) {
    console.warn(`mapAvatarIdToCharacter: no genshin-db character found for avatarId ${avatarId}`);
  }
  return character;
}
