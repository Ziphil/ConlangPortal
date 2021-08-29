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
      <Link to={`/cla/${this.props.store!.user?.code}`}>
        <div styleName="circle">
          <div styleName="icon">&#xF007;</div>
          <div styleName="label">{this.trans("topPage.userPage")}</div>
        </div>
      </Link>
    );
    let loginNode = (
      <Link to="/login">
        <div styleName="circle">
          <div styleName="icon">&#xF2F6;</div>
          <div styleName="label">{this.trans("topPage.login")}</div>
        </div>
      </Link>
    );
    let node = (
      <Page>
        <div styleName="circle-list">
          <Link to="/about">
            <div styleName="circle">
              <div styleName="icon">&#xF128;</div>
              <div styleName="label">{this.trans("topPage.about")}</div>
            </div>
          </Link>
          {(this.props.store!.user !== null) ? userPageNode : loginNode}
        </div>
        <div styleName="list">
          <DialectList approved={true}/>
        </div>
        <div styleName="list">
          <DialectList approved={false}/>
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