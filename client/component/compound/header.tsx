//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "react-router-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./header.scss"))
export default class Header extends Component<Props, State> {

  private async performLogout(): Promise<void> {
    let response = await this.logout();
    if (response.status === 200) {
      this.pushPath("/");
    }
  }

  private async jumpUserPage(): Promise<void> {
    let user = this.props.store!.user;
    this.pushPath(`/cla/${user.code}`);
  }

  public render(): ReactNode {
    let user = this.props.store!.user;
    let userNameNode = (user !== null) && (
      <div styleName="user">
        <div styleName="item" onClick={this.performLogout.bind(this)}>ログアウト</div>
        <div styleName="item" onClick={this.jumpUserPage.bind(this)}>ユーザーページ</div>
      </div>
    );
    let node = (
      <header styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="title">
              <Link to="/">Conlang Portal</Link>
            </div>
          </div>
          <div styleName="right">
            {userNameNode}
          </div>
        </div>
      </header>
    );
    return node;
  }

}


type Props = {
};
type State = {
};