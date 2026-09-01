import Image from "next/image";
import type { MaterialInfo } from "@/lib/materialInfo";
import { materialIconUrl } from "@/lib/materialInfo";

interface passedData {
  material: MaterialInfo | null;
}

const MaterialDetail: React.FC<passedData> = ({ material }) => {
  if (!material) {
    return (
      <div className="max-w-screen overflow-y-auto font-mono [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" id="materialDetail">
        <h2 className="p-8 text-xs uppercase tracking-widest text-white/50">Choose a material.</h2>
      </div>
    );
  }

  const placeholder = "Placeholder - Craftable Amount: {0}";
  const sources = material.sources.filter((source) => source !== placeholder);

  return (
    <div className="max-w-screen overflow-y-auto font-mono [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" id="materialDetail">
      <div className="border-4 border-glow mx-8 my-8 panel-glow">
        <div className="flex items-center gap-4 border-b-4 border-glow p-6">
          <Image
            src={materialIconUrl(material.images.filename_icon)}
            alt={material.name}
            width={64}
            height={64}
            className="w-16 h-16 flex-shrink-0"
            unoptimized
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <div>
            <h1 className="text-glow text-2xl font-black uppercase tracking-wide">{material.name}</h1>
            {material.rarity && (
              <p className="text-glow text-sm">{"★".repeat(material.rarity)}</p>
            )}
            <p className="text-xs uppercase tracking-widest text-white/50">
              {material.typeText ?? material.category}
            </p>
          </div>
        </div>

        <div className="p-6">
          <p className="whitespace-pre-line text-sm text-white/80">{material.description}</p>

          {material.dropDomainName && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-white/50">Domain</p>
              <p className="mt-1 text-sm">{material.dropDomainName}</p>
              {material.daysOfWeek && material.daysOfWeek.length > 0 && (
                <p className="mt-1 text-xs text-glow">Available: {material.daysOfWeek.join(", ")}</p>
              )}
            </div>
          )}

          {sources.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-white/50">Sources</p>
              <ul className="mt-1 list-inside list-disc text-sm text-white/70">
                {sources.map((source, i) => (
                  <li key={i}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
