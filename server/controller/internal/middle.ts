//

import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from "express";
import * as jwt from "jsonwebtoken";
import {
  UserModel
} from "/server/model/user";
import {
  JWT_SECRET
} from "/server/variable";


export function verifyUser(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let token = (request.signedCookies.authorization || request.headers.authorization) + "";
    jwt.verify(token, JWT_SECRET, async (error, data) => {
      if (!error && data && "id" in data) {
        let anyData = data as any;
        let user = await UserModel.findById(anyData.id).exec();
        if (user) {
          request.user = user;
          next();
        } else {
          response.status(401).end();
        }
      } else {
        response.status(401).end();
      }
    });
  };
  return handler;
}

export function verifyAdministrator(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let user = request.user!;
    if (user.administrator) {
      next();
    } else {
      response.status(403).end();
    }
  };
  return handler;
}

export function verifyCode(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let user = request.user!;
    let userCode = request.query.codes?.user || request.body.codes?.user;
    if (user.code === userCode) {
      next();
    } else {
      response.status(403).end();
    }
  };
  return handler;
}

export function login(expiresIn: number): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let code = request.body.code ?? request.query.code;
    let password = request.body.password ?? request.query.code;
    let user = await UserModel.authenticate(code, password);
    if (user) {
      jwt.sign({id: user.id}, JWT_SECRET, {expiresIn}, (error, token) => {
        if (!error) {
          request.token = token;
          request.user = user;
          let options = {maxAge: expiresIn * 1000, httpOnly: true, signed: true, sameSite: true};
          response.cookie("authorization", token, options);
          next();
        } else {
          next(error);
        }
      });
    } else {
      response.status(401).end();
    }
  };
  return handler;
}

export function logout(): RequestHandler {
  let handler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
    response.clearCookie("authorization");
    next();
  };
  return handler;
}