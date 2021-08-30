//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./error-pane.scss"))
export default class ErrorPane extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="message">
          {this.trans(`error.${this.props.type}`)}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  type: string
};
type State = {
};