"use client";
import Image from "next/image";
import { useState } from 'react';
import Sidebar from './pageComponents/sidebar'
import Maininfo from './pageComponents/maininfo'
import genshindb from 'genshin-db';

const charNames = genshindb.characters('names', {matchCategories: true});
const charArray: genshindb.Character[] = [];
for(const char of charNames) {
  charArray.push(genshindb.characters(char)!);
}

export default function Home() {
  const [currentChar, setCurrentChar] = useState<
  typeof charArray[number] | null
  >(null);
  const childCharacterChange = (newChar: genshindb.Character) => {
    setCurrentChar(newChar);
  };

  return (
    <div className = "flex h-screen">
      <Sidebar charList={charArray} sendData = {childCharacterChange}/>
      <Maininfo character = {currentChar} />
    </div>
    
  );
}
