"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { groupMaterialsByType, materialIconUrl, type MaterialInfo } from "@/lib/materialInfo";

interface passedData {
  materials: MaterialInfo[];
  selected: MaterialInfo | null;
  onSelect: (material: MaterialInfo) => void;
}

const MaterialSidebar: React.FC<passedData> = ({ materials, selected, onSelect }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return materials;
    return materials.filter((material) => material.name.toLowerCase().includes(query));
  }, [materials, search]);

  const groups = useMemo(() => groupMaterialsByType(filtered), [filtered]);

  return (
    <div className="h-full w-72 overflow-y-auto border-r-4 border-glow font-mono flex-shrink-0 panel-glow [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-glow" id="materialSidebar">
      <div className="sticky top-0 z-10 border-b-4 border-glow bg-black p-3">
        <input
          className="w-full border-b border-glow bg-black px-2 py-1 text-sm outline-none"
          type="text"
          placeholder="Search materials…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="mt-1 text-xs text-white/40">{filtered.length} / {materials.length} materials</p>
      </div>
      {groups.map((group) => (
        <div key={group.label}>
          <div className="border-b border-glow/40 bg-blueTest2 px-3 py-1.5 text-xs uppercase tracking-widest text-glow">
            {group.label} <span className="text-white/40">({group.materials.length})</span>
          </div>
          <ul className="divide-y divide-glow/10">
            {group.materials.map((material) => (
              <li
                key={material.id}
                className={`flex cursor-pointer items-center gap-2 p-2 px-3 text-sm uppercase tracking-wide transition-colors hover:bg-glow hover:text-black ${
                  selected?.id === material.id ? "bg-glow text-black" : ""
                }`}
                onClick={() => onSelect(material)}
              >
                <Image
                  src={materialIconUrl(material.images.filename_icon)}
                  alt={material.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 flex-shrink-0"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <span className="truncate">{material.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MaterialSidebar;
