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
  verifyApprover,
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
export class EntryController extends Controller {

  @post(SERVER_PATHS["addEntry"])
  @before(verifyUser(), verifyCode())
  public async [Symbol()](request: Request<"addEntry">, response: Response<"addEntry">): Promise<void> {
    let codes = request.body.codes;
    let names = request.body.names;
    let evidence = request.body.evidence;
    try {
      await EntryUtil.add(codes, names, evidence);
      Controller.respond(response, {});
    } catch (error) {
      let body = (error.name === "CustomError") ? CustomError.ofType(error.type) : undefined;
      Controller.respondError(response, body, error);
    }
  }

  @post(SERVER_PATHS["approveDialect"])
  @before(verifyUser(), verifyApprover())
  public async [Symbol()](request: Request<"approveDialect">, response: Response<"approveDialect">): Promise<void> {
    let codes = request.body.codes;
    let entry = await DialectModel.fetchOneByCodes(codes);
    if (entry !== null) {
      await entry.approve();
      Controller.respond(response, {});
    } else {
      let body = CustomError.ofType("noSuchCodes");
      Controller.respondError(response, body);
    }
  }

  @post(SERVER_PATHS["changeEntryInformations"])
  @before(verifyUser(), verifyCode())
  public async [Symbol()](request: Request<"changeEntryInformations">, response: Response<"changeEntryInformations">): Promise<void> {
    let codes = request.body.codes;
    let informations = request.body.informations;
    let entry = await EntryUtil.fetchOneByCodes(codes) as any;
    if (entry !== null) {
      await entry.changeInformations(informations);
      Controller.respond(response, {});
    } else {
      let body = CustomError.ofType("noSuchCodes");
      Controller.respondError(response, body);
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
    let entries = await EntryUtil.fetchByCodesLoose(codes);
    if (entries.length > 0) {
      let hasSyncedEntries = entries.some((entry) => {
        let creatorCodes = ("code" in entry) ? entry.code : entry.codes.creator;
        return creatorCodes !== codes.creator;
      });
      let name = entries[0].name ?? null;
      let cautionType = (hasSyncedEntries) ? "hasSyncedFamily" : null;
      let body = {name, cautionType};
      Controller.respond(response, body);
    } else {
      let body = {name: null, cautionType: null};
      Controller.respond(response, body);
    }
  }

  @post(SERVER_PATHS["fetchDescendantDialects"])
  @before()
  public async [Symbol()](request: Request<"fetchDescendantDialects">, response: Response<"fetchDescendantDialects">): Promise<void> {
    let codes = request.body.codes;
    let dialects = await DialectModel.fetchDescendants(codes);
    let body = await Promise.all(dialects.map((dialect) => DialectCreator.create(dialect)));
    Controller.respond(response, body);
  }

  @post(SERVER_PATHS["fetchDialects"])
  @before()
  public async [Symbol()](request: Request<"fetchDialects">, response: Response<"fetchDialects">): Promise<void> {
    let creatorCode = request.body.creatorCode;
    let includeOptions = request.body.includeOptions;
    let dialects = await DialectModel.fetch(creatorCode, includeOptions);
    let body = await Promise.all(dialects.map((dialect) => DialectCreator.create(dialect)));
    Controller.respond(response, body);
  }

}