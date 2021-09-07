//

import {
  NextFunction,
  Request,
  RequestHandler,
  Response
} from "express";
import * as jwt from "jsonwebtoken";
import {
  CreatorModel
} from "/server/model/creator";
import {
  JWT_SECRET
} from "/server/variable";


export function verifyUser(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let token = (request.signedCookies.authorization || request.headers.authorization) + "";
    jwt.verify(token, JWT_SECRET, async (error, data) => {
      if (!error && data && "id" in data) {
        let anyData = data as any;
        let user = await CreatorModel.findById(anyData.id).exec();
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

export function verifyApprover(): RequestHandler {
  let handler = async function (request: any, response: Response, next: NextFunction): Promise<void> {
    let user = request.user!;
    if (user.authority === "approver" || user.authority === "admin") {
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
    let creatorCode = request.query.codes?.creator || request.body.codes?.creator;
    if (user.codes.creator === creatorCode) {
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
    let user = await CreatorModel.authenticate(code, password);
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