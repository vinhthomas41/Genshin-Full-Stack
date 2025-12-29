"use client";
import { useEffect, useState } from 'react';
import Sidebar from './pageComponents/sidebar'
import Maininfo from './pageComponents/maininfo'
import genshindb from 'genshin-db';
import { collection, addDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const charNames = genshindb.characters('names', {matchCategories: true});
const charArray: genshindb.Character[] = []; 

for(const char of charNames) {
  charArray.push(genshindb.characters(char)!);
}

export default function Home() {
  const [currentChar, setCurrentChar] = useState<
  typeof charArray[number] | null
  >(null);
  const[favoriteList, setFavoriteList] = useState<
  string[] > ([]);

  const childCharacterChange = (newChar: genshindb.Character) => {
    setCurrentChar(newChar);
  };

  async function addFavorite(characterName: string) {
  console.log("Added");
  await addDoc(collection(db, "favorites"), {
    charId: characterName,
  });
  }

async function removeFavorite(characterName: string) {
  console.log("remove");
  const q = query(
    collection(db, "favorites"),
    where("charId", "==", characterName)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
  }

  useEffect(() => {
  async function loadFavorites() {
    const snapshot = await getDocs(collection(db, "favorites"));
    const ids = snapshot.docs.map((doc) => doc.data().charId);
    console.log(ids);
    setFavoriteList(ids);
  }

  loadFavorites();
  }, []);


  const favoriteEdit = (char: genshindb.Character) => {
      const newArray = [];
      const contained = favoriteList!.includes(char.name);
      if(contained) {
          let indexToRemove = favoriteList!.indexOf(char.name);
          for(let i: number = 0; i < favoriteList!.length; i++) {
            if(i != indexToRemove) {
              newArray.push(favoriteList![i]);
            }
          }
      } else {
          for(let i: number = 0; i < favoriteList!.length; i++) {
            newArray.push(favoriteList![i]);
          }
          newArray.push(char.name);
      }
      setFavoriteList(newArray);
      if(contained) {
        removeFavorite(char.name);
      } else {
        addFavorite(char.name);
      }
  }

  return (
    <div className = "flex h-screen">
      <Sidebar 
        charList={charArray} 
        sendData = {childCharacterChange} 
        favorites = {favoriteList}
        favoriteClick= {favoriteEdit}
      />
      <Maininfo character = {currentChar} />
    </div>
    
  );
}


