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
    let includeOptions = this.props.includeOptions;
    let response = await this.request("fetchDialects", {includeOptions});
    if (response.status === 200) {
      let dialects = response.data;
      this.setState({dialects});
    }
  }

  public render(): ReactNode {
    let rowNodes = this.state.dialects.map((dialect, index) => {
      let rowNode = (
        <DialectPane key={index} dialect={dialect} showApproveButton={this.props.includeOptions?.unapproved ?? false}/>
      );
      return rowNode;
    });
    let node = (
      <div styleName="root">
        <CommonPane title={this.props.title}>
          {rowNodes}
        </CommonPane>
      </div>
    );
    return node;
  }

}


type Props = {
  title: string,
  includeOptions?: {approved: boolean, unapproved: boolean}
};
type State = {
  dialects: Array<Dialect>
};