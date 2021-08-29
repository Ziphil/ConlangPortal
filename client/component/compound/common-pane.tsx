//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./common-pane.scss"))
export default class CommonPane extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        {this.props.children}
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};