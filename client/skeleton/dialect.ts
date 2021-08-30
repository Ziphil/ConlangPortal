//


export class Dialect {

  public id!: string;
  public codes!: DialectCodes;
  public names!: DialectNames;
  public name?: string;
  public homepageUrl?: string;
  public dictionaryUrl?: string;
  public evidence?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

}


export type DialectCodes = {dialect: string, language: string, family: string, user: string};
export type DialectNames = {dialect?: string, language?: string, family?: string, user?: string};