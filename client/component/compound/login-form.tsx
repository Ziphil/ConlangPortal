//

import * as react from "react";
import {
  ReactNode
} from "react";
import Input from "/client/component/atom/input";
import Component from "/client/component/component";
import ErrorPane from "/client/component/compound/error-pane";
import {
  style
} from "/client/component/decorator";


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
      this.replacePath(`/cla/${code}`);
    } else {
      console.log("login failed");
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
        {errorPane}
        <div styleName="form-container">
          <div styleName="form">
            <Input label={this.trans("loginForm.code")} value={this.state.code} onSet={(code) => this.setState({code})}/>
            <Input type="password" label={this.trans("loginForm.password")} value={this.state.password} onSet={(password) => this.setState({password})}/>
            <input type="button" value={this.trans("loginForm.confirm")} onClick={this.performLogin.bind(this)}/>
          </div>
        </div>
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