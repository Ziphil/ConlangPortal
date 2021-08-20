//

import axios from "axios";
import {
  action,
  observable
} from "mobx";
import {
  LANGUAGES
} from "/client/language";


export class GlobalStore {

  @observable
  public locale: string = "";

  @observable
  public messages: Record<string, string> = {};

  @observable
  public user: any | null = null;

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
    let response = await axios.post("/", {}, {validateStatus: () => true});
    if (response.status === 200) {
      let user = response.data;
      this.user = user;
    } else {
      this.user = null;
    }
  }

}