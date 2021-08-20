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
  User
} from "/client/skeleton/user";


export type Entry = Dialect | Language | Family | User;
export type EntryCodes = DialectCodes | LanguageCodes | FamilyCodes | {user: string};