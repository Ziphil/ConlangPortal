//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";


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
    let family = await FamilyModel.findOne().where("code.user", codes.user).where("code.family", codes.family);
    return family;
  }

}


export type Family = DocumentType<FamilySchema>;
export let FamilyModel = getModelForClass(FamilySchema);

export type FamilyCodes = {family: string, user: string};