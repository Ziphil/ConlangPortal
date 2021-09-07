//

import htmlToImage from "node-html-to-image";
import {
  EntryStatic as EntrySkeletonStatic
} from "/client/skeleton/entry";
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
import {
  CHROMIUM_PATH
} from "/server/variable";


export class OgpUtil {

  public static async createInjectionHtml(originalUrl: string, fullUrl: string): Promise<string> {
    let match = originalUrl.match(/^\/cla\/([^\/]+)$/);
    if (match !== null && CodesUtil.isValidCodePath(match[1])) {
      let codePath = match[1];
      let codes = CodesUtil.fromCodePath(codePath);
      let rawEntry = await EntryUtil.fetchOneByCodes(codes);
      let entry = (rawEntry !== null) ? EntrySkeletonStatic.create(await EntryCreator.create(rawEntry)) : null;
      let title = ClientOgpUtil.createTitle(entry, codes);
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

  // サムネイル用の画像データを生成します。
  // HTML をヘッドレス Chrome で描画して画像を生成するという実装になっており、さらに Google Fonts からフォントをダウンロードする必要もあるので、少し時間がかかります。
  public static async createEntryImage(codePath: string): Promise<Buffer | null> {
    if (CodesUtil.isValidCodePath(codePath)) {
      let codes = CodesUtil.fromCodePath(codePath);
      let rawEntry = await EntryUtil.fetchOneByCodes(codes);
      let entry = (rawEntry !== null) ? EntrySkeletonStatic.create(await EntryCreator.create(rawEntry)) : null;
      if (entry !== null) {
        let nameArray = entry.getNameArray();
        let mainNameString = nameArray[0] ?? "";
        let restNameString = ((nameArray.length >= 2) ? "« " : "") + nameArray.slice(1).join(" « ");
        let css = require("/client/public/image.scss").default;
        let templateHtml = require("/client/public/image.html").default;
        let injectionHtml = `
          <div class="code">${CodesUtil.toNormalizedForm(entry.codes)}</div>
          <div class="box">
            <div class="name-container">
              <div class="main-name">${ClientOgpUtil.escapeHtml(mainNameString)}</div>
              <div class="rest-name">${ClientOgpUtil.escapeHtml(restNameString)}</div>
            </div>
            <div class="title">Language Portal</div>
          </div>
        `;
        let html = templateHtml.replace("/* css */", css).replace("<!-- html -->", injectionHtml);
        let puppeteerArgs = {args: ["--no-sandbox"], executablePath: CHROMIUM_PATH};
        let image = await htmlToImage({html, waitUntil: "networkidle0", puppeteerArgs}) as Buffer;
        return image;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

}