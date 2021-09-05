//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class Family extends SuperEntry {

  public id!: string;
  public kind!: "family";
  public codes!: FamilyCodes;
  public names!: FamilyNames;
  public name?: string;
  public homepageUrl?: string;
  public description?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

  public static create(raw: Jsonify<Family>): Family {
    return Object.assign(Object.create(Family.prototype), raw);
  }

}


export type FamilyCodes = {family: string, user: string};
export type FamilyNames = {family?: string, user?: string};