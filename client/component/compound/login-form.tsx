//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./login-form.scss"))
export default class LoginForm extends Component<Props, State> {

  public state: State = {
    code: "",
    password: ""
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
    let node = (
      <form styleName="root">
        <div>login</div>
        <input value={this.state.code} onChange={(event) => this.setState({code: event.target.value})}/>
        <input value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
        <input type="button" onClick={this.performLogin.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
  code: string,
  password: string
};