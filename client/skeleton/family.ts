//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class Family extends SuperEntry<"family", FamilyCodes, FamilyNames> {

  public homepageUrl?: string;
  public description?: string;

  public static create(raw: Jsonify<Family>): Family {
    return Object.assign(Object.create(Family.prototype), raw);
  }

}


export type FamilyCodes = {family: string, user: string};
export type FamilyNames = {family?: string, user?: string};