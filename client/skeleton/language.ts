//


export class Language {

  public codes!: LanguageCodes;
  public names!: LanguageNames;
  public approved!: boolean;
  public createdDate!: string;

}


export type LanguageCodes = {language: string, family: string, user: string};
export type LanguageNames = {language?: string, family?: string, user?: string};