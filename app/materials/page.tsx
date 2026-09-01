"use client";
import { useState } from "react";
import MaterialSidebar from "../pageComponents/materialSidebar";
import MaterialDetail from "../pageComponents/materialDetail";
import SiteNav from "../pageComponents/siteNav";
import SiteBackground from "../pageComponents/siteBackground";
import { getAllMaterials, type MaterialInfo } from "@/lib/materialInfo";
import "../globals.css";

const materialArray = getAllMaterials();

export default function MaterialsPage() {
  const [currentMaterial, setCurrentMaterial] = useState<MaterialInfo | null>(null);

  return (
    <div className="bg-blueTest text-textColor1 flex h-screen flex-col relative overflow-hidden">
      <SiteBackground />
      <SiteNav />
      <div className="relative z-10 flex flex-1 min-h-0">
        <MaterialSidebar materials={materialArray} selected={currentMaterial} onSelect={setCurrentMaterial} />
        <MaterialDetail material={currentMaterial} />
      </div>
    </div>
  );
}
