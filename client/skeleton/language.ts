//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class Language extends SuperEntry {

  public id!: string;
  public kind!: "language";
  public codes!: LanguageCodes;
  public names!: LanguageNames;
  public name?: string;
  public homepageUrl?: string;
  public dictionaryUrl?: string;
  public description?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

  public static create(raw: Jsonify<Language>): Language {
    return Object.assign(Object.create(Language.prototype), raw);
  }

}


export type LanguageCodes = {language: string, family: string, user: string};
export type LanguageNames = {language?: string, family?: string, user?: string};