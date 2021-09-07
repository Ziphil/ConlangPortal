//

import axios from "axios";
import {
  Jsonify
} from "jsonify-type";
import {
  action,
  observable
} from "mobx";
import {
  LANGUAGES
} from "/client/language";
import {
  Creator
} from "/client/skeleton/creator";
import {
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


export class GlobalStore {

  @observable
  public locale: string = "";

  @observable
  public messages: Record<string, string> = {};

  @observable
  public user: Jsonify<Creator> | null = null;

  @action
  public async changeLocale(locale: string): Promise<void> {
    let language = LANGUAGES.find((language) => language.locale === locale) ?? LANGUAGES[0];
    this.locale = locale;
    this.messages = await language.fetchMessages().then((module) => module.default);
    localStorage.setItem("locale", locale);
  }

  @action
  public async defaultLocale(): Promise<void> {
    let locale = localStorage.getItem("locale") ?? "ja";
    this.changeLocale(locale);
  }

  @action
  public async fetchUser(): Promise<void> {
    let url = SERVER_PATH_PREFIX + SERVER_PATHS["fetchUser"];
    let response = await axios.post(url, {}, {validateStatus: () => true});
    if (response.status === 200) {
      let user = response.data;
      this.user = user;
    } else {
      this.user = null;
    }
  }

}