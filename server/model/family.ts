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
  Family as FamilySkeleton
} from "/client/skeleton/family";
import {
  CreatorModel
} from "/server/model/creator";


export class FamilyCodesSchema {

  @prop({required: true})
  public family!: string;

  @prop({required: true})
  public creator!: string;

}


@modelOptions({schemaOptions: {collection: "families"}})
export class FamilySchema {

  @prop({required: true})
  public codes!: FamilyCodesSchema;

  @prop()
  public name?: string;

  @prop()
  public homepageUrl?: string;

  @prop()
  public description?: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  @prop()
  public approvedDate?: Date;

  public async changeInformations(this: Family, informations: any): Promise<Family> {
    let families = await FamilyModel.fetchSyncedByCodes(this.codes) as Array<any>;
    let promises = families.map(async (family) => {
      for (let [key, value] of Object.entries(informations)) {
        if (value !== undefined) {
          family[key] = value;
        }
      }
      await family.save();
    });
    await Promise.all(promises);
    return this;
  }

  public async fetchNames(): Promise<FamilyNames> {
    let creatorNamePromise = CreatorModel.fetchOneByCodes(this.codes).then((creator) => creator?.name);
    let [creatorName] = await Promise.all([creatorNamePromise]);
    let familyName = this.name;
    let names = {family: familyName, creator: creatorName};
    return names;
  }

  public static async add(codes: FamilyCodes, rawName: string): Promise<Family> {
    let syncedFamilies = await this.fetchSyncedByCodes(codes);
    let name = (syncedFamilies[0] !== undefined) ? syncedFamilies[0].name : rawName;
    let createdDate = new Date();
    let approved = false;
    let family = new FamilyModel({codes, name, approved, createdDate});
    await family.save();
    return family;
  }

  public static async fetchOneByCodes(codes: FamilyCodes): Promise<Family | null> {
    let family = await FamilyModel.findOne().where("codes.creator", codes.creator).where("codes.family", codes.family);
    return family;
  }

  /** 与えられたコードの語族データと共通のプロパティをもたなければならない全ての語族データの配列を返します。
   * すなわち、与えられたコードのプロパティを変更したい場合、このメソッドが返す全ての語族データに対しても同じプロパティで変更する必要があります。
   * 例えば、引数に xxx/aaa を渡した場合、このメソッドが返す配列には、完全に合致する xxx/aaa はもちろん含まれる他、xxx/bbb のような製作者部分が異なるものも含まれます。*/
  public static async fetchSyncedByCodes(codes: FamilyCodes): Promise<Array<Family>> {
    if (codes.family !== "~") {
      let families = await FamilyModel.find().where("codes.family", codes.family);
      return families;
    } else {
      let families = await FamilyModel.find().where("codes.creator", codes.creator).where("codes.family", codes.family);
      return families;
    }
  }

  public static async checkDuplication(codes: FamilyCodes): Promise<boolean> {
    if (codes.family !== "~") {
      let family = await FamilyModel.findOne().or([
        FamilyModel.find().where("codes.creator", codes.family).getFilter(),
        FamilyModel.find().where("codes.creator", codes.creator).where("codes.family", codes.family).getFilter()
      ]);
      let duplicate = family !== null;
      return duplicate;
    } else {
      let family = await FamilyModel.findOne().or([
        FamilyModel.find().where("codes.creator", codes.creator).where("codes.family", codes.family).getFilter()
      ]);
      let duplicate = family !== null;
      return duplicate;
    }
  }

}


export class FamilyCreator {

  public static async create(raw: Family): Promise<Jsonify<FamilySkeleton>> {
    let id = raw.id;
    let kind = "family" as const;
    let codes = raw.codes;
    let names = await raw.fetchNames();
    let name = raw.name;
    let homepageUrl = raw.homepageUrl;
    let description = raw.description;
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let approvedDate = raw.approvedDate?.toISOString();
    let skeleton = {id, kind, codes, names, name, homepageUrl, description, approved, createdDate, approvedDate};
    return skeleton;
  }

}


export type Family = DocumentType<FamilySchema>;
export let FamilyModel = getModelForClass(FamilySchema);

export type FamilyCodes = FamilyCodesSchema;
export type FamilyNames = {family?: string, creator?: string};