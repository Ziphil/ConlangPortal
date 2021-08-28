//

import {
  Dialect,
  DialectCodes
} from "/client/skeleton/dialect";
import {
  Family,
  FamilyCodes
} from "/client/skeleton/family";
import {
  Language,
  LanguageCodes
} from "/client/skeleton/language";
import {
  User,
  UserCodes
} from "/client/skeleton/user";


export class EntryUtil {

  public static is<K extends EntryKind>(entry: Entry, kind: K): entry is Entries[K] {
    let codes = entry.codes;
    if (kind === "dialect") {
      return "dialect" in codes;
    } else if (kind === "language") {
      return !("dialect" in codes) && "language" in codes;
    } else if (kind === "family") {
      return !("dialect" in codes) && !("language" in codes) && "family" in codes;
    } else {
      return !("dialect" in codes) && !("language" in codes) && !("family" in codes) && "user" in codes;
    }
  }

}


export type Entry = Dialect | Language | Family | User;
export type EntryCodes = DialectCodes | LanguageCodes | FamilyCodes | UserCodes;

export const ENTRY_KINDS = ["dialect", "language", "family", "user"] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

export type Entries = {
  dialect: Dialect,
  language: Language,
  family: Family,
  user: User
};