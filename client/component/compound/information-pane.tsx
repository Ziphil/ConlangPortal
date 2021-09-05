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


@style(require("./information-pane.scss"))
export default class InformationPane extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="label">{this.props.label}</div>
        <div styleName="children">
          {this.props.children}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  label: string
};
type State = {
};