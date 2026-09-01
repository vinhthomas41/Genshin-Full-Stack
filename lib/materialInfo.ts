import genshindb from "genshin-db";

// genshin-db's bundled Material type (node_modules/genshin-db/types/folders/materials.d.ts)
// doesn't match the actual runtime shape: it declares `source: string[]` but the real
// field is `sources`, and it's missing `dropDomainId`/`dropDomainName`/`daysOfWeek`
// entirely even though real domain materials return them. This type reflects what a
// material object actually contains, verified against real entries (e.g. "Afterglow of
// Long Night Flint", a domain-drop weapon ascension material with all three fields set).
export interface MaterialInfo {
  id: number;
  name: string;
  dupealias?: string;
  rarity?: 1 | 2 | 3 | 4 | 5;
  sortRank: number;
  description: string;
  category: string;
  typeText?: string;
  dropDomainId?: number;
  dropDomainName?: string;
  daysOfWeek?: string[];
  sources: string[];
  images: { filename_icon: string };
  version: string;
}

// Same public icon CDN convention used across genshin-db consumers, keyed by the
// game's internal icon filename (verified: UI_ItemIcon_112138.png, UI_ItemIcon_105002.png,
// and character/weapon icon filenames all resolve here too).
export function materialIconUrl(filename: string): string {
  return `https://gi.yatta.moe/assets/UI/${filename}.png`;
}

let allMaterialsCache: MaterialInfo[] | undefined;

export function getAllMaterials(): MaterialInfo[] {
  if (allMaterialsCache) return allMaterialsCache;
  const names = genshindb.materials("names", { matchCategories: true }) ?? [];
  const seenIds = new Set<number>();
  const materials: MaterialInfo[] = [];
  for (const name of names) {
    const material = genshindb.materials(name) as unknown as MaterialInfo | undefined;
    // Some items (dupealias entries like "Cake for Traveler"/"Key Sigil", one per
    // character they're personalized for) repeat under the same id — keep one.
    if (material && !seenIds.has(material.id)) {
      seenIds.add(material.id);
      materials.push(material);
    }
  }
  allMaterialsCache = materials;
  return allMaterialsCache;
}

const UNCATEGORIZED_LABEL = "Uncategorized";

export function materialGroupLabel(material: MaterialInfo): string {
  return material.typeText?.trim() || UNCATEGORIZED_LABEL;
}

export interface MaterialGroup {
  label: string;
  materials: MaterialInfo[];
}

export function groupMaterialsByType(materials: MaterialInfo[]): MaterialGroup[] {
  const groups = new Map<string, MaterialInfo[]>();
  for (const material of materials) {
    const label = materialGroupLabel(material);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(material);
  }

  const sortedGroups = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [, list] of sortedGroups) {
    list.sort((a, b) => a.sortRank - b.sortRank || a.name.localeCompare(b.name));
  }
  return sortedGroups.map(([label, list]) => ({ label, materials: list }));
}
