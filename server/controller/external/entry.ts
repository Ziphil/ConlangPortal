//

import {
  Request,
  Response
} from "express";
import {
  before,
  controller,
  get,
  post
} from "/server/controller/decorator";
import {
  Controller
} from "/server/controller/external/controller";
import {
  DialectModel
} from "/server/model/dialect";


@controller("/api/cla")
export class EntryExternalController extends Controller {

  @get("/list")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    let onlyApproved = !!request.query["onlyApproved"];
    let includeOptions = (onlyApproved) ? {approved: true, unapproved: false} : {approved: true, unapproved: true};
    let dialects = await DialectModel.fetch(includeOptions);
    let dialectsJsonPromise = dialects.map(async (dialect) => {
      let names = await dialect.fetchNames();
      let dialectJson = {} as any;
      dialectJson["normalizedCode"] = `${dialect.codes.dialect}_${dialect.codes.language}_${dialect.codes.family}_${dialect.codes.user}`;
      dialectJson["codes"] = dialect.codes;
      dialectJson["names"] = names;
      dialectJson["approved"] = dialect.approved;
      dialectJson["createdDate"] = dialect.createdDate.toISOString();
      dialectJson["approvedDate"] = dialect.approvedDate?.toISOString() ?? null;
      return dialectJson;
    });
    let dialectsJson = await Promise.all(dialectsJsonPromise);
    let json = {} as any;
    json["entries"] = dialectsJson;
    Controller.respond(response, json);
  }

}