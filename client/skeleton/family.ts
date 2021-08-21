//


export class Family {

  public codes!: FamilyCodes;
  public names!: FamilyNames;
  public approved!: boolean;
  public createdDate!: string;

}


export type FamilyCodes = {family: string, user: string};
export type FamilyNames = {family?: string, user?: string};