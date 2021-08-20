//

import {
  Jsonify
} from "jsonify-type";
import {
  Entry
} from "/client/skeleton/entry";
import {
  User
} from "/client/skeleton/user";


export const SERVER_PATH_PREFIX = "/internal/" + process.env["npm_package_version"];
export const SERVER_PATHS = {
  addEntry: "/cla/create",
  fetchEntry: "/cla/fetch",
  login: "/user/login",
  logout: "/user/logout",
  registerUser: "/user/register",
  fetchUser: "/user/fetch"
};

type ServerSpecs = {
  addEntry: {
    request: {codes: any, names: any},
    response: {
      success: true,
      error: never
    }
  },
  fetchEntry: {
    request: {codes: any},
    response: {
      success: Entry | null,
      error: never
    }
  },
  login: {
    request: {code: string, password: string},
    response: {
      success: {token: string, user: User},
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
      success: User,
      error: never
    }
  },
  registerUser: {
    request: {code: string, password: string},
    response: {
      success: User,
      error: never
    }
  }
};

export type Status = "success" | "error";
export type ProcessName = keyof ServerSpecs;

export type RequestData<N extends ProcessName> = Jsonify<ServerSpecs[N]["request"]>;
export type ResponseData<N extends ProcessName> = Jsonify<ServerSpecs[N]["response"]["success"]> | Jsonify<ServerSpecs[N]["response"]["error"]>;
export type ResponseEachData<N extends ProcessName, S extends Status> = Jsonify<ServerSpecs[N]["response"][S]>;