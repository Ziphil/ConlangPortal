//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  Family as FamilySkeleton
} from "/client/skeleton/family";
import {
  UserModel
} from "/server/model/user";


@modelOptions({schemaOptions: {collection: "families"}})
export class FamilySchema {

  @prop({required: true})
  public codes!: FamilyCodes;

  @prop()
  public name?: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  @prop()
  public approvedDate?: Date;

  public async changeInformations(this: Family, informations: any): Promise<Family> {
    let families = await FamilyModel.fetchByCodesLoose(this.codes) as Array<any>;
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
    let userNamePromise = UserModel.fetchOneByCode(this.codes.user).then((user) => user?.name);
    let [userName] = await Promise.all([userNamePromise]);
    let familyName = this.name;
    let names = {family: familyName, user: userName};
    return names;
  }

  public static async add(rawCodes: FamilyCodes, rawName: string): Promise<Family> {
    let syncingFamilies = await this.fetchByCodesLoose(rawCodes);
    let codes = {family: rawCodes.family, user: rawCodes.user};
    let name = (syncingFamilies[0] !== undefined) ? syncingFamilies[0].name : rawName;
    let createdDate = new Date();
    let approved = false;
    let family = new FamilyModel({codes, name, approved, createdDate});
    await family.save();
    return family;
  }

  public static async fetchOneByCodes(codes: FamilyCodes): Promise<Family | null> {
    let family = await FamilyModel.findOne().where("codes.user", codes.user).where("codes.family", codes.family);
    return family;
  }

  // 与えられたコードの語族データと共通のプロパティをもたなければならない全ての語族データの配列を返します。
  // すなわち、与えられたコードのプロパティを変更したい場合、このメソッドが返す全ての語族データに対しても同じプロパティで変更する必要があります。
  // 例えば、引数に xxx/aaa を渡した場合、このメソッドが返す配列には、完全に合致する xxx/aaa はもちろん含まれる他、xxx/bbb のような製作者部分が異なるものも含まれます。
  public static async fetchByCodesLoose(codes: FamilyCodes): Promise<Array<Family>> {
    if (codes.family !== "~") {
      let families = await FamilyModel.find().where("codes.family", codes.family);
      return families;
    } else {
      let families = await FamilyModel.find().where("codes.user", codes.user).where("codes.family", codes.family);
      return families;
    }
  }

  public static async checkDuplication(codes: FamilyCodes): Promise<boolean> {
    if (codes.family !== "~") {
      let family = await FamilyModel.findOne().or([
        FamilyModel.find().where("codes.user", codes.family).getFilter(),
        FamilyModel.find().where("codes.user", codes.user).where("codes.family", codes.family).getFilter()
      ]);
      let duplicate = family !== null;
      return duplicate;
    } else {
      return false;
    }
  }

}


export class FamilyCreator {

  public static async create(raw: Family): Promise<FamilySkeleton> {
    let id = raw.id;
    let codes = raw.codes;
    let names = await raw.fetchNames();
    let name = raw.name;
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let skeleton = {id, codes, names, name, approved, createdDate};
    return skeleton;
  }

}


export type Family = DocumentType<FamilySchema>;
export let FamilyModel = getModelForClass(FamilySchema);

export type FamilyCodes = {family: string, user: string};
export type FamilyNames = {family?: string, user?: string};