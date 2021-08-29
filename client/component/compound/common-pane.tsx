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
    let titleNode = (this.props.title !== undefined) && (
      <div styleName="title">{this.props.title}</div>
    );
    let node = (
      <div styleName="root">
        {titleNode}
        <div>
          {this.props.children}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  title?: string
};
type State = {
};