//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "react-router-dom";
import Component from "/client/component/component";
import DialectList from "/client/component/compound/dialect-list";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./top-page.scss"))
export default class TopPage extends Component<Props, State> {

  public render(): ReactNode {
    let userPageNode = (
      <Link styleName="circle" to={`/cla/${this.props.store!.user?.code}`}>
        <div styleName="icon">&#xF007;</div>
        <div styleName="label">{this.trans("topPage.userPage")}</div>
      </Link>
    );
    let loginNode = (
      <Link styleName="circle" to="/login">
        <div styleName="icon">&#xF2F6;</div>
        <div styleName="label">{this.trans("topPage.login")}</div>
      </Link>
    );
    let node = (
      <Page>
        <div styleName="circle-list">
          <Link styleName="circle" to="/about">
            <div styleName="icon">&#xF128;</div>
            <div styleName="label">{this.trans("topPage.about")}</div>
          </Link>
          {(this.props.store!.user !== null) ? userPageNode : loginNode}
        </div>
        <div styleName="list">
          <DialectList title={this.trans("topPage.approvedList")} includeOptions={{approved: true, unapproved: false}}/>
        </div>
        <div styleName="list">
          <DialectList title={this.trans("topPage.unapprovedList")} includeOptions={{approved: false, unapproved: true}}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};