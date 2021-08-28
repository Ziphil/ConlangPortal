//

import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop
} from "@typegoose/typegoose";
import {
  compareSync,
  hashSync
} from "bcrypt";
import {
  User as UserSkeleton
} from "/client/skeleton/user";
import {
  CustomError
} from "/server/model/error";
import {
  FamilyModel
} from "/server/model/family";


@modelOptions({schemaOptions: {collection: "users"}})
export class UserSchema {

  @prop({required: true, unique: true})
  public code!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public hash!: string;

  @prop({required: true})
  public approved!: boolean;

  @prop({required: true})
  public createdDate!: Date;

  @prop()
  public approvedDate?: Date;

  public async changeInformations(this: User, informations: any): Promise<User> {
    let anyThis = this as any;
    for (let [key, value] of Object.entries(informations)) {
      if (value !== undefined) {
        anyThis[key] = value;
      }
    }
    await this.save();
    return this;
  }

  // 渡された情報からユーザーを作成し、データベースに保存します。
  // このとき、名前が妥当な文字列かどうか、およびすでに同じ名前のユーザーが存在しないかどうかを検証し、不適切だった場合はエラーを発生させます。
  // 渡されたパスワードは自動的にハッシュ化されます。
  public static async register(code: string, name: string, password: string): Promise<User> {
    if (!code.match(/^[a-z]{3}$/)) {
      throw new CustomError("invalidUserCode");
    } else {
      let duplicate = await this.checkDuplication(code);
      if (duplicate) {
        throw new CustomError("duplicateUserCode");
      } else {
        let approved = false;
        let createdDate = new Date();
        let user = new UserModel({code, name, approved, createdDate});
        await user.encryptPassword(password);
        await user.save();
        return user;
      }
    }
  }

  // 渡された名前とパスワードに合致するユーザーを返します。
  // 渡された名前のユーザーが存在しない場合や、パスワードが誤っている場合は、null を返します。
  public static async authenticate(code: string, password: string): Promise<User | null> {
    let user = await UserModel.findOne().where("code", code);
    if (user && user.comparePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  public static async fetchOneByCode(code: string): Promise<User | null> {
    let user = await UserModel.findOne().where("code", code);
    return user;
  }

  // 引数に渡された生パスワードをハッシュ化して、自身のプロパティを上書きします。
  // データベースへの保存は行わないので、別途保存処理を行ってください。
  private async encryptPassword(password: string): Promise<void> {
    let hash = hashSync(password, 10);
    this.hash = hash;
  }

  private comparePassword(password: string): boolean {
    return compareSync(password, this.hash);
  }

  public static async checkDuplication(code: string): Promise<boolean> {
    let userQuery = UserModel.findOne().where("code", code);
    let familyQuery = FamilyModel.findOne().where("codes.family", code);
    let [user, family] = await Promise.all([userQuery, familyQuery]);
    let duplicate = user !== null || family !== null;
    return duplicate;
  }

}


export class UserCreator {

  public static create(raw: User): UserSkeleton {
    let id = raw.id;
    let codes = {user: raw.code};
    let code = raw.code;
    let names = {user: raw.name};
    let name = raw.name;
    let skeleton = {id, codes, code, names, name};
    return skeleton;
  }

}


export type User = DocumentType<UserSchema>;
export let UserModel = getModelForClass(UserSchema);