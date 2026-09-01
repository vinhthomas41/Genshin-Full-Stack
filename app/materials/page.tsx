"use client";
import { useState } from "react";
import MaterialSidebar from "../pageComponents/materialSidebar";
import MaterialDetail from "../pageComponents/materialDetail";
import SiteNav from "../pageComponents/siteNav";
import { getAllMaterials, type MaterialInfo } from "@/lib/materialInfo";
import "../globals.css";

const materialArray = getAllMaterials();

export default function MaterialsPage() {
  const [currentMaterial, setCurrentMaterial] = useState<MaterialInfo | null>(
    null,
  );

  return (
    <div className="archive-database-shell archive-brutalist-type text-textColor1 relative flex h-screen flex-col overflow-hidden">
      <SiteNav />
      <div className="archive-database-body relative z-10 flex min-h-0 flex-1">
        <MaterialSidebar
          materials={materialArray}
          selected={currentMaterial}
          onSelect={setCurrentMaterial}
        />
        <MaterialDetail material={currentMaterial} />
      </div>
    </div>
  );
}
