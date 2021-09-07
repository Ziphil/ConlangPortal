//

import {
  Request,
  Response
} from "express";
import {
  CodesUtil
} from "/client/util/codes";
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
import {
  OgpUtil
} from "/server/util/ogp";


@controller("/api/cla")
export class EntryExternalController extends Controller {

  @get("/list")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    let onlyApproved = !!request.query["onlyApproved"];
    let includeOptions = (onlyApproved) ? {approved: true, unapproved: false} : {approved: true, unapproved: true};
    let dialects = await DialectModel.fetch(undefined, includeOptions);
    let dialectsJsonPromise = dialects.map(async (dialect) => {
      let names = await dialect.fetchNames();
      let dialectJson = {} as any;
      dialectJson["normalized"] = CodesUtil.toNormalizedForm(dialect.codes);
      dialectJson["bcp47"] = CodesUtil.toBcpString(dialect.codes);
      dialectJson["codes"] = {};
      dialectJson["codes"]["dialect"] = dialect.codes.dialect;
      dialectJson["codes"]["language"] = dialect.codes.language;
      dialectJson["codes"]["family"] = dialect.codes.family;
      dialectJson["codes"]["user"] = dialect.codes.creator;
      dialectJson["names"] = {};
      dialectJson["names"]["dialect"] = names.dialect;
      dialectJson["names"]["language"] = names.language;
      dialectJson["names"]["family"] = names.family;
      dialectJson["names"]["user"] = names.creator;
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

  @get("/image/:codePath")
  public async [Symbol()](request: Request, response: Response): Promise<void> {
    let codePath = request.params["codePath"];
    try {
      let image = await OgpUtil.createEntryImage(codePath);
      if (image !== null) {
        response.header("Content-Type", "image/png");
        response.send(image).end();
      } else {
        response.sendStatus(400).end();
      }
    } catch (error) {
      response.sendStatus(500).end();
    }
  }

}