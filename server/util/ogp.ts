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

  // サムネイル用の画像データを生成します。
  // HTML をヘッドレス Chrome で描画して画像を生成するという実装になっており、さらに Google Fonts からフォントをダウンロードする必要もあるので、少し時間がかかります。
  // 別のより高速なフォント生成方法を考えた方が良い気がしますし、そもそも HTML をソースコード中に直接書くのはどう考えても頭が悪いので、何とかしてください。
  public static async createEntryImage(codePath: string): Promise<Buffer | null> {
    if (CodesUtil.isValidCodePath(codePath)) {
      let codes = CodesUtil.fromCodePath(codePath);
      let rawEntry = await EntryUtil.fetchOneByCodes(codes);
      let entry = (rawEntry !== null) ? EntrySkeletonStatic.create(await EntryCreator.create(rawEntry)) : null;
      if (entry !== null) {
        let nameArray = entry.getNameArray();
        let mainNameString = nameArray[0] ?? "";
        let restNameString = ((nameArray.length >= 2) ? "« " : "") + nameArray.slice(1).join(" « ");
        let html = `
          <html>
            <head>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@700&family=Nunito:ital,wght@0,700;0,900;1,900&display=swap" rel="stylesheet">
              <style>
                html, body {
                  width: 1200px; height: 630px;
                  margin: 0px; padding: 0px;
                  font-size: 63px;
                  background:
                    linear-gradient(90deg, hsl(275, 40%, 50%), hsla(275, 40%, 50%, 0) 80%), linear-gradient(270deg, hsl(275, 40%, 50%), hsla(275, 40%, 50%, 0) 80%),
                    linear-gradient(210deg, hsl(320, 40%, 50%), hsla(320, 40%, 50%, 0) 80%), linear-gradient(30deg, hsl(230, 40%, 50%), hsla(230, 40%, 50%, 0) 80%);
                }
                .main {
                  height: 100%;
                  padding: 0.6rem 0.8rem 0.8rem 0.8rem;
                  display: flex; flex-direction: column;
                  box-sizing: border-box;
                }
                .code {
                  font-family: "Nunito", sans-serif;
                  font-size: 0.8rem; font-weight: 900; font-style: italic;
                  color: hsl(275, 50%, 95%);
                  flex-grow: 0;
                }
                .box {
                  margin-top: 0.2rem;
                  border-radius: 0.3rem;
                  background-color: hsl(275, 50%, 95%);
                  flex-grow: 1;
                  display: flex; flex-direction: column;
                }
                .name-container {
                  padding: 0rem 1rem;
                  font-family: "Nunito", "M PLUS Rounded 1c", sans-serif;
                  font-size: 0.5rem; font-weight: bold;
                  color: hsl(275, 50%, 20%);
                  flex-grow: 1;
                  display: flex; flex-direction: column; justify-content: center;
                }
                .main-name {
                  font-size: 1.5rem;
                }
                .rest-name {
                  font-size: 0.8rem;
                }
                .title {
                  margin: -0.2rem 0.5rem 0.2rem 0rem;
                  font-family: "Nunito", sans-serif;
                  font-size: 0.5rem; font-weight: 900;
                  color: hsl(275, 40%, 50%);
                  text-align: right;
                }
              </style>
            </head>
            <body>
              <div class="main">
                <div class="code">${CodesUtil.toNormalizedForm(entry.codes)}</div>
                <div class="box">
                  <div class="name-container">
                    <div class="main-name">${ClientOgpUtil.escapeHtml(mainNameString)}</div>
                    <div class="rest-name">${ClientOgpUtil.escapeHtml(restNameString)}</div>
                  </div>
                  <div class="title">Language Portal</div>
                </div>
              </div>
            </body>
          </html>
        `;
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