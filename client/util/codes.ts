//

import {
  EntryCodes
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
    codePath += codes.user;
    if (!options?.preserveTilde && codePath.startsWith("0")) {
      codePath = codePath.replace(/^0-/, "");
    }
    return codePath;
  }

  public static fromCodePath(codePath: string): EntryCodes {
    let codeArray = codePath.split("-").reverse();
    let codes = {} as any;
    if (codeArray.length >= 1) {
      codes.user = codeArray[0];
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

}