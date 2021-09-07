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
  login,
  logout,
  verifyUser
} from "/server/controller/internal/middle";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";
import {
  CreatorCreator,
  CreatorModel
} from "/server/model/creator";


@controller(SERVER_PATH_PREFIX)
export class UserController extends Controller {

  @post(SERVER_PATHS["login"])
  @before(login(30 * 24 * 60 * 60))
  public async [Symbol()](request: Request<"login">, response: Response<"login">): Promise<void> {
    let token = request.token!;
    let user = request.user!;
    let userBody = CreatorCreator.create(user);
    let body = {token, user: userBody};
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["logout"])
  @before(logout())
  public async [Symbol()](request: Request<"logout">, response: Response<"logout">): Promise<void> {
    Controller.respond(response, null);
  }

  @post(SERVER_PATHS["registerUser"])
  public async [Symbol()](request: Request<"registerUser">, response: Response<"registerUser">): Promise<void> {
    let code = request.body.code;
    let name = request.body.name;
    let password = request.body.password;
    try {
      let user = await CreatorModel.register(code, name, password);
      let body = CreatorCreator.create(user);
      Controller.respond(response, body);
    } catch (error) {
      let body = (error.name === "CustomError") ? CustomError.ofType(error.type) : undefined;
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATHS["fetchUser"])
  @before(verifyUser())
  public async [Symbol()](request: Request<"fetchUser">, response: Response<"fetchUser">): Promise<void> {
    let user = request.user!;
    let body = CreatorCreator.create(user);
    Controller.respond(response, body);
  }

}