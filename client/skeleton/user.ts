//


export class User {

  public id!: string;
  public codes!: UserCodes;
  public code!: string;
  public names!: UserNames;
  public name!: string;
  public homepageUrl?: string;
  public authority?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

}


export type UserCodes = {user: string};
export type UserNames = {user?: string};