//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import Header from "/client/component/compound/header";
import {
  style
} from "/client/component/decorator";


@style(require("./page.scss"))
export default class Page extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root" id="page">
        <Header/>
        <div styleName="spacer">
          <div styleName="content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};