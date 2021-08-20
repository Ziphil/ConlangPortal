//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./register-form.scss"))
export default class RegisterForm extends Component<Props, State> {

  public state: State = {
    code: "",
    email: "",
    password: ""
  };

  public componentDidMount(): void {
    let name = this.props.location!.state?.name;
    let password = this.props.location!.state?.password;
    if (name !== undefined && password !== undefined) {
      this.setState({code: name, password});
    }
  }

  private async performRegister(): Promise<void> {
    let code = this.state.code;
    let password = this.state.password;
    let response = await this.request("registerUser", {code, password});
    let body = response.data;
    if (response.status === 200) {
      let loginResponse = await this.login({code, password});
      if (loginResponse.status === 200) {
        console.log("login successful");
        this.replacePath(`/cla/${code}`);
      } else {
        console.log("login failed");
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <div>register</div>
        <input value={this.state.code} onChange={(event) => this.setState({code: event.target.value})}/>
        <input value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
        <input type="button" onClick={this.performRegister.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
  code: string,
  email: string,
  password: string
};