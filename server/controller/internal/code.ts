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
    Controller.respond(response, {});
  }

}