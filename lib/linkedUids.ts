import type { EnkaApiResult } from "./enka";

export interface LinkedUidRecord {
  docId: string;
  genshinUid: string;
}

export type ProfileState =
  | { status: "loading" }
  | { status: "loaded"; result: EnkaApiResult }
  | { status: "error"; message: string };
