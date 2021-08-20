//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./add-entry-form.scss"))
export default class AddEntryForm extends Component<Props, State> {

  public state: State = {
    familyCode: "",
    languageCode: "",
    dialectCode: "",
    familyName: "",
    languageName: "",
    dialectName: ""
  };

  private async handleClick(): Promise<void> {
    let codes = {
      user: this.props.userCode,
      family: this.state.familyCode || null,
      language: this.state.languageCode,
      dialect: this.state.dialectCode || null
    };
    let names = {
      family: this.state.familyName,
      language: this.state.languageName,
      dialect: this.state.dialectName
    };
    let response = await this.request("addEntry", {codes, names});
    let body = response.data;
    if (response.status === 200) {
      console.log("entry added");
    }
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <div>新規コードフォーム</div>
        family:
        <input value={this.state.familyCode} onChange={(event) => this.setState({familyCode: event.target.value})}/>
        <input value={this.state.familyName} onChange={(event) => this.setState({familyName: event.target.value})}/><br/>
        language:
        <input value={this.state.languageCode} onChange={(event) => this.setState({languageCode: event.target.value})}/>
        <input value={this.state.languageName} onChange={(event) => this.setState({languageName: event.target.value})}/><br/>
        dialect:
        <input value={this.state.dialectCode} onChange={(event) => this.setState({dialectCode: event.target.value})}/>
        <input value={this.state.dialectName} onChange={(event) => this.setState({dialectName: event.target.value})}/><br/>
        <input type="button" onClick={this.handleClick.bind(this)}/>
      </form>
    );
    return node;
  }

}


type Props = {
  userCode: string
};
type State = {
  familyCode: string,
  languageCode: string,
  dialectCode: string,
  familyName: string,
  languageName: string,
  dialectName: string
};