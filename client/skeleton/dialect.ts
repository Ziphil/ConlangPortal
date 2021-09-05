//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class Dialect extends SuperEntry {

  public id!: string;
  public kind!: "dialect";
  public codes!: DialectCodes;
  public names!: DialectNames;
  public name?: string;
  public homepageUrl?: string;
  public dictionaryUrl?: string;
  public description?: string;
  public evidence?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

  public static create(raw: Jsonify<Dialect>): Dialect {
    return Object.assign(Object.create(Dialect.prototype), raw);
  }

}


export type DialectCodes = {dialect: string, language: string, family: string, user: string};
export type DialectNames = {dialect?: string, language?: string, family?: string, user?: string};