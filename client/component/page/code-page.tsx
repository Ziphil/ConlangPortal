//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Component from "/client/component/component";
import AddEntryForm from "/client/component/compound/add-entry-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  Entry,
  EntryCodes
} from "/client/skeleton/entry";


@style(require("./code-page.scss"))
export default class CodePage extends Component<Props, State, Params> {

  public state: State = {
    codes: null,
    entry: null
  };

  public async componentDidMount(): Promise<void> {
    this.fetchCodes();
    await this.fetchEntry();
  }

  public fetchCodes(): void {
    let codeString = this.props.match!.params.codeString;
    let codes = CodePage.createCodes(codeString);
    this.setState({codes});
  }

  public async fetchEntry(): Promise<void> {
    let codeString = this.props.match!.params.codeString;
    let codes = CodePage.createCodes(codeString);
    let response = await this.request("fetchEntry", {codes});
    let entry = response.data;
    if (response.status === 200) {
      if (entry !== null) {
        this.setState({entry});
      }
    }
  }

  public renderCreateCodeForm(): ReactNode {
    let codes = this.props.match!.params.codeString.split("-");
    if (codes.length === 1) {
      let node = (
        <AddEntryForm userCode={codes[0]}/>
      );
      return node;
    } else {
      return null;
    }
  }

  public render(): ReactNode {
    let codeString = this.props.match!.params.codeString;
    let entry = this.state.entry as any;
    if (entry !== null) {
      let codeArray = codeString.split("-");
      let nameArray = ("name" in entry) ? [entry.name] : [entry.names.dialect, entry.names.language, entry.names.family, entry.names.user].filter((name) => name !== undefined);
      let restCodeNodes = codeArray.slice(1).map((code, index) => {
        let restCodeNode = (
          <Fragment key={index}>
            <div styleName="slash"/>
            <div styleName="code">{code}</div>
          </Fragment>
        );
        return restCodeNode;
      });
      let restNameNodes = nameArray.slice(1).map((name, index) => {
        let restNameNode = (
          <Fragment key={index}>
            <span styleName="arrow"/>
            <span styleName="name">{name}</span>
          </Fragment>
        );
        return restNameNode;
      });
      let node = (
        <Page>
          <div styleName="pane">
            <div styleName="head">
              <div styleName="left">
                <div styleName="main-code">{codeArray[0]}</div>
              </div>
              <div styleName="right">
                <div styleName="right-top">
                  <div styleName="rest-code">
                    {restCodeNodes}
                  </div>
                  <div styleName="separator"/>
                  <div styleName="kind">方言</div>
                </div>
                <div styleName="right-bottom">
                  <div styleName="main-name">{nameArray[0]}</div>
                  <div styleName="rest-name">
                    {restNameNodes}
                  </div>
                </div>
              </div>
            </div>
            <div styleName="content">
              (ここに様々なプロパティが入る)
            </div>
          </div>
          {this.renderCreateCodeForm()}
        </Page>
      );
      return node;
    } else {
      return "no such code";
    }
  }

  public static createCodes(codeString: string): EntryCodes {
    let codeArray = codeString.split("-").reverse();
    let codes = {} as any;
    if (codeArray.length >= 1) {
      codes.user = codeArray[0];
    }
    if (codeArray.length >= 2) {
      codes.family = codeArray[1] || "*";
    }
    if (codeArray.length >= 3) {
      codes.language = codeArray[2];
    }
    if (codeArray.length >= 4) {
      codes.dialect = codeArray[3] || "*";
    }
    return codes;
  }

}


type Props = {
};
type State = {
  codes: EntryCodes | null,
  entry: Entry | null
};
type Params = {
  codeString: string
};