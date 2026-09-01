"use client";
import { useEffect, useState } from "react";
import Sidebar from "../pageComponents/sidebar";
import Maininfo from "../pageComponents/maininfo";
import SiteNav from "../pageComponents/siteNav";
import genshindb from "genshin-db";
import "../globals.css";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { fetchEnkaProfile } from "@/lib/enka";
import type { LinkedUidRecord, ProfileState } from "@/lib/linkedUids";

const auth = getAuth();

const charNames = genshindb.characters("names", { matchCategories: true });
const charArray: genshindb.Character[] = [];

for (const char of charNames) {
  charArray.push(genshindb.characters(char)!);
}
export default function Home() {
  const [currentChar, setCurrentChar] = useState<
    (typeof charArray)[number] | null
  >(null);
  const [favoriteList, setFavoriteList] = useState<string[]>([]);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [linkedUids, setLinkedUids] = useState<LinkedUidRecord[]>([]);
  const [profiles, setProfiles] = useState<{
    [genshinUid: string]: ProfileState;
  }>({});

  useEffect(() => {
    signInAnonymously(auth).catch((error) =>
      console.error("Anonymous sign-in failed:", error),
    );
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const childCharacterChange = (newChar: genshindb.Character) => {
    setCurrentChar(newChar);
  };

  async function addFavorite(characterName: string) {
    console.log("Added");
    await addDoc(collection(db, "favorites"), {
      charId: characterName,
      uid: auth.currentUser!.uid,
    });
  }

  async function removeFavorite(characterName: string) {
    console.log("remove");
    const q = query(
      collection(db, "favorites"),
      where("charId", "==", characterName),
      where("uid", "==", auth.currentUser!.uid),
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  useEffect(() => {
    async function loadFavorites() {
      const q = query(collection(db, "favorites"), where("uid", "==", userUid));
      const snapshot = await getDocs(q);
      const ids = snapshot.docs.map((doc) => doc.data().charId as string);
      setFavoriteList(ids);
    }
    loadFavorites();
  }, [userUid]);

  const favoriteEdit = (char: genshindb.Character) => {
    const newArray = [];
    const contained = favoriteList!.includes(char.name);
    if (contained) {
      const indexToRemove = favoriteList!.indexOf(char.name);
      for (let i: number = 0; i < favoriteList!.length; i++) {
        if (i != indexToRemove) {
          newArray.push(favoriteList![i]);
        }
      }
    } else {
      for (let i: number = 0; i < favoriteList!.length; i++) {
        newArray.push(favoriteList![i]);
      }
      newArray.push(char.name);
    }
    setFavoriteList(newArray);
    if (contained) {
      removeFavorite(char.name);
    } else {
      addFavorite(char.name);
    }
  };

  useEffect(() => {
    if (!userUid) {
      setLinkedUids([]);
      return;
    }
    async function loadLinkedUids() {
      const q = query(
        collection(db, "linkedUids"),
        where("uid", "==", userUid),
      );
      const snapshot = await getDocs(q);
      setLinkedUids(
        snapshot.docs.map((d) => ({
          docId: d.id,
          genshinUid: d.data().genshinUid as string,
        })),
      );
    }
    loadLinkedUids();
  }, [userUid]);

  async function loadProfile(genshinUid: string) {
    setProfiles((prev) => ({ ...prev, [genshinUid]: { status: "loading" } }));
    try {
      const result = await fetchEnkaProfile(genshinUid);
      setProfiles((prev) => ({
        ...prev,
        [genshinUid]: { status: "loaded", result },
      }));
    } catch {
      setProfiles((prev) => ({
        ...prev,
        [genshinUid]: {
          status: "error",
          message: "Couldn't reach the server.",
        },
      }));
    }
  }

  useEffect(() => {
    for (const { genshinUid } of linkedUids) {
      if (!profiles[genshinUid]) loadProfile(genshinUid);
    }
    // profiles is intentionally excluded — this only fetches UIDs that don't have an entry yet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedUids]);

  async function linkUid(genshinUid: string) {
    if (!userUid) return;
    const docRef = await addDoc(collection(db, "linkedUids"), {
      uid: userUid,
      genshinUid,
      addedAt: serverTimestamp(),
    });
    setLinkedUids((prev) => [...prev, { docId: docRef.id, genshinUid }]);
  }

  async function unlinkUid(record: LinkedUidRecord) {
    await deleteDoc(doc(db, "linkedUids", record.docId));
    setLinkedUids((prev) => prev.filter((l) => l.docId !== record.docId));
    setProfiles((prev) => {
      const next = { ...prev };
      delete next[record.genshinUid];
      return next;
    });
  }

  return (
    <div className="archive-database-shell archive-brutalist-type text-textColor1 relative flex h-screen flex-col overflow-hidden">
      <SiteNav />
      <div className="archive-database-body relative z-10 flex min-h-0 flex-1">
        <Sidebar
          charList={charArray}
          sendData={childCharacterChange}
          favorites={favoriteList}
          favoriteClick={favoriteEdit}
          userUid={userUid}
          linkedUids={linkedUids}
          profiles={profiles}
          onLinkUid={linkUid}
          onUnlinkUid={unlinkUid}
          onRefreshUid={loadProfile}
        />
        <Maininfo
          character={currentChar}
          linkedUids={linkedUids}
          profiles={profiles}
        />
      </div>
    </div>
  );
}
