//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./about-page.scss"))
export default class AboutPage extends Component<Props, State> {

  private renderString(string: string): ReactNode {
    let node = string.split(/\s*---\s*/).map((string, index) => <div styleName="paragraph" key={index}>{string}</div>);
    return node;
  }

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="head">{this.trans("aboutPage.aboutSite.head")}</div>
        <div>
          {this.renderString(this.trans("aboutPage.aboutSite.content"))}
        </div>
        <div styleName="head">{this.trans("aboutPage.aboutCode.head")}</div>
        <div>
          {this.renderString(this.trans("aboutPage.aboutCode.content"))}
        </div>
        <div styleName="head">{this.trans("aboutPage.applicationProcess.head")}</div>
        <div>
          {this.renderString(this.trans("aboutPage.applicationProcess.content"))}
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};