//

import {
  Jsonify
} from "jsonify-type";
import {
  Creator,
  CreatorCodes
} from "/client/skeleton/creator";
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


export class EntryStatic {

  public static create(raw: Jsonify<Entry>): Entry {
    if (raw.kind === "dialect") {
      return Object.assign(Object.create(Dialect.prototype), raw);
    } else if (raw.kind === "language") {
      return Object.assign(Object.create(Language.prototype), raw);
    } else if (raw.kind === "family") {
      return Object.assign(Object.create(Family.prototype), raw);
    } else {
      return Object.assign(Object.create(Creator.prototype), raw);
    }
  }

}


export type Entry = Dialect | Language | Family | Creator;
export type EntryCodes = DialectCodes | LanguageCodes | FamilyCodes | CreatorCodes;
export type EntryKind = Entry["kind"];