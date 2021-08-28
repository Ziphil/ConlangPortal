//


export class User {

  public id!: string;
  public codes!: UserCodes;
  public code!: string;
  public names!: UserNames;
  public name!: string;

}


export type UserCodes = {user: string};
export type UserNames = {user?: string};