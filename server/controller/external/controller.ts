//

import {
  Response
} from "express";
import {
  Controller as BaseController
} from "/server/controller/controller";


export class Controller extends BaseController {

  protected static respond(response: Response, body: any): void {
    let string = JSON.stringify(body, null, 2);
    response.header("Content-Type", "application/json");
    response.send(string).end();
  }

}