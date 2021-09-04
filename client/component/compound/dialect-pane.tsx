//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  Link
} from "react-router-dom";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Dialect
} from "/client/skeleton/dialect";
import {
  CodesUtil
} from "/client/util/codes";


@style(require("./dialect-pane.scss"))
export default class DialectPane extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    makeLink: true,
    showApproveButton: false
  };

  private async approveDialect(): Promise<void> {
    let codes = this.props.dialect.codes;
    let response = await this.request("approveDialect", {codes});
    if (response.status === 200) {
      console.log("approved");
      if (this.props.onApprove) {
        this.props.onApprove();
      }
    }
  }

  public render(): ReactNode {
    let dialect = this.props.dialect;
    let path = "/cla/" + CodesUtil.toCodePath(dialect.codes);
    let evidenceNode = (this.props.showApproveButton && !dialect.approved && !!dialect.evidence) && (
      <div styleName="evidence">
        {dialect.evidence}
      </div>
    );
    let buttonNode = (this.props.showApproveButton) && (
      <div styleName="button">
        <Button iconLabel="&#xF164;" label={this.trans("dialectPane.approve")} onClick={this.approveDialect.bind(this)}/>
      </div>
    );
    let innerNode = (
      <Fragment>
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
          {buttonNode}
        </div>
      </Fragment>
    );
    if (this.props.makeLink) {
      let node = (
        <Link styleName="root link" to={path}>
          {innerNode}
        </Link>
      );
      return node;
    } else {
      let node = (
        <div styleName="root">
          {innerNode}
        </div>
      );
      return node;
    }
  }

}


type Props = {
  dialect: Dialect,
  makeLink: boolean,
  showApproveButton: boolean,
  onApprove?: () => void,
};
type DefaultProps = {
  makeLink: boolean,
  showApproveButton: boolean
};
type State = {
};