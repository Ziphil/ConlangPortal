//

import {
  Jsonify
} from "jsonify-type";
import {
  SuperEntry
} from "/client/skeleton/super-entry";


export class User extends SuperEntry {

  public id!: string;
  public kind!: "user";
  public codes!: UserCodes;
  public code!: string;
  public names!: UserNames;
  public name!: string;
  public homepageUrl?: string;
  public twitterId?: string;
  public biography?: string;
  public authority?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

  public static create(raw: Jsonify<User>): User {
    return Object.assign(Object.create(User.prototype), raw);
  }

}


export type UserCodes = {user: string};
export type UserNames = {user?: string};