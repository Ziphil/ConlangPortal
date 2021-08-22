//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import DialectList from "/client/component/compound/dialect-list";
import LoginForm from "/client/component/compound/login-form";
import RegisterForm from "/client/component/compound/register-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./top-page.scss"))
export default class TopPage extends Component<Props, State> {

  public render(): ReactNode {
    let formNode = (this.props.store!.user === null) && (
      <div styleName="form-list">
        <div styleName="form">
          <div styleName="head">{this.trans("topPage.login")}</div>
          <LoginForm/>
        </div>
        <div styleName="form">
          <div styleName="head">{this.trans("topPage.register")}</div>
          <RegisterForm/>
        </div>
      </div>
    );
    let node = (
      <Page>
        {formNode}
        <div styleName="pane">
          <div styleName="caution">
            {this.trans("topPage.caution")}
          </div>
          <DialectList/>
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