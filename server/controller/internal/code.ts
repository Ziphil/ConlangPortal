//

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
    await EntryUtil.create(codes, names);
    Controller.respond(response, true);
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

}