//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "react-router-dom";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import CommonPane from "/client/component/compound/common-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dialect
} from "/client/skeleton/dialect";
import {
  CodesUtil
} from "/client/util/codes";


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

  private async approveDialect(dialect: Dialect): Promise<void> {
    let codes = dialect.codes;
    let response = await this.request("approveDialect", {codes});
    if (response.status === 200) {
      console.log("approved");
    }
  }

  public render(): ReactNode {
    let user = this.props.store!.user;
    let rowNodes = this.state.dialects.map((dialect, index) => {
      let path = "/cla/" + CodesUtil.toCodePath(dialect.codes);
      let evidenceNode = (!this.props.approved && user?.administrator && !dialect.approved && !!dialect.evidence) && (
        <div styleName="evidence">
          {dialect.evidence}
        </div>
      );
      let buttonNode = (!this.props.approved && user?.administrator) && (
        <div styleName="button">
          <Button iconLabel="&#xF164;" onClick={() => this.approveDialect(dialect)}/>
        </div>
      );
      let rowNode = (
        <Link styleName="item" to={path} key={index}>
          <div styleName="item-inner">
            <div styleName="code-container">
              <span styleName="code">{dialect.codes.dialect}</span>
              <span styleName="slash"/>
              <span styleName="code">{dialect.codes.language}</span>
              <span styleName="slash"/>
              <span styleName="code">{dialect.codes.family}</span>
              <span styleName="slash"/>
              <span styleName="code">{dialect.codes.user}</span>
            </div>
            <div styleName="name-container">
              <span styleName="name">{(dialect.codes.dialect === "~") ? "—" : dialect.names.dialect}</span>
              <span styleName="arrow"/>
              <span styleName="name">{dialect.names.language}</span>
              <span styleName="arrow"/>
              <span styleName="name">{(dialect.codes.family === "~") ? "—" : dialect.names.family}</span>
              <span styleName="arrow"/>
              <span styleName="name">{dialect.names.user}</span>
            </div>
            {evidenceNode}
          </div>
          {buttonNode}
        </Link>
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