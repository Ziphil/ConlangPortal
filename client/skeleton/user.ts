//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class User extends SuperEntry<"user", UserCodes, UserNames> {

  public code!: string;
  public homepageUrl?: string;
  public twitterId?: string;
  public biography?: string;
  public authority?: string;

  public static create(raw: Jsonify<User>): User {
    return Object.assign(Object.create(User.prototype), raw);
  }

}


export type UserCodes = {user: string};
export type UserNames = {user?: string};