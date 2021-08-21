//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Language as LanguageSkeleton
} from "/client/skeleton/language";
import {
  DialectModel
} from "/server/model/dialect";
import {
  FamilyModel
} from "/server/model/family";
import {
  UserModel
} from "/server/model/user";


@modelOptions({schemaOptions: {collection: "languages"}})
export class LanguageSchema {

  @prop({required: true})
  public codes!: LanguageCodes;

  @prop({required: true})
  public name!: string;

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
    let language = await LanguageModel.findOne().where("codes.user", codes.user).where("codes.family", codes.family).where("codes.language", codes.language);
    return language;
  }

  public static async checkDuplication(codes: LanguageCodes): Promise<boolean> {
    let dialect = await DialectModel.findOne().or([
      DialectModel.find().where("codes.user", codes.user).where("codes.language", codes.language).getFilter(),
      DialectModel.find().where("codes.user", codes.family).where("codes.language", codes.language).getFilter(),
      DialectModel.find().where("codes.family", codes.user).where("codes.language", codes.language).getFilter(),
      DialectModel.find().where("codes.family", codes.family).where("codes.language", codes.language).getFilter(),
      DialectModel.find().where("codes.user", codes.user).where("codes.dialect", codes.language).getFilter(),
      DialectModel.find().where("codes.user", codes.family).where("codes.dialect", codes.language).getFilter(),
      DialectModel.find().where("codes.family", codes.user).where("codes.dialect", codes.language).getFilter(),
      DialectModel.find().where("codes.family", codes.family).where("codes.dialect", codes.language).getFilter()
    ]);
    let duplicate = dialect !== null;
    return duplicate;
  }

}


export class LanguageCreator {

  public static async create(raw: Language): Promise<LanguageSkeleton> {
    let id = raw.id;
    let codes = raw.codes;
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let userNamePromise = UserModel.fetchOneByCode(codes.user).then((user) => user?.name);
    let familyNamePromise = FamilyModel.findOneByCode(codes).then((family) => family?.name);
    let [userName, familyName] = await Promise.all([userNamePromise, familyNamePromise]);
    let languageName = raw.name;
    let names = {language: languageName, family: familyName, user: userName};
    let skeleton = {id, codes, names, approved, createdDate};
    return skeleton;
  }

}


export type Language = DocumentType<LanguageSchema>;
export let LanguageModel = getModelForClass(LanguageSchema);

export type LanguageCodes = {language: string, family: string, user: string};