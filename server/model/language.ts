//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {collection: "languages"}})
export class LanguageSchema {

  @prop({required: true})
  public codes!: LanguageCodes;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  public static async add(rawCodes: LanguageCodes, name: string): Promise<Language> {
    let codes = {language: rawCodes.language, family: rawCodes.family, user: rawCodes.user};
    let createdDate = new Date();
    let approved = false;
    let language = new LanguageModel({codes, name, approved, createdDate});
    await language.save();
    return language;
  }

  public static async findOneByCode(codes: LanguageCodes): Promise<Language | null> {
    let family = await LanguageModel.findOne().where("code.user", codes.user).where("code.family", codes.family).where("code.language", codes.language);
    return family;
  }

}


export type Language = DocumentType<LanguageSchema>;
export let LanguageModel = getModelForClass(LanguageSchema);

export type LanguageCodes = {language: string, family: string, user: string};