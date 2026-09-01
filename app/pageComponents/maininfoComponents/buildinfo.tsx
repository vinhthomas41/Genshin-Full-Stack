import genshindb from "genshin-db";
import Image from "next/image";
import type { CharacterBuildMatch } from "@/lib/enkaBuildMatch";
import { mapWeaponIdToWeapon, mapArtifactSetIdToArtifact } from "@/lib/enkaItemMap";
import {
  CORE_FIGHT_PROP_IDS,
  FIGHT_PROP_LABELS,
  formatFightProp,
  formatAppendProp,
  getElementalDmgBonusPropId,
} from "@/lib/enkaFightProp";
import type { EnkaEquip } from "@/lib/enka";

interface passedData {
  character: genshindb.Character;
  matches: CharacterBuildMatch[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

const ICON_BASE = "https://enka.network/ui/";

const SLOT_ORDER = ["EQUIP_BRACER", "EQUIP_NECKLACE", "EQUIP_SHOES", "EQUIP_RING", "EQUIP_DRESS"];
const SLOT_LABELS: { [equipType: string]: string } = {
  EQUIP_BRACER: "Flower",
  EQUIP_NECKLACE: "Feather",
  EQUIP_SHOES: "Sands",
  EQUIP_RING: "Goblet",
  EQUIP_DRESS: "Circlet",
};

const BuildInfo: React.FC<passedData> = ({ character, matches, selectedIndex, onSelectIndex }) => {
  if (matches.length === 0) return null;
  const selected = matches[Math.min(selectedIndex, matches.length - 1)];
  const { avatar } = selected;

  const level = avatar.propMap["4001"]?.ival ?? "?";
  const ascension = avatar.propMap["1002"]?.ival ?? "0";
  const constellationCount = avatar.talentIdList?.length ?? 0;

  const weaponEquip = avatar.equipList.find((equip) => equip.weapon);
  const weapon = weaponEquip ? mapWeaponIdToWeapon(weaponEquip.itemId) : undefined;
  const refinement = weaponEquip?.weapon?.affixMap ? Object.values(weaponEquip.weapon.affixMap)[0] : 0;

  const artifactsBySlot = new Map<string, EnkaEquip>();
  for (const equip of avatar.equipList) {
    if (equip.reliquary && equip.flat.equipType) artifactsBySlot.set(equip.flat.equipType, equip);
  }

  const elementalDmgId = getElementalDmgBonusPropId(character.elementType);
  const fightStatIds = elementalDmgId ? [...CORE_FIGHT_PROP_IDS, elementalDmgId] : CORE_FIGHT_PROP_IDS;

  return (
    <div className="border-4 border-glow mx-8 mt-8 panel-glow">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-glow px-4 py-2">
        <p className="text-glow text-xs uppercase tracking-widest">Build — {selected.nickname}</p>
        {matches.length > 1 && (
          <div className="flex gap-2">
            {matches.map((match, index) => (
              <button
                key={match.genshinUid}
                className={`px-2 py-1 text-xs uppercase tracking-widest transition-colors ${
                  index === selectedIndex ? "bg-glow text-black" : "hover:bg-glow hover:text-black"
                }`}
                onClick={() => onSelectIndex(index)}
              >
                {match.nickname}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-8 p-4">
        <ul className="w-44 divide-y divide-glow/20">
          <li className="flex justify-between py-2 text-sm">
            <span className="text-xs uppercase text-white/50">Level</span>
            {level}
          </li>
          <li className="flex justify-between py-2 text-sm">
            <span className="text-xs uppercase text-white/50">Ascension</span>
            {ascension}/6
          </li>
          <li className="flex justify-between py-2 text-sm">
            <span className="text-xs uppercase text-white/50">Constellations</span>
            {constellationCount}/6
          </li>
        </ul>

        <div className="w-52">
          <p className="mb-2 text-xs uppercase tracking-widest text-white/50">Weapon</p>
          {weaponEquip ? (
            <div className="flex items-center gap-2">
              <Image
                src={`${ICON_BASE}${weaponEquip.flat.icon}.png`}
                alt={weapon?.name ?? "Weapon"}
                width={40}
                height={40}
                unoptimized
              />
              <div>
                <p className="text-sm">{weapon?.name ?? "Unknown Weapon"}</p>
                <p className="text-xs text-white/50">
                  R{refinement + 1} · Lv {weaponEquip.weapon?.level ?? "?"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/50">No weapon data.</p>
          )}
        </div>

        <ul className="w-56 divide-y divide-glow/20">
          {fightStatIds.map((id) => {
            const value = avatar.fightPropMap[id];
            if (value === undefined) return null;
            return (
              <li key={id} className="flex justify-between py-1 text-xs">
                <span className="uppercase text-white/50">{FIGHT_PROP_LABELS[id] ?? id}</span>
                {formatFightProp(id, value)}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-glow/20 p-4">
        {SLOT_ORDER.map((slot) => {
          const equip = artifactsBySlot.get(slot);
          if (!equip) return null;
          const artifactSet = equip.flat.setId ? mapArtifactSetIdToArtifact(equip.flat.setId) : undefined;
          const mainstat = equip.flat.reliquaryMainstat;
          const mainstatFormatted = mainstat ? formatAppendProp(mainstat.mainPropId, mainstat.statValue) : undefined;
          return (
            <div key={slot} className="w-44 border border-glow/20 p-2">
              <div className="flex items-center gap-2">
                <Image src={`${ICON_BASE}${equip.flat.icon}.png`} alt={SLOT_LABELS[slot]} width={32} height={32} unoptimized />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">{SLOT_LABELS[slot]}</p>
                  <p className="text-xs text-white/70">{artifactSet?.name ?? "Unknown Set"}</p>
                </div>
              </div>
              {mainstatFormatted && (
                <p className="mt-2 text-sm">
                  {mainstatFormatted.label}: {mainstatFormatted.value}
                </p>
              )}
              <ul className="mt-1 text-xs text-white/50">
                {equip.flat.reliquarySubstats?.map((substat, i) => {
                  const formatted = formatAppendProp(substat.appendPropId, substat.statValue);
                  return (
                    <li key={i}>
                      {formatted.label}: {formatted.value}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuildInfo;
