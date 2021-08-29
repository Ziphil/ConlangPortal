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


@style(require("./register-form.scss"))
export default class RegisterForm extends Component<Props, State> {

  public state: State = {
    code: "",
    name: "",
    password: "",
    errorType: null
  };

  private async performRegister(): Promise<void> {
    let code = this.state.code;
    let name = this.state.name;
    let password = this.state.password;
    let response = await this.request("registerUser", {code, name, password});
    if (response.status === 200) {
      let loginResponse = await this.login({code, password});
      if (loginResponse.status === 200) {
        let path = "/cla/" + CodesUtil.toCodePath({user: code});
        this.replacePath(path);
      } else {
        console.log("login failed");
      }
    } else if (response.status === 400 && "error" in response.data) {
      let error = response.data;
      let errorType = error.type;
      this.setState({errorType});
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
        <CommonPane title={this.trans("registerForm.title")}>
          <div styleName="spacer">
            {errorPane}
            <div styleName="form-container">
              <div styleName="explanation">{this.trans("registerForm.explanation")}</div>
              <div styleName="form">
                <Input label={this.trans("registerForm.code")} value={this.state.code} onSet={(code) => this.setState({code})}/>
                <Input label={this.trans("registerForm.name")} value={this.state.name} onSet={(name) => this.setState({name})}/>
                <Input type="password" label={this.trans("registerForm.password")} value={this.state.password} onSet={(password) => this.setState({password})}/>
                <Button label={this.trans("registerForm.confirm")} reactive={true} onClick={this.performRegister.bind(this)}/>
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
  name: string,
  password: string,
  errorType: string | null
};