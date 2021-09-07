//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class Language extends SuperEntry<"language", LanguageCodes, LanguageNames> {

  public homepageUrl?: string;
  public dictionaryUrl?: string;
  public description?: string;

  public static create(raw: Jsonify<Language>): Language {
    return Object.assign(Object.create(Language.prototype), raw);
  }

}


export type LanguageCodes = {language: string, family: string, creator: string};
export type LanguageNames = {language?: string, family?: string, creator?: string};