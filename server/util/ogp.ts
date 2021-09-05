//

import {
  CodesUtil
} from "/client/util/codes";
import {
  OgpUtil as ClientOgpUtil
} from "/client/util/ogp";
import {
  EntryCreator,
  EntryUtil
} from "/server/model/entry";


export class OgpUtil {

  public static async createInjectionHtml(originalUrl: string, fullUrl: string): Promise<string> {
    let match = originalUrl.match(/^\/cla\/([^\/]+)$/);
    if (match !== null && CodesUtil.isValidCodePath(match[1])) {
      let codePath = match[1];
      let codes = CodesUtil.fromCodePath(codePath);
      let rawEntry = await EntryUtil.fetchOneByCodes(codes);
      let entry = (rawEntry !== null) ? await EntryCreator.create(rawEntry) : null;
      let title = ClientOgpUtil.createTitle(entry);
      let titleHtml = `<title>${ClientOgpUtil.escapeHtml(title)}</title>`;
      let metaHtml = ClientOgpUtil.createMetaHtml(entry, codes, fullUrl);
      return metaHtml + titleHtml;
    } else {
      let title = ClientOgpUtil.createDefaultTitle();
      let titleHtml = `<title>${ClientOgpUtil.escapeHtml(title)}</title>`;
      let metaHtml = ClientOgpUtil.createDefaultMetaHtml(fullUrl);
      return metaHtml + titleHtml;
    }
  }

}