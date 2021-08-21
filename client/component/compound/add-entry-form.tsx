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
import {
  DialectCodes
} from "/client/skeleton/dialect";


@style(require("./add-entry-form.scss"))
export default class AddEntryForm extends Component<Props, State> {

  public state: State = {
    familyCode: "",
    languageCode: "",
    dialectCode: "",
    familyName: "",
    languageName: "",
    dialectName: "",
    familyUnspecified: true,
    dialectUnspecified: true,
    familyFetching: false,
    languageFetching: false,
    errorType: null
  };

  private async handleClick(): Promise<void> {
    let codes = {
      user: this.props.userCode,
      family: (this.state.familyUnspecified) ? "~" : this.state.familyCode,
      language: this.state.languageCode,
      dialect: (this.state.dialectUnspecified) ? "~" : this.state.dialectCode
    };
    let names = {
      family: (this.state.familyUnspecified) ? "" : this.state.familyName,
      language: this.state.languageName,
      dialect: (this.state.dialectUnspecified) ? "" : this.state.dialectName
    };
    let response = await this.request("addEntry", {codes, names});
    if (response.status === 200) {
      console.log("entry added");
      let path = AddEntryForm.createPath(codes);
      this.pushPath(path);
    } else if (response.status === 400 && "error" in response.data) {
      let error = response.data;
      let errorType = error.type;
      this.setState({errorType});
    }
  }

  private async handleFamilyCodeSet(familyCode: string): Promise<void> {
    this.setState({familyCode, familyFetching: true});
    this.handleLanguageCodeSet(this.state.languageCode, familyCode);
    let codes = {
      user: this.props.userCode,
      family: (this.state.familyUnspecified) ? "~" : familyCode
    };
    let response = await this.request("fetchEntryName", {codes});
    if (response.status === 200) {
      let familyName = response.data;
      if (familyName !== null) {
        this.setState({familyName});
      } else {
        this.setState({familyFetching: false});
      }
    }
  }

  private async handleLanguageCodeSet(languageCode: string, familyCode?: string): Promise<void> {
    this.setState({languageCode, languageFetching: true});
    let codes = {
      user: this.props.userCode,
      family: (this.state.familyUnspecified) ? "~" : familyCode ?? this.state.familyCode,
      language: languageCode
    };
    let response = await this.request("fetchEntryName", {codes});
    if (response.status === 200) {
      let languageName = response.data;
      if (languageName !== null) {
        this.setState({languageName});
      } else {
        this.setState({languageFetching: false});
      }
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
        <div styleName="item-list">
          <div styleName="item">
            <div styleName="head">{this.trans("addEntryForm.family.head")}</div>
            <div>
              <div styleName="explanation">{this.trans("addEntryForm.family.explanation")}</div>
              <div styleName="form">
                <Input
                  label={this.trans("addEntryForm.family.code")}
                  value={this.state.familyCode}
                  disabled={this.state.familyUnspecified}
                  onSet={this.handleFamilyCodeSet.bind(this)}/>
                <Input
                  label={this.trans("addEntryForm.family.name")}
                  value={this.state.familyName}
                  disabled={this.state.familyFetching || this.state.familyUnspecified}
                  onSet={(familyName) => this.setState({familyName})}
                />
              </div>
              <div styleName="checkbox">
                <label>
                  <input type="checkbox" checked={this.state.familyUnspecified} onChange={(event) => this.setState({familyUnspecified: event.target.checked})}/>
                  {this.trans("addEntryForm.family.unspecified")}
                </label>
              </div>
            </div>
          </div>
          <div styleName="item">
            <div styleName="head">{this.trans("addEntryForm.language.head")}</div>
            <div>
              <div styleName="explanation">{this.trans("addEntryForm.language.explanation")}</div>
              <div styleName="form">
                <Input
                  label={this.trans("addEntryForm.language.code")}
                  value={this.state.languageCode}
                  onSet={this.handleLanguageCodeSet.bind(this)}
                />
                <Input
                  label={this.trans("addEntryForm.language.name")}
                  value={this.state.languageName}
                  disabled={this.state.languageFetching}
                  onSet={(languageName) => this.setState({languageName})}
                />
              </div>
            </div>
          </div>
          <div styleName="item">
            <div styleName="head">{this.trans("addEntryForm.dialect.head")}</div>
            <div>
              <div styleName="explanation">{this.trans("addEntryForm.dialect.explanation")}</div>
              <div styleName="form">
                <Input
                  label={this.trans("addEntryForm.dialect.code")}
                  value={this.state.dialectCode}
                  disabled={this.state.dialectUnspecified}
                  onSet={(dialectCode) => this.setState({dialectCode})}
                />
                <Input
                  label={this.trans("addEntryForm.dialect.name")}
                  value={this.state.dialectName}
                  disabled={this.state.dialectUnspecified}
                  onSet={(dialectName) => this.setState({dialectName})}
                />
              </div>
              <div styleName="checkbox">
                <label>
                  <input type="checkbox" checked={this.state.dialectUnspecified} onChange={(event) => this.setState({dialectUnspecified: event.target.checked})}/>
                  {this.trans("addEntryForm.dialect.unspecified")}
                </label>
              </div>
            </div>
          </div>
          <div styleName="item">
            <div styleName="button">
              <input type="button" value={this.trans("addEntryForm.confirm")} onClick={this.handleClick.bind(this)}/>
            </div>
            <div styleName="caution">{this.trans("addEntryForm.caution")}</div>
          </div>
        </div>
      </form>
    );
    return node;
  }

  public static createPath(codes: DialectCodes): string {
    let path = "/cla/";
    path += (codes.dialect === "~") ? "" : codes.dialect + "-";
    path += codes.language + "-";
    path += (codes.family === "~") ? "-" : codes.family + "-";
    path += codes.user;
    return path;
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
  dialectName: string,
  familyUnspecified: boolean,
  dialectUnspecified: boolean,
  familyFetching: boolean,
  languageFetching: boolean,
  errorType: string | null
};