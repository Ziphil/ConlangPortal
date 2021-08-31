//


export class Family {

  public id!: string;
  public codes!: FamilyCodes;
  public names!: FamilyNames;
  public name?: string;
  public homepageUrl?: string;
  public description?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

}


export type FamilyCodes = {family: string, user: string};
export type FamilyNames = {family?: string, user?: string};