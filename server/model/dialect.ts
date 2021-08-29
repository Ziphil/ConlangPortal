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

  @prop()
  public name?: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  @prop()
  public approvedDate?: Date;

  public async approve(this: Dialect): Promise<Dialect> {
    let userPromise = UserModel.fetchOneByCode(this.codes.user).then((user) => {
      if (user !== null && !user.approved) {
        user.approved = true;
        user.approvedDate = new Date();
        return user.save();
      } else {
        return null;
      }
    });
    let familyPromise = FamilyModel.fetchOneByCodes(this.codes).then((family) => {
      if (family !== null && !family.approved) {
        family.approved = true;
        family.approvedDate = new Date();
        return family.save();
      } else {
        return null;
      }
    });
    let languagePromise = LanguageModel.fetchOneByCodes(this.codes).then((language) => {
      if (language !== null && !language.approved) {
        language.approved = true;
        language.approvedDate = new Date();
        return language.save();
      } else {
        return null;
      }
    });
    let dialectPromise = (async () => {
      this.approved = true;
      this.approvedDate = new Date();
      await this.save();
    })();
    let [user, family, language] = await Promise.all([userPromise, familyPromise, languagePromise, dialectPromise]);
    return this;
  }

  public async changeInformations(this: Dialect, informations: any): Promise<Dialect> {
    let dialects = await DialectModel.fetchByCodesLoose(this.codes) as Array<any>;
    let promises = dialects.map(async (dialect) => {
      for (let [key, value] of Object.entries(informations)) {
        if (value !== undefined) {
          dialect[key] = value;
        }
      }
      await dialect.save();
    });
    await Promise.all(promises);
    return this;
  }

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

  public static async fetch(includeOptions?: {approved: boolean, unapproved: boolean}): Promise<Array<Dialect>> {
    let query = (() => {
      if (includeOptions !== undefined) {
        if (includeOptions.approved && includeOptions.unapproved) {
          return DialectModel.find();
        } else if (includeOptions.approved && !includeOptions.unapproved) {
          return DialectModel.find().where("approved", true);
        } else if (!includeOptions.approved && includeOptions.unapproved) {
          return DialectModel.find().where("approved", false);
        } else {
          return DialectModel.find().where("dummy", "dummy");
        }
      } else {
        return DialectModel.find();
      }
    })();
    query = query.sort("-approvedDate -createdDate");
    let dialects = await query;
    return dialects;
  }

  public static async fetchOneByCodes(codes: DialectCodes): Promise<Dialect | null> {
    let dialect = await DialectModel.findOne().where("codes.user", codes.user).where("codes.family", codes.family).where("codes.language", codes.language).where("codes.dialect", codes.dialect);
    return dialect;
  }

  public static async fetchByCodesLoose(codes: DialectCodes): Promise<Array<Dialect>> {
    let dialects = await DialectModel.find().or([
      DialectModel.find().where("codes.user", codes.user).where("codes.dialect", codes.dialect).getFilter(),
      DialectModel.find().where("codes.user", codes.family).where("codes.dialect", codes.dialect).getFilter(),
      DialectModel.find().where("codes.family", codes.user).where("codes.dialect", codes.dialect).getFilter(),
      DialectModel.find().where("codes.family", codes.family).where("codes.dialect", codes.dialect).getFilter()
    ]);
    return dialects;
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
    let name = raw.name;
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let approvedDate = raw.approvedDate?.toISOString();
    let skeleton = {id, codes, names, name, approved, createdDate, approvedDate};
    return skeleton;
  }

}


export type Dialect = DocumentType<DialectSchema>;
export let DialectModel = getModelForClass(DialectSchema);

export type DialectCodes = {dialect: string, language: string, family: string, user: string};
export type DialectNames = {dialect?: string, language?: string, family?: string, user?: string};