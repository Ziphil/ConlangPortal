//


export class SuperEntry<K extends string, C extends SuperEntryCodes, N extends SuperEntryNames> {

  public id!: string;
  public kind!: K;
  public codes!: C;
  public names!: N;
  public name?: string;
  public approved!: boolean;
  public createdDate!: string;
  public approvedDate?: string;

  public getNameArray(): Array<string | undefined> {
    let nameArray = [];
    if (this.kind === "dialect") {
      nameArray.push(this.getName("dialect"));
    }
    if (this.kind === "dialect" || this.kind === "language") {
      nameArray.push(this.getName("language"));
    }
    if (this.kind === "dialect" || this.kind === "language" || this.kind === "family") {
      nameArray.push(this.getName("family"));
    }
    nameArray.push(this.getName("user"));
    return nameArray;
  }

  // フロントエンド側で表示するようのコードを返します。
  public getCode<K extends keyof SuperEntryCodes>(kind: K): C[K] {
    return this.codes[kind];
  }

  // フロントエンド側で表示するようの名称を返します。
  public getName<K extends keyof SuperEntryNames>(kind: K): N[K] {
    return (this.codes[kind] === "~") ? "—" : this.names[kind];
  }

  public changeInformations(informations: any): void {
    let anyThis = this as any;
    for (let [key, value] of Object.entries(informations)) {
      if (value !== undefined) {
        anyThis[key] = value;
        if (key === "name") {
          anyThis.names[anyThis.kind] = value;
        }
      }
    }
  }

}


export type SuperEntryCodes = {dialect?: string, language?: string, family?: string, user: string};
export type SuperEntryNames = {dialect?: string, language?: string, family?: string, user?: string};