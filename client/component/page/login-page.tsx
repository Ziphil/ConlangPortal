//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import LoginForm from "/client/component/compound/login-form";
import RegisterForm from "/client/component/compound/register-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./login-page.scss"))
export default class LoginPage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="form">
          <LoginForm/>
        </div>
        <div styleName="form">
          <RegisterForm/>
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