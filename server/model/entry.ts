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
  DialectNames,
  DialectSchema
} from "/server/model/dialect";
import {
  CustomError
} from "/server/model/error";
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

  private static assertCodes(codes: DialectCodes): void {
    if (!codes.user.match(/^[a-z]{3}$/)) {
      throw new CustomError("invalidUserCode");
    }
    if (codes.family !== "~" && !codes.family.match(/^[a-z]{3}$/)) {
      throw new CustomError("invalidFamilyCode");
    }
    if (!codes.language.match(/^[a-z]{2}$/)) {
      throw new CustomError("invalidLanguageCode");
    }
    if (codes.dialect !== "~" && !codes.dialect.match(/^[a-z]{2}$/)) {
      throw new CustomError("invalidDialectCode");
    }
  }

  public static async add(codes: DialectCodes, names: Required<DialectNames>): Promise<void> {
    let methods = [] as Array<() => Promise<any>>;
    let familyPromise = (async () => {
      let family = await FamilyModel.fetchOneByCodes(codes);
      if (family === null) {
        let duplicate = await FamilyModel.checkDuplication(codes);
        if (!duplicate) {
          methods.push(() => FamilyModel.add(codes, names.family));
        } else {
          throw new CustomError("duplicateFamilyCode");
        }
      }
    })();
    let languagePromise = (async () => {
      let language = await LanguageModel.fetchOneByCodes(codes);
      if (language === null) {
        let duplicate = await LanguageModel.checkDuplication(codes);
        if (!duplicate) {
          methods.push(() => LanguageModel.add(codes, names.language));
        } else {
          throw new CustomError("duplicateLanguageCode");
        }
      }
    })();
    let dialectPromise = (async () => {
      let duplicate = await DialectModel.checkDuplication(codes);
      if (!duplicate && codes.dialect !== codes.language) {
        methods.push(() => DialectModel.add(codes, names.dialect));
      } else {
        throw new CustomError("duplicateDialectCode");
      }
    })();
    this.assertCodes(codes);
    await Promise.all([familyPromise, languagePromise, dialectPromise]);
    await Promise.all(methods.map((method) => method()));
  }

  public static async fetchOneByCodes(codes: EntryCodes): Promise<Entry | null> {
    if ("dialect" in codes) {
      return await DialectModel.fetchOneByCodes(codes);
    } else if ("language" in codes) {
      return await LanguageModel.fetchOneByCodes(codes);
    } else if ("family" in codes) {
      return await FamilyModel.fetchOneByCodes(codes);
    } else {
      return await UserModel.fetchOneByCode(codes.user);
    }
  }

  public static async fetchByCodesLoose(codes: EntryCodes): Promise<Array<Entry>> {
    if ("dialect" in codes) {
      return await DialectModel.fetchByCodesLoose(codes);
    } else if ("language" in codes) {
      return await LanguageModel.fetchByCodesLoose(codes);
    } else if ("family" in codes) {
      return await FamilyModel.fetchByCodesLoose(codes);
    } else {
      return [await UserModel.fetchOneByCode(codes.user)].flatMap((user) => (user !== null) ? [user] : []);
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
      return UserCreator.create(anyRaw);
    }
  }

}


export type Entry = Dialect | Language | Family | User;
export type EntryCodes = DialectCodes | LanguageCodes | FamilyCodes | {user: string};