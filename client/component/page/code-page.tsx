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


@style(require("./code-page.scss"))
export default class CodePage extends Component<Props, State, Params> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="pane">
          <div styleName="head">
            <div styleName="left">
              <div styleName="main-code">xj</div>
            </div>
            <div styleName="right">
              <div styleName="right-top">
                <div styleName="rest-code">
                  <div styleName="slash"/>
                  <div styleName="code">de</div>
                  <div styleName="slash"/>
                  <div styleName="code">kr</div>
                  <div styleName="slash"/>
                  <div styleName="code">fgh</div>
                </div>
                <div styleName="separator"/>
                <div styleName="kind">方言</div>
              </div>
              <div styleName="right-bottom">
                <div styleName="main-name">何とかかんとか ABC 地方方言</div>
                <div styleName="rest-name">
                  <span styleName="arrow"/>
                  <span styleName="name">何とか XY 語</span>
                  <span styleName="arrow"/>
                  <span styleName="name">何とか語族</span>
                  <span styleName="arrow"/>
                  <span styleName="name">Ziphil Aleshlas</span>
                </div>
              </div>
            </div>
          </div>
          <div styleName="content">
            (ここに様々なプロパティが入る)
          </div>
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
type Params = {
  codeString: string
};