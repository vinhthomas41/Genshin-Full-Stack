import React, { useState } from "react";
import genshindb from "genshin-db";
import Talentinfo from "./maininfoComponents/talentinfo";
import Constellationinfo from "./maininfoComponents/constellationinfo";
import BuildInfo from "./maininfoComponents/buildinfo";
import { findBuildMatches } from "@/lib/enkaBuildMatch";
import { getCombatTalentLevels } from "@/lib/enkaSkillSlots";
import type { LinkedUidRecord, ProfileState } from "@/lib/linkedUids";

interface passedData {
  character: genshindb.Character | null;
  linkedUids: LinkedUidRecord[];
  profiles: { [genshinUid: string]: ProfileState };
}

const Maininfo: React.FC<passedData> = ({ character, linkedUids, profiles }) => {
  const [currentLevel, setCurrentLevel] = useState<number | string>(100);
  const [selectedBuildIndex, setSelectedBuildIndex] = useState(0);

  // Reset the selected build tab when the character changes, without an Effect
  // (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [prevCharacterId, setPrevCharacterId] = useState(character?.id);
  if (character?.id !== prevCharacterId) {
    setPrevCharacterId(character?.id);
    setSelectedBuildIndex(0);
  }

  function changeLevel(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value == "") { setCurrentLevel(""); return; }
    const current = Number(value);
    if (current < 1) { setCurrentLevel(1); }
    else if (current > 100) { setCurrentLevel(100); }
    else { setCurrentLevel(current); }
  }

  const displayLevel = currentLevel === "" ? 1 : Number(currentLevel);

  const matches = character ? findBuildMatches(character, linkedUids, profiles) : [];
  const selectedMatch = matches[Math.min(selectedBuildIndex, matches.length - 1)];
  const talentLevelDefaults = selectedMatch
    ? getCombatTalentLevels(selectedMatch.avatar.avatarId, selectedMatch.avatar.skillDepotId, selectedMatch.avatar.skillLevelMap)
    : undefined;
  const unlockedConstellations = selectedMatch?.avatar.talentIdList?.length;

  return (
    <div className="max-w-screen overflow-y-auto font-mono [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" id="mainInfo">
      {!character ? (
        <h2 className="p-8 text-xs uppercase tracking-widest text-white/50">Choose a character.</h2>
      ) : (
        <>
          <div className="border-b-4 border-white mx-8 my-8 p-6">
            <h1 className="text-center text-sm italic text-white/70">{`"${character.description}"`}</h1>
          </div>
          <div id="boxes" className="flex flex-row items-start gap-8 px-8">
            <div className="border-4 border-white w-80">
              <div className="border-b-4 border-white px-4 py-2">
                <h1 className="text-xs uppercase tracking-widest">
                  Stats — Lvl{" "}
                  <input
                    className="bg-black w-12 border-b border-white text-center outline-none"
                    type="number"
                    value={currentLevel}
                    onChange={changeLevel}
                  />
                </h1>
              </div>
              <ul className="divide-y divide-white/20">
                <li className="flex justify-between px-4 py-2 text-sm"><span className="text-white/50 uppercase text-xs">HP</span>{character.stats(displayLevel, "+").hp}</li>
                <li className="flex justify-between px-4 py-2 text-sm"><span className="text-white/50 uppercase text-xs">ATK</span>{character.stats(displayLevel, "+").attack}</li>
                <li className="flex justify-between px-4 py-2 text-sm"><span className="text-white/50 uppercase text-xs">DEF</span>{character.stats(displayLevel, "+").defense}</li>
                <li className="flex justify-between px-4 py-2 text-sm"><span className="text-white/50 uppercase text-xs">{character.substatText}</span>{character.stats(displayLevel, "+").specialized}</li>
              </ul>
            </div>
            <Talentinfo
              key={`talent-${character.name}-${selectedMatch ? "build" : "nobuild"}`}
              character={character}
              talentLevelDefaults={talentLevelDefaults}
            />
            <Constellationinfo key={`constellation-${character.name}`} character={character} unlockedCount={unlockedConstellations} />
          </div>
          {matches.length > 0 && (
            <BuildInfo
              key={`build-${character.name}`}
              character={character}
              matches={matches}
              selectedIndex={selectedBuildIndex}
              onSelectIndex={setSelectedBuildIndex}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Maininfo;
