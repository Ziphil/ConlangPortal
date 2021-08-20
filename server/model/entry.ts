//

import {
  DialectModel
} from "/server/model/dialect";
import {
  FamilyModel
} from "/server/model/family";
import {
  LanguageModel
} from "/server/model/language";


export class EntryUtil {

  public static async create(codes: any, names: any): Promise<any> {
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