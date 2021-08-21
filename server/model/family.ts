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

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  public static async add(rawCodes: FamilyCodes, name: string): Promise<Family> {
    let codes = {family: rawCodes.family, user: rawCodes.user};
    let createdDate = new Date();
    let approved = false;
    let family = new FamilyModel({codes, name, approved, createdDate});
    await family.save();
    return family;
  }

  public static async findOneByCode(codes: FamilyCodes): Promise<Family | null> {
    let family = await FamilyModel.findOne().where("codes.user", codes.user).where("codes.family", codes.family);
    return family;
  }

  public static async checkDuplication(codes: FamilyCodes): Promise<boolean> {
    let family = await FamilyModel.findOne().or([
      FamilyModel.find().where("codes.user", codes.family).getFilter(),
      FamilyModel.find().where("codes.family", codes.family).getFilter()
    ]);
    let duplicate = family !== null;
    return duplicate;
  }

}


export class FamilyCreator {

  public static async create(raw: Family): Promise<FamilySkeleton> {
    let id = raw.id;
    let codes = raw.codes;
    let approved = raw.approved;
    let createdDate = raw.createdDate.toISOString();
    let userNamePromise = UserModel.fetchOneByCode(codes.user).then((user) => user?.name);
    let [userName] = await Promise.all([userNamePromise]);
    let familyName = raw.name;
    let names = {family: familyName, user: userName};
    let skeleton = {id, codes, names, approved, createdDate};
    return skeleton;
  }

}


export type Family = DocumentType<FamilySchema>;
export let FamilyModel = getModelForClass(FamilySchema);

export type FamilyCodes = {family: string, user: string};