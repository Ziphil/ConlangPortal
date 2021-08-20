//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  DialectModel
} from "/server/model/dialect";
import {
  LanguageModel
} from "/server/model/language";


@modelOptions({schemaOptions: {collection: "families"}})
export class FamilySchema {

  @prop({required: true})
  public codes!: {family: string, user: string};

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  public static async add(rawCodes: {family: string, user: string}, name: string): Promise<Family> {
    let codes = {family: rawCodes.family, user: rawCodes.user};
    let createdDate = new Date();
    let approved = false;
    let family = new FamilyModel({codes, name, approved, createdDate});
    await family.save();
    return family;
  }

  public static async findOneByCode(codes: {family: string, user: string}): Promise<Family | null> {
    let family = await FamilyModel.findOne().where("code.user", codes.user).where("code.family", codes.family);
    return family;
  }

}


export class EntryUtil {

  public static async create(codes: any, names: any): Promise<any> {
    console.log(codes);
    console.log(names);
    let familyPromise = (async () => {
      let family = await FamilyModel.findOneByCode(codes);
      if (family === null) {
        family = await FamilyModel.add(codes, names.family);
      }
      return family;
    })();
    let languagePromise = (async () => {
      let language = await LanguageModel.findOneByCode(codes);
      if (language === null) {
        language = await LanguageModel.add(codes, names.language);
      }
      return language;
    })();
    let dialectPromise = (async () => {
      let dialect = await DialectModel.add(codes, names.dialect);
      return dialect;
    })();
    let [family, language, dialect] = await Promise.all([familyPromise, languagePromise, dialectPromise]);
    return {family, language, dialect};
  }

}


export type Family = DocumentType<FamilySchema>;
export let FamilyModel = getModelForClass(FamilySchema);