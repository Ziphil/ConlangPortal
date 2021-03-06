//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Jsonify
} from "jsonify-type";
import {
  Language as LanguageSkeleton
} from "/client/skeleton/language";
import {
  CreatorModel
} from "/server/model/creator";
import {
  DialectModel
} from "/server/model/dialect";
import {
  FamilyModel
} from "/server/model/family";


export class LanguageCodesSchema {

  @prop({required: true})
  public language!: string;

  @prop({required: true})
  public family!: string;

  @prop({required: true})
  public creator!: string;

}


@modelOptions({schemaOptions: {collection: "languages"}})
export class LanguageSchema {

  @prop({required: true})
  public codes!: LanguageCodesSchema;

  @prop()
  public name?: string;

  @prop()
  public homepageUrl?: string;

  @prop()
  public dictionaryUrl?: string;

  @prop()
  public description?: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  @prop()
  public approvedDate?: Date;

  public async changeInformations(this: Language, informations: any): Promise<Language> {
    let languages = await LanguageModel.fetchSyncedByCodes(this.codes) as Array<any>;
    let promises = languages.map(async (language) => {
      for (let [key, value] of Object.entries(informations)) {
        if (value !== undefined) {
          language[key] = value;
        }
      }
      await language.save();
    });
    await Promise.all(promises);
    return this;
  }

  public async fetchNames(): Promise<LanguageNames> {
    let creatorNamePromise = CreatorModel.fetchOneByCodes(this.codes).then((creator) => creator?.name);
    let familyNamePromise = FamilyModel.fetchOneByCodes(this.codes).then((family) => family?.name);
    let [creatorName, familyName] = await Promise.all([creatorNamePromise, familyNamePromise]);
    let languageName = this.name;
    let names = {language: languageName, family: familyName, creator: creatorName};
    return names;
  }

  public static async add(codes: LanguageCodes, name: string): Promise<Language> {
    let createdDate = new Date();
    let approved = false;
    let language = new LanguageModel({codes, name, approved, createdDate});
    await language.save();
    return language;
  }

  public static async fetchOneByCodes(codes: LanguageCodes): Promise<Language | null> {
    let language = await LanguageModel.findOne().where("codes.creator", codes.creator).where("codes.family", codes.family).where("codes.language", codes.language);
    return language;
  }

  public static async fetchSyncedByCodes(codes: LanguageCodes): Promise<Array<Language>> {
    let languages = await LanguageModel.find().or([
      LanguageModel.find().where("codes.creator", codes.creator).where("codes.language", codes.language).getFilter(),
      LanguageModel.find().where("codes.creator", codes.family).where("codes.language", codes.language).getFilter(),
      LanguageModel.find().where("codes.family", codes.creator).where("codes.language", codes.language).getFilter(),
      LanguageModel.find().where("codes.family", codes.family).where("codes.language", codes.language).getFilter()
    ]);
    return languages;
  }

  public static async checkDuplication(codes: LanguageCodes): Promise<boolean> {
    if (codes.family !== "~") {
      let dialect = await DialectModel.findOne().or([
        DialectModel.find().where("codes.creator", codes.creator).where("codes.language", codes.language).getFilter(),
        DialectModel.find().where("codes.creator", codes.family).where("codes.language", codes.language).getFilter(),
        DialectModel.find().where("codes.family", codes.creator).where("codes.language", codes.language).getFilter(),
        DialectModel.find().where("codes.family", codes.family).where("codes.language", codes.language).getFilter(),
        DialectModel.find().where("codes.creator", codes.creator).where("codes.dialect", codes.language).getFilter(),
        DialectModel.find().where("codes.creator", codes.family).where("codes.dialect", codes.language).getFilter(),
        DialectModel.find().where("codes.family", codes.creator).where("codes.dialect", codes.language).getFilter(),
        DialectModel.find().where("codes.family", codes.family).where("codes.dialect", codes.language).getFilter()
      ]);
      let duplicate = dialect !== null;
      return duplicate;
    } else {
      let dialect = await DialectModel.findOne().or([
        DialectModel.find().where("codes.creator", codes.creator).where("codes.language", codes.language).getFilter(),
        DialectModel.find().where("codes.family", codes.creator).where("codes.language", codes.language).getFilter(),
        DialectModel.find().where("codes.creator", codes.creator).where("codes.dialect", codes.language).getFilter(),
        DialectModel.find().where("codes.family", codes.creator).where("codes.dialect", codes.language).getFilter()
      ]);
      let duplicate = dialect !== null;
      return duplicate;
    }
  }

}


export class LanguageCreator {

  public static async create(raw: Language): Promise<Jsonify<LanguageSkeleton>> {
    let id = raw.id;
    let kind = "language" as const;
    let codes = raw.codes;
    let names = await raw.fetchNames();
    let name = raw.name;
    let homepageUrl = raw.homepageUrl;
    let dictionaryUrl = raw.dictionaryUrl;
    let description = raw.description;
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let approvedDate = raw.approvedDate?.toISOString();
    let skeleton = {id, kind, codes, names, name, homepageUrl, dictionaryUrl, description, approved, createdDate, approvedDate};
    return skeleton;
  }

}


export type Language = DocumentType<LanguageSchema>;
export let LanguageModel = getModelForClass(LanguageSchema);

export type LanguageCodes = LanguageCodesSchema;
export type LanguageNames = {language?: string, family?: string, creator?: string};