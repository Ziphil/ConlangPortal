//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class Creator extends SuperEntry<"creator", CreatorCodes, CreatorNames> {

  public code!: string;
  public homepageUrl?: string;
  public twitterId?: string;
  public biography?: string;
  public authority?: string;

  public static create(raw: Jsonify<Creator>): Creator {
    return Object.assign(Object.create(Creator.prototype), raw);
  }

}


export type CreatorCodes = {user: string};
export type CreatorNames = {user?: string};