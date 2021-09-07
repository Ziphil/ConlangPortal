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

  public static defaultProps: DefaultProps = {
    onlyUser: false,
    makeLink: true,
    showApproveButton: false
  };
  public state: State = {
    dialects: []
  };

  public async componentDidMount(): Promise<void> {
    await this.fetchDialects();
  }

  private async fetchDialects(): Promise<void> {
    let user = this.props.store!.user;
    let creatorCode = (this.props.onlyUser) ? user?.code ?? "dummy" : undefined;
    let includeOptions = this.props.includeOptions;
    let response = await this.request("fetchDialects", {creatorCode, includeOptions});
    if (response.status === 200) {
      let dialects = response.data.map(Dialect.create);
      this.setState({dialects});
    }
  }

  public render(): ReactNode {
    let rowNodes = this.state.dialects.map((dialect, index) => {
      let rowNode = (
        <DialectPane
          key={index}
          dialect={dialect}
          makeLink={this.props.makeLink}
          showApproveButton={this.props.showApproveButton}
          onApprove={this.fetchDialects.bind(this)}
        />
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
  includeOptions?: {approved: boolean, unapproved: boolean},
  onlyUser: boolean,
  makeLink: boolean,
  showApproveButton: boolean
};
type DefaultProps = {
  onlyUser: boolean,
  makeLink: boolean,
  showApproveButton: boolean
};
type State = {
  dialects: Array<Dialect>
};