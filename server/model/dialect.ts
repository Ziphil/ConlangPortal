//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";


@modelOptions({schemaOptions: {collection: "dialects"}})
export class DialectSchema {

  @prop({required: true})
  public codes!: {dialect: string, language: string, family: string, user: string};

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  public static async add(rawCodes: {dialect: string, language: string, family: string, user: string}, name: string): Promise<Dialect> {
    let codes = {dialect: rawCodes.dialect, language: rawCodes.language, family: rawCodes.family, user: rawCodes.user};
    let createdDate = new Date();
    let approved = false;
    let dialect = new DialectModel({codes, name, approved, createdDate});
    await dialect.save();
    return dialect;
  }

  public static async findOneByCode(codes: {dialect: string, language: string, family: string, user: string}): Promise<Dialect | null> {
    let family = await DialectModel.findOne().where("code.user", codes.user).where("code.family", codes.family).where("code.language", codes.language).where("code.dialect", codes.dialect);
    return family;
  }

}


export type Dialect = DocumentType<DialectSchema>;
export let DialectModel = getModelForClass(DialectSchema);