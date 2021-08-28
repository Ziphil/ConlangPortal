//


export class Dialect {

  public codes!: DialectCodes;
  public names!: DialectNames;
  public name?: string;
  public approved!: boolean;
  public createdDate!: string;

}


export type DialectCodes = {dialect: string, language: string, family: string, user: string};
export type DialectNames = {dialect?: string, language?: string, family?: string, user?: string};