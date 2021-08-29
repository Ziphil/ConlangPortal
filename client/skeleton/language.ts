//


export class Language {

  public id!: string;
  public codes!: LanguageCodes;
  public names!: LanguageNames;
  public name?: string;
  public homepageUrl?: string;
  public dictionaryUrl?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

}


export type LanguageCodes = {language: string, family: string, user: string};
export type LanguageNames = {language?: string, family?: string, user?: string};