//

import * as react from "react";
import {
  Fragment,
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
    let codes = this.props.match!.params.codeString.split("-");
    let names = ["何とかかんとか ABC 地方方言", "何とか XY 語", "何とか語族", "Ziphil Aleshlas"];
    let restCodeNodes = codes.slice(1).map((code) => {
      let restCodeNode = (
        <Fragment>
          <div styleName="slash"/>
          <div styleName="code">{code}</div>
        </Fragment>
      );
      return restCodeNode;
    });
    let restNameNodes = names.slice(1).map((name) => {
      let restNameNode = (
        <Fragment>
          <span styleName="arrow"/>
          <span styleName="name">{name}</span>
        </Fragment>
      );
      return restNameNode;
    });
    let node = (
      <Page>
        <div styleName="pane">
          <div styleName="head">
            <div styleName="left">
              <div styleName="main-code">{codes[0]}</div>
            </div>
            <div styleName="right">
              <div styleName="right-top">
                <div styleName="rest-code">
                  {restCodeNodes}
                </div>
                <div styleName="separator"/>
                <div styleName="kind">方言</div>
              </div>
              <div styleName="right-bottom">
                <div styleName="main-name">{names[0]}</div>
                <div styleName="rest-name">
                  {restNameNodes}
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