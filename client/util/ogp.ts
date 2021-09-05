//

import {
  Entry,
  EntryCodes
} from "/client/skeleton/entry";
import {
  CodesUtil
} from "/client/util/codes";


export class OgpUtil {

  public static createMetaHtml(entry: Entry | null, codes: EntryCodes, fullUrl: string): string {
    let html = this.createDefaultMetaHtml(fullUrl);
    if (entry !== null) {
      let title = `${entry.name} [${CodesUtil.toNormalizedForm(entry.codes)}]`;
      html += `<meta property="og:title" content="${this.escapeHtml(title)}">`;
      html += `<meta property="og:description" content="${this.escapeHtml(title)}">`;
    } else {
      let title = `Unregistered [${CodesUtil.toNormalizedForm(codes)}]`;
      html += `<meta property="og:title" content="${this.escapeHtml(title)}">`;
      html += `<meta property="og:description" content="${this.escapeHtml(title)}">`;
    }
    return html;
  }

  public static createDefaultMetaHtml(fullUrl: string): string {
    let html = "";
    html += `<meta property="og:url" content="${fullUrl}">`;
    html += `<meta property="og:type" content="article">`;
    html += `<meta property="og:site_name" content="Conlang Portal">`;
    return html;
  }

  public static createTitle(entry: Entry | null): string {
    let defaultTitle = this.createDefaultTitle();
    if (entry !== null) {
      return `${entry.name} [${CodesUtil.toNormalizedForm(entry.codes)}] — ${defaultTitle}`;
    } else {
      return defaultTitle;
    }
  }

  public static createDefaultTitle(): string {
    return "Conlang Portal";
  }

  public static escapeHtml(string: string): string {
    let escapedString = string.replace(/[<>&"]/g, (match) => {
      if (match === "<") {
        return "&lt;";
      } else if (match === ">") {
        return "&gt;";
      } else if (match === "&") {
        return "&amp;";
      } else if (match === "\"") {
        return "&quot;";
      } else {
        return "";
      }
    });
    return escapedString;
  }

}