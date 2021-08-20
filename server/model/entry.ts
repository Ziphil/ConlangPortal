//

import {
  getClassForDocument
} from "@typegoose/typegoose";
import {
  Entry as EntrySkeleton
} from "/client/skeleton/entry";
import {
  Dialect,
  DialectCodes,
  DialectCreator,
  DialectModel,
  DialectSchema
} from "/server/model/dialect";
import {
  Family,
  FamilyCodes,
  FamilyCreator,
  FamilyModel,
  FamilySchema
} from "/server/model/family";
import {
  Language,
  LanguageCodes,
  LanguageCreator,
  LanguageModel,
  LanguageSchema
} from "/server/model/language";
import {
  User,
  UserCreator,
  UserModel
} from "/server/model/user";


export class EntryUtil {

  public static async create(codes: DialectCodes, names: DialectNames): Promise<any> {
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

  public static async fetchOneByCodes(codes: EntryCodes): Promise<Entry | null> {
    if ("dialect" in codes) {
      return await DialectModel.findOneByCode(codes);
    } else if ("language" in codes) {
      return await LanguageModel.findOneByCode(codes);
    } else if ("family" in codes) {
      return await FamilyModel.findOneByCode(codes);
    } else {
      return await UserModel.fetchOneByCode(codes.user);
    }
  }

}


export class EntryCreator {

  public static async create(raw: Entry): Promise<EntrySkeleton> {
    let anyRaw = raw as any;
    let clazz = getClassForDocument(raw);
    if (clazz === DialectSchema) {
      return await DialectCreator.create(anyRaw);
    } else if (clazz === LanguageSchema) {
      return await LanguageCreator.create(anyRaw);
    } else if (clazz === FamilySchema) {
      return await FamilyCreator.create(anyRaw);
    } else {
      return await UserCreator.create(anyRaw);
    }
  }

}


export type Entry = Dialect | Language | Family | User;
export type EntryCodes = DialectCodes | LanguageCodes | FamilyCodes | {user: string};

export type DialectNames = {dialect: string, language: string, family: string, user: string};