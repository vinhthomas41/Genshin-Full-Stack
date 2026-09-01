import genshindb, { constellations, ConstellationDetail } from "genshin-db";
import { useState } from "react";

interface passedData {
  character: genshindb.Character | null;
  unlockedCount?: number;
}

const Constellationinfo: React.FC<passedData> = ({ character, unlockedCount }) => {
  const charConstellations = constellations(character!.name);
  const constellationList: ConstellationDetail[] | undefined = charConstellations
    ? [charConstellations.c1, charConstellations.c2, charConstellations.c3, charConstellations.c4, charConstellations.c5, charConstellations.c6]
    : undefined;

  const [openConstellations, changeConstellations] = useState<string[]>([]);

  const constellationEdit = (name: string) => {
    const newArray = [];
    const contained = openConstellations.includes(name);
    if (contained) {
      const indexToRemove = openConstellations.indexOf(name);
      for (let i = 0; i < openConstellations.length; i++) {
        if (i != indexToRemove) newArray.push(openConstellations[i]);
      }
    } else {
      for (let i = 0; i < openConstellations.length; i++) newArray.push(openConstellations[i]);
      newArray.push(name);
    }
    changeConstellations(newArray);
  };

  function formatText(text: string) {
    return text.split("**").map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  }

  return (
    <div>
      {charConstellations ? (
        <div className="border-4 border-glow w-80 panel-glow">
          <div className="border-b-4 border-glow px-4 py-2">
            <p className="text-glow text-xs uppercase tracking-widest">Constellations</p>
          </div>
          <ul className="divide-y divide-glow/20">
            {constellationList!.map((constellation, index) => {
              const unlocked = unlockedCount !== undefined && index < unlockedCount;
              const locked = unlockedCount !== undefined && !unlocked;
              return (
              <li key={index}>
                <div
                  onClick={() => constellationEdit(constellation.name)}
                  className={`flex flex-row px-4 py-2 text-sm uppercase tracking-wide hover:bg-glow hover:text-black transition-colors cursor-pointer ${locked ? "text-white/30" : ""}`}
                >
                  {`C${index + 1} — ${constellation.name}`}
                  {unlocked && <span className="ml-2 text-xs text-glow">(Unlocked)</span>}
                  {locked && <span className="ml-2 text-xs text-white/30">(Locked)</span>}
                  <span className="ml-auto">{openConstellations.includes(constellation.name) ? "▲" : "▼"}</span>
                </div>
                {openConstellations.includes(constellation.name) && (
                  <div className="border-t border-glow/20 px-4 py-2">
                    <p className="text-xs text-white/70">{formatText(constellation.description)}</p>
                  </div>
                )}
              </li>
              );
            })}
          </ul>
        </div>
      ) : <></>}
    </div>
  );
};

export default Constellationinfo;
