//

import {
  Jsonify
} from "jsonify-type";
import {
  Creator
} from "/client/skeleton/creator";
import {
  Dialect,
  DialectCodes,
  DialectNames
} from "/client/skeleton/dialect";
import {
  Entry,
  EntryCodes
} from "/client/skeleton/entry";
import {
  CustomError
} from "/client/skeleton/error";


export const SERVER_PATH_PREFIX = "/internal/" + process.env["npm_package_version"];
export const SERVER_PATHS = {
  addEntry: "/cla/create",
  approveDialect: "/cla/approve",
  changeEntryInformations: "/cla/edit",
  fetchEntry: "/cla/fetch",
  fetchEntryName: "/cla/fetch/name",
  fetchDescendantDialects: "/cla/fetch/descendant",
  fetchDialects: "/cla/fetch/list",
  login: "/user/login",
  logout: "/user/logout",
  registerUser: "/user/register",
  fetchUser: "/user/fetch"
};

type ServerSpecs = {
  addEntry: {
    request: {codes: DialectCodes, names: Omit<Required<DialectNames>, "user">, evidence: string},
    response: {
      success: {},
      error: CustomError<string>
    }
  },
  approveDialect: {
    request: {codes: DialectCodes},
    response: {
      success: {},
      error: CustomError<"noSuchCodes">
    }
  },
  changeEntryInformations: {
    request: {codes: EntryCodes, informations: any},
    response: {
      success: {},
      error: CustomError<"noSuchCodes">
    }
  },
  fetchEntry: {
    request: {codes: EntryCodes},
    response: {
      success: Entry | null,
      error: never
    }
  },
  fetchEntryName: {
    request: {codes: EntryCodes},
    response: {
      success: {name: string | null, cautionType: string | null},
      error: never
    }
  },
  fetchDescendantDialects: {
    request: {codes: EntryCodes},
    response: {
      success: Array<Dialect>,
      error: never
    }
  },
  fetchDialects: {
    request: {userCode?: string, includeOptions?: {approved: boolean, unapproved: boolean}},
    response: {
      success: Array<Dialect>,
      error: never
    }
  },
  login: {
    request: {code: string, password: string},
    response: {
      success: {token: string, user: Creator},
      error: never
    }
  },
  logout: {
    request: {},
    response: {
      success: null,
      error: never
    }
  },
  fetchUser: {
    request: {},
    response: {
      success: Creator,
      error: never
    }
  },
  registerUser: {
    request: {code: string, name: string, password: string},
    response: {
      success: Creator,
      error: CustomError<string>
    }
  }
};

export type Status = "success" | "error";
export type ProcessName = keyof ServerSpecs;

export type RequestData<N extends ProcessName> = Jsonify<ServerSpecs[N]["request"]>;
export type ResponseData<N extends ProcessName> = Jsonify<ServerSpecs[N]["response"]["success"]> | Jsonify<ServerSpecs[N]["response"]["error"]>;
export type ResponseEachData<N extends ProcessName, S extends Status> = Jsonify<ServerSpecs[N]["response"][S]>;