import genshindb from "genshin-db";

// Same correspondence found for characters in lib/enkaCharacterMap.ts also holds
// here: an equipped weapon's `itemId` is exactly genshin-db's weapon `.id`, and an
// artifact's `flat.setId` is exactly genshin-db's artifact-set `.id`. Verified
// against a real showcase (UID 618285856): itemId 11503 -> Freedom-Sworn, 15501 ->
// Skyward Harp; setId 15008 -> Bloodstained Chivalry, 15007 -> Noblesse Oblige,
// 15018 -> Pale Flame.

let weaponIdMap: Map<number, genshindb.Weapon> | undefined;
let artifactIdMap: Map<number, genshindb.Artifact> | undefined;

function getWeaponIdMap(): Map<number, genshindb.Weapon> {
  if (weaponIdMap) return weaponIdMap;
  weaponIdMap = new Map();
  const names = genshindb.weapons("names", { matchCategories: true }) ?? [];
  for (const name of names) {
    const weapon = genshindb.weapons(name);
    if (weapon) weaponIdMap.set(weapon.id, weapon);
  }
  return weaponIdMap;
}

function getArtifactIdMap(): Map<number, genshindb.Artifact> {
  if (artifactIdMap) return artifactIdMap;
  artifactIdMap = new Map();
  const names = genshindb.artifacts("names", { matchCategories: true }) ?? [];
  for (const name of names) {
    const artifact = genshindb.artifacts(name);
    if (artifact) artifactIdMap.set(artifact.id, artifact);
  }
  return artifactIdMap;
}

export function mapWeaponIdToWeapon(itemId: number): genshindb.Weapon | undefined {
  return getWeaponIdMap().get(itemId);
}

export function mapArtifactSetIdToArtifact(setId: number): genshindb.Artifact | undefined {
  return getArtifactIdMap().get(setId);
}
