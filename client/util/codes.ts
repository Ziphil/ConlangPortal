//

import type {
  EntryCodes,
  EntryKind
} from "/client/skeleton/entry";


export class CodesUtil {

  public static toCodePath(codes: EntryCodes, options?: {preserveTilde?: boolean}): string {
    let codePath = "";
    if ("dialect" in codes) {
      codePath += ((codes.dialect === "~") ? "0" : codes.dialect) + "-";
    }
    if ("language" in codes) {
      codePath += codes.language + "-";
    }
    if ("family" in codes) {
      codePath += ((codes.family === "~") ? "0" : codes.family) + "-";
    }
    codePath += codes.creator;
    if (!options?.preserveTilde && codePath.startsWith("0")) {
      codePath = codePath.replace(/^0-/, "");
    }
    return codePath;
  }

  public static fromCodePath(codePath: string): EntryCodes {
    let codeArray = codePath.split("-").reverse();
    let codes = {} as any;
    if (codeArray.length >= 1) {
      codes.creator = codeArray[0];
    }
    if (codeArray.length >= 2) {
      codes.family = (codeArray[1] === "" || codeArray[1] === "0") ? "~" : codeArray[1];
    }
    if (codeArray.length >= 3) {
      codes.language = codeArray[2];
    }
    if (codeArray.length >= 4) {
      codes.dialect = (codeArray[3] === "" || codeArray[3] === "0") ? "~" : codeArray[3];
    }
    return codes;
  }

  public static isValidCodePath(codePath: string): boolean {
    let valid = codePath.match(/^(([a-z]{2}|0|)\-([a-z]{2})\-([a-z]{3}|0|)\-([a-z]{3})|([a-z]{2})\-([a-z]{3}|0|)\-([a-z]{3})|([a-z]{3}|0|)\-([a-z]{3})|([a-z]{3}))$/);
    return !!valid;
  }

  public static toCodeArray(codes: EntryCodes): Array<string> {
    let codeArray = [];
    if ("dialect" in codes) {
      codeArray.push(codes.dialect);
    }
    if ("language" in codes) {
      codeArray.push(codes.language);
    }
    if ("family" in codes) {
      codeArray.push(codes.family);
    }
    codeArray.push(codes.creator);
    return codeArray;
  }

  public static toNormalizedForm(codes: EntryCodes): string {
    let string = "";
    string += (("dialect" in codes) ? codes.dialect : "*") + "_";
    string += (("language" in codes) ? codes.language: "*") + "_";
    string += (("family" in codes) ? codes.family : "*") + "_";
    string += codes.creator;
    return string;
  }

  public static toBcpString(codes: EntryCodes): string {
    let string = "x-v3-";
    string += codes.creator;
    if ("family" in codes) {
      string += (codes.family === "~") ? "0" : codes.family;
    }
    if ("language" in codes) {
      string += codes.language;
    }
    if ("dialect" in codes) {
      string += "-" + ((codes.dialect === "~") ? "0" : codes.dialect);
    }
    return string;
  }

  public static getParentCodes(codes: EntryCodes): EntryCodes | null {
    if ("dialect" in codes) {
      return {language: codes.language, family: codes.family, creator: codes.creator};
    } else if ("language" in codes) {
      return {family: codes.family, creator: codes.creator};
    } else if ("family" in codes) {
      return {creator: codes.creator};
    } else {
      return null;
    }
  }

  public static getAncestorCodes(codes: EntryCodes): Array<EntryCodes> {
    let ancestorCodes = [];
    for (let currentCodes = this.getParentCodes(codes) ; currentCodes !== null ; currentCodes = this.getParentCodes(currentCodes)) {
      ancestorCodes.push(currentCodes);
    }
    return ancestorCodes;
  }

  public static getKind(codes: EntryCodes): EntryKind {
    if ("dialect" in codes) {
      return "dialect";
    } else if ("language" in codes) {
      return "language";
    } else if ("family" in codes) {
      return "family";
    } else {
      return "creator";
    }
  }

}