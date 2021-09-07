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
  Dialect as DialectSkeleton
} from "/client/skeleton/dialect";
import {
  CreatorModel
} from "/server/model/creator";
import {
  EntryCodes
} from "/server/model/entry";
import {
  FamilyModel
} from "/server/model/family";
import {
  LanguageModel
} from "/server/model/language";


export class DialectCodesSchema {

  @prop({required: true})
  public dialect!: string;

  @prop({required: true})
  public language!: string;

  @prop({required: true})
  public family!: string;

  @prop({required: true})
  public creator!: string;

}


@modelOptions({schemaOptions: {collection: "dialects"}})
export class DialectSchema {

  @prop({required: true})
  public codes!: DialectCodesSchema;

  @prop()
  public name?: string;

  @prop()
  public homepageUrl?: string;

  @prop()
  public dictionaryUrl?: string;

  @prop()
  public description?: string;

  @prop()
  public evidence?: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  @prop()
  public approvedDate?: Date;

  public async approve(this: Dialect): Promise<Dialect> {
    let creatorPromise = CreatorModel.fetchOneByCodes(this.codes).then((creator) => {
      if (creator !== null && !creator.approved) {
        creator.approved = true;
        creator.approvedDate = new Date();
        return creator.save();
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
    let [creator, family, language] = await Promise.all([creatorPromise, familyPromise, languagePromise, dialectPromise]);
    return this;
  }

  public async changeInformations(this: Dialect, informations: any): Promise<Dialect> {
    let dialects = await DialectModel.fetchSyncedByCodes(this.codes) as Array<any>;
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
    let creatorNamePromise = CreatorModel.fetchOneByCodes(this.codes).then((creator) => creator?.name);
    let familyNamePromise = FamilyModel.fetchOneByCodes(this.codes).then((family) => family?.name);
    let languageNamePromise = LanguageModel.fetchOneByCodes(this.codes).then((language) => language?.name);
    let [creatorName, familyName, languageName] = await Promise.all([creatorNamePromise, familyNamePromise, languageNamePromise]);
    let dialectName = this.name;
    let names = {dialect: dialectName, language: languageName, family: familyName, creator: creatorName};
    return names;
  }

  public static async add(codes: DialectCodes, name: string, evidence: string): Promise<Dialect> {
    let createdDate = new Date();
    let approved = false;
    let dialect = new DialectModel({codes, name, evidence, approved, createdDate});
    await dialect.save();
    return dialect;
  }

  public static async fetch(creatorCode?: string, includeOptions?: {approved: boolean, unapproved: boolean}): Promise<Array<Dialect>> {
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
    if (creatorCode !== undefined) {
      query = query.where("codes.creator", creatorCode);
    }
    query = query.sort("-approvedDate -createdDate");
    let dialects = await query.exec();
    return dialects;
  }

  public static async fetchOneByCodes(codes: DialectCodes): Promise<Dialect | null> {
    let dialect = await DialectModel.findOne().where("codes.creator", codes.creator).where("codes.family", codes.family).where("codes.language", codes.language).where("codes.dialect", codes.dialect);
    return dialect;
  }

  public static async fetchSyncedByCodes(codes: DialectCodes): Promise<Array<Dialect>> {
    let dialects = await DialectModel.find().or([
      DialectModel.find().where("codes.creator", codes.creator).where("codes.dialect", codes.dialect).getFilter(),
      DialectModel.find().where("codes.creator", codes.family).where("codes.dialect", codes.dialect).getFilter(),
      DialectModel.find().where("codes.family", codes.creator).where("codes.dialect", codes.dialect).getFilter(),
      DialectModel.find().where("codes.family", codes.family).where("codes.dialect", codes.dialect).getFilter()
    ]);
    return dialects;
  }

  public static async fetchDescendants(codes: EntryCodes): Promise<Array<Dialect>> {
    let query = DialectModel.find();
    if ("dialect" in codes) {
      query = query.where("codes.dialect", codes.dialect);
    }
    if ("language" in codes) {
      query = query.where("codes.language", codes.language);
    }
    if ("family" in codes) {
      query = query.where("codes.family", codes.family);
    }
    query = query.where("codes.creator", codes.creator);
    let dialects = await query.exec();
    return dialects;
  }

  public static async checkDuplication(codes: DialectCodes): Promise<boolean> {
    if (codes.dialect !== "~") {
      if (codes.family !== "~") {
        let dialect = await DialectModel.findOne().or([
          DialectModel.find().where("codes.creator", codes.creator).where("codes.language", codes.dialect).getFilter(),
          DialectModel.find().where("codes.creator", codes.family).where("codes.language", codes.dialect).getFilter(),
          DialectModel.find().where("codes.family", codes.creator).where("codes.language", codes.dialect).getFilter(),
          DialectModel.find().where("codes.family", codes.family).where("codes.language", codes.dialect).getFilter(),
          DialectModel.find().where("codes.creator", codes.creator).where("codes.dialect", codes.dialect).getFilter(),
          DialectModel.find().where("codes.creator", codes.family).where("codes.dialect", codes.dialect).getFilter(),
          DialectModel.find().where("codes.family", codes.creator).where("codes.dialect", codes.dialect).getFilter(),
          DialectModel.find().where("codes.family", codes.family).where("codes.dialect", codes.dialect).getFilter()
        ]);
        let duplicate = dialect !== null;
        return duplicate;
      } else {
        let dialect = await DialectModel.findOne().or([
          DialectModel.find().where("codes.creator", codes.creator).where("codes.language", codes.dialect).getFilter(),
          DialectModel.find().where("codes.family", codes.creator).where("codes.language", codes.dialect).getFilter(),
          DialectModel.find().where("codes.creator", codes.creator).where("codes.dialect", codes.dialect).getFilter(),
          DialectModel.find().where("codes.family", codes.creator).where("codes.dialect", codes.dialect).getFilter()
        ]);
        let duplicate = dialect !== null;
        return duplicate;
      }
    } else {
      let dialect = await DialectModel.findOne().or([
        DialectModel.find().where("codes.creator", codes.creator).where("codes.language", codes.language).where("codes.dialect", codes.dialect).getFilter(),
        DialectModel.find().where("codes.creator", codes.family).where("codes.language", codes.language).where("codes.dialect", codes.dialect).getFilter(),
        DialectModel.find().where("codes.family", codes.creator).where("codes.language", codes.language).where("codes.dialect", codes.dialect).getFilter(),
        DialectModel.find().where("codes.family", codes.family).where("codes.language", codes.language).where("codes.dialect", codes.dialect).getFilter()
      ]);
      let duplicate = dialect !== null;
      return duplicate;
    }
  }

}


export class DialectCreator {

  public static async create(raw: Dialect): Promise<Jsonify<DialectSkeleton>> {
    let id = raw.id;
    let kind = "dialect" as const;
    let codes = raw.codes;
    let names = await raw.fetchNames();
    let name = raw.name;
    let homepageUrl = raw.homepageUrl;
    let dictionaryUrl = raw.dictionaryUrl;
    let description = raw.description;
    let evidence = raw.evidence;
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let approvedDate = raw.approvedDate?.toISOString();
    let skeleton = {id, kind, codes, names, name, homepageUrl, dictionaryUrl, description, evidence, approved, createdDate, approvedDate};
    return skeleton;
  }

}


export type Dialect = DocumentType<DialectSchema>;
export let DialectModel = getModelForClass(DialectSchema);

export type DialectCodes = DialectCodesSchema;
export type DialectNames = {dialect?: string, language?: string, family?: string, creator?: string};