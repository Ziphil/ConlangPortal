//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import CommonPane from "/client/component/compound/common-pane";
import DialectPane from "/client/component/compound/dialect-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dialect
} from "/client/skeleton/dialect";


@style(require("./dialect-list.scss"))
export default class DialectList extends Component<Props, State> {

  public state: State = {
    dialects: []
  };

  public async componentDidMount(): Promise<void> {
    let includeOptions = {approved: this.props.approved, unapproved: !this.props.approved};
    let response = await this.request("fetchDialects", {includeOptions});
    if (response.status === 200) {
      let dialects = response.data;
      this.setState({dialects});
    }
  }

  public render(): ReactNode {
    let rowNodes = this.state.dialects.map((dialect, index) => {
      let rowNode = (
        <DialectPane key={index} dialect={dialect} approved={this.props.approved}/>
      );
      return rowNode;
    });
    let node = (
      <div styleName="root">
        <CommonPane title={this.trans(`dialectList.${(this.props.approved) ? "approved" : "unapproved"}`)}>
          {rowNodes}
        </CommonPane>
      </div>
    );
    return node;
  }

}


type Props = {
  approved: boolean
};
type State = {
  dialects: Array<Dialect>
};