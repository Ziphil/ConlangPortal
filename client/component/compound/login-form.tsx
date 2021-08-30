//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import CommonPane from "/client/component/compound/common-pane";
import ErrorPane from "/client/component/compound/error-pane";
import {
  style
} from "/client/component/decorator";
import {
  CodesUtil
} from "/client/util/codes";


@style(require("./login-form.scss"))
export default class LoginForm extends Component<Props, State> {

  public state: State = {
    code: "",
    password: "",
    errorType: null
  };

  private async performLogin(): Promise<void> {
    let code = this.state.code;
    let password = this.state.password;
    let response = await this.login({code, password});
    if (response.status === 200) {
      console.log("login successful");
      let path = "/cla/" + CodesUtil.toCodePath({user: code});
      this.replacePath(path);
    } else {
      this.setState({errorType: "loginFailed"});
    }
  }

  public render(): ReactNode {
    let errorPane = (this.state.errorType !== null) && (
      <div styleName="error">
        <ErrorPane type={this.state.errorType}/>
      </div>
    );
    let node = (
      <form styleName="root">
        <CommonPane title={this.trans("loginForm.title")}>
          <div styleName="spacer">
            {errorPane}
            <div styleName="form-container">
              <div styleName="form">
                <Input label={this.trans("loginForm.code")} value={this.state.code} onSet={(code) => this.setState({code})}/>
                <Input type="password" label={this.trans("loginForm.password")} value={this.state.password} onSet={(password) => this.setState({password})}/>
              </div>
              <div styleName="button">
                <Button label={this.trans("loginForm.confirm")} reactive={true} onClick={this.performLogin.bind(this)}/>
              </div>
            </div>
          </div>
        </CommonPane>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
  code: string,
  password: string,
  errorType: string | null
};