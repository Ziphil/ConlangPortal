//

import {
  CustomError
} from "/client/skeleton/error";
import {
  before,
  controller,
  post
} from "/server/controller/decorator";
import {
  Controller,
  Request,
  Response
} from "/server/controller/internal/controller";
import {
  verifyCode,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  DialectCreator,
  DialectModel
} from "/server/model/dialect";
import {
  EntryCreator,
  EntryUtil
} from "/server/model/entry";


@controller(SERVER_PATH_PREFIX)
export class CodeController extends Controller {

  @post(SERVER_PATHS["addEntry"])
  @before(verifyUser(), verifyCode())
  public async [Symbol()](request: Request<"addEntry">, response: Response<"addEntry">): Promise<void> {
    let codes = request.body.codes;
    let names = request.body.names;
    try {
      await EntryUtil.add(codes, names);
      Controller.respond(response, {});
    } catch (error) {
      let body = (error.name === "CustomError") ? CustomError.ofType(error.type) : undefined;
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATHS["fetchEntry"])
  @before()
  public async [Symbol()](request: Request<"fetchEntry">, response: Response<"fetchEntry">): Promise<void> {
    let codes = request.body.codes;
    let entry = await EntryUtil.fetchOneByCodes(codes);
    if (entry !== null) {
      let body = await EntryCreator.create(entry);
      Controller.respond(response, body);
    } else {
      Controller.respond(response, null);
    }
  }

  @post(SERVER_PATHS["fetchEntryName"])
  @before()
  public async [Symbol()](request: Request<"fetchEntryName">, response: Response<"fetchEntryName">): Promise<void> {
    let codes = request.body.codes;
    let entry = await EntryUtil.fetchOneByCodes(codes);
    if (entry !== null) {
      let body = entry.name;
      Controller.respond(response, body);
    } else {
      Controller.respond(response, null);
    }
  }

  @post(SERVER_PATHS["fetchDialects"])
  @before()
  public async [Symbol()](request: Request<"fetchDialects">, response: Response<"fetchDialects">): Promise<void> {
    let dialects = await DialectModel.find();
    let body = await Promise.all(dialects.map((dialect) => DialectCreator.create(dialect)));
    Controller.respond(response, body);
  }

}