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
      let description = entry.getNameArray().join(" « ");
      html += `<meta property="og:title" content="${this.escapeHtml(title)}">`;
      html += `<meta property="og:description" content="${this.escapeHtml(description)}">`;
      html += `<meta property="og:image" content="https://conlang-portal.herokuapp.com/api/cla/image/${CodesUtil.toCodePath(codes)}">`;
      html += `<meta name="twitter:card" content="summary_large_image">`;
    } else {
      let title = `Unregistered [${CodesUtil.toNormalizedForm(codes)}]`;
      let description = "Unregistered";
      html += `<meta property="og:title" content="${this.escapeHtml(title)}">`;
      html += `<meta property="og:description" content="${this.escapeHtml(description)}">`;
    }
    return html;
  }

  public static createDefaultMetaHtml(fullUrl: string): string {
    let html = "";
    html += `<head prefix="og: http://ogp.me/ns#">`;
    html += `<meta property="og:url" content="${this.escapeHtml(fullUrl)}">`;
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