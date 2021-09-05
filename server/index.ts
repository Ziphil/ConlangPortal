//

import * as typegoose from "@typegoose/typegoose";
import cookieParser from "cookie-parser";
import express from "express";
import {
  Express,
  NextFunction,
  Request,
  Response
} from "express";
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import {
  EntryExternalController
} from "/server/controller/external";
import {
  EntryController,
  UserController
} from "/server/controller/internal";
import {
  MongoUtil
} from "/server/util/mongo";
import {
  OgpUtil
} from "/server/util/ogp";
import {
  COOKIE_SECRET,
  MONGO_URI,
  PORT
} from "/server/variable";


export class Main {

  private application!: Express;

  public main(): void {
    this.application = express();
    this.setupBodyParsers();
    this.setupCookie();
    this.setupMulter();
    this.setupMongo();
    this.setupDirectories();
    this.setupRouters();
    this.setupStatic();
    this.setupFallbackHandlers();
    this.setupErrorHandler();
    this.listen();
  }

  // リクエストボディをパースするミドルウェアの設定をします。
  private setupBodyParsers(): void {
    let urlencodedParser = express.urlencoded({extended: false});
    let jsonParser = express.json();
    this.application.use(urlencodedParser);
    this.application.use(jsonParser);
  }

  private setupCookie(): void {
    let middleware = cookieParser(COOKIE_SECRET);
    this.application.use(middleware);
  }

  // ファイルをアップロードする処理を行う Multer の設定をします。
  // アップロードされたファイルは upload フォルダ内に保存するようにしています。
  private setupMulter(): void {
    let middleware = multer({dest: "./dist/upload/"}).single("file");
    this.application.use("/api*", middleware);
  }

  // MongoDB との接続を扱う mongoose とそのモデルを自動で生成する typegoose の設定を行います。
  // typegoose のデフォルトでは、空文字列を入れると値が存在しないと解釈されてしまうので、空文字列も受け入れるようにしています。
  private setupMongo(): void {
    MongoUtil.setCheckRequired("String");
    mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    typegoose.setGlobalOptions({options: {allowMixed: 0}});
  }

  // 内部処理で用いるディレクトリを用意します。
  private setupDirectories(): void {
    fs.mkdirSync("./dist/download", {recursive: true});
  }

  // ルーターの設定を行います。
  // このメソッドは、各種ミドルウェアの設定メソッドを全て呼んだ後に実行してください。
  private setupRouters(): void {
    EntryController.use(this.application);
    UserController.use(this.application);
    EntryExternalController.use(this.application);
  }

  private setupStatic(): void {
    this.application.use("/client", express.static(process.cwd() + "/dist/client"));
    this.application.use("/static", express.static(process.cwd() + "/dist/static"));
  }

  // ルーターで設定されていない URL にアクセスされたときのフォールバックの設定をします。
  // フロントエンドから呼び出すためのエンドポイント用 URL で処理が存在しないものにアクセスされた場合は、404 エラーを返します。
  // そうでない場合は、フロントエンドのトップページを返します。
  private setupFallbackHandlers(): void {
    let internalHandler = function (request: Request, response: Response, next: NextFunction): void {
      let fullUrl = request.protocol + "://" + request.get("host") + request.originalUrl;
      response.status(404).end();
    };
    let otherHandler = async function (request: Request, response: Response, next: NextFunction): Promise<void> {
      let method = request.method;
      if ((method === "GET" || method === "HEAD") && request.accepts("html")) {
        let originalUrl = request.originalUrl;
        let fullUrl = request.protocol + "://" + request.get("host") + request.originalUrl;
        let htmlPath = process.cwd() + "/dist/client/index.html";
        let [html, injectionHtml] = await Promise.all([fs.promises.readFile(htmlPath, {encoding: "utf-8"}), OgpUtil.createInjectionHtml(originalUrl, fullUrl)]);
        let convertedHtml = html.replace("<!-- meta-injection -->", injectionHtml);
        response.header("Content-Type", "text/html");
        response.send(convertedHtml).end();
      } else {
        next();
      }
    };
    this.application.use("/api*", internalHandler);
    this.application.use("*", otherHandler);
  }

  private setupErrorHandler(): void {
    let handler = function (error: any, request: Request, response: Response, next: NextFunction): void {
      console.error(error);
      response.status(500).end();
    };
    this.application.use(handler);
  }

  private listen(): void {
    this.application.listen(+PORT, () => {
      console.log(`listening | port: ${PORT}`);
    });
  }

}


let main = new Main();
main.main();