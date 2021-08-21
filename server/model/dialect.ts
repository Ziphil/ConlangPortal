//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Dialect as DialectSkeleton
} from "/client/skeleton/dialect";
import {
  FamilyModel
} from "/server/model/family";
import {
  LanguageModel
} from "/server/model/language";
import {
  UserModel
} from "/server/model/user";


@modelOptions({schemaOptions: {collection: "dialects"}})
export class DialectSchema {

  @prop({required: true})
  public codes!: DialectCodes;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  public async fetchNames(): Promise<DialectNames> {
    let userNamePromise = UserModel.fetchOneByCode(this.codes.user).then((user) => user?.name);
    let familyNamePromise = FamilyModel.fetchOneByCodes(this.codes).then((family) => family?.name);
    let languageNamePromise = LanguageModel.fetchOneByCodes(this.codes).then((language) => language?.name);
    let [userName, familyName, languageName] = await Promise.all([userNamePromise, familyNamePromise, languageNamePromise]);
    let dialectName = this.name;
    let names = {dialect: dialectName, language: languageName, family: familyName, user: userName};
    return names;
  }

  public static async add(rawCodes: DialectCodes, name: string): Promise<Dialect> {
    let codes = {dialect: rawCodes.dialect, language: rawCodes.language, family: rawCodes.family, user: rawCodes.user};
    let createdDate = new Date();
    let approved = false;
    let dialect = new DialectModel({codes, name, approved, createdDate});
    await dialect.save();
    return dialect;
  }

  public static async fetchOneByCodes(codes: DialectCodes): Promise<Dialect | null> {
    let dialect = await DialectModel.findOne().where("codes.user", codes.user).where("codes.family", codes.family).where("codes.language", codes.language).where("codes.dialect", codes.dialect);
    return dialect;
  }

  public static async checkDuplication(codes: DialectCodes): Promise<boolean> {
    if (codes.dialect !== "~") {
      let dialect = await DialectModel.findOne().or([
        DialectModel.find().where("codes.user", codes.user).where("codes.language", codes.dialect).getFilter(),
        DialectModel.find().where("codes.user", codes.family).where("codes.language", codes.dialect).getFilter(),
        DialectModel.find().where("codes.family", codes.user).where("codes.language", codes.dialect).getFilter(),
        DialectModel.find().where("codes.family", codes.family).where("codes.language", codes.dialect).getFilter(),
        DialectModel.find().where("codes.user", codes.user).where("codes.dialect", codes.dialect).getFilter(),
        DialectModel.find().where("codes.user", codes.family).where("codes.dialect", codes.dialect).getFilter(),
        DialectModel.find().where("codes.family", codes.user).where("codes.dialect", codes.dialect).getFilter(),
        DialectModel.find().where("codes.family", codes.family).where("codes.dialect", codes.dialect).getFilter()
      ]);
      let duplicate = dialect !== null;
      return duplicate;
    } else {
      return false;
    }
  }

}


export class DialectCreator {

  public static async create(raw: Dialect): Promise<DialectSkeleton> {
    let id = raw.id;
    let codes = raw.codes;
    let names = await raw.fetchNames();
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let skeleton = {id, codes, names, approved, createdDate};
    return skeleton;
  }

}


export type Dialect = DocumentType<DialectSchema>;
export let DialectModel = getModelForClass(DialectSchema);

export type DialectCodes = {dialect: string, language: string, family: string, user: string};
export type DialectNames = {dialect: string, language?: string, family?: string, user?: string};