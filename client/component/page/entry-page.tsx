//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  Link
} from "react-router-dom";
import Component from "/client/component/component";
import AddEntryForm from "/client/component/compound/add-entry-form";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  Entry
} from "/client/skeleton/entry";
import {
  CodesUtil
} from "/client/util/codes";


@style(require("./entry-page.scss"))
export default class EntryPage extends Component<Props, State, Params> {

  public state: State = {
    valid: null,
    found: null,
    entry: null
  };

  public async componentDidMount(): Promise<void> {
    this.fetchCodes();
    await this.fetchEntry();
  }

  public async componentDidUpdate(previousProps: any): Promise<void> {
    if (this.props.location!.key !== previousProps.location!.key) {
      this.setState({valid: null, found: null, entry: null});
      this.fetchCodes();
      await this.fetchEntry();
    }
  }

  public fetchCodes(): void {
    let codePath = this.props.match!.params.codePath;
    if (CodesUtil.isValidCodePath(codePath)) {
      this.setState({valid: true});
    } else {
      this.setState({valid: false});
    }
  }

  public async fetchEntry(): Promise<void> {
    let codePath = this.props.match!.params.codePath;
    let codes = CodesUtil.fromCodePath(codePath);
    let response = await this.request("fetchEntry", {codes});
    let entry = response.data;
    if (response.status === 200) {
      if (entry !== null) {
        this.setState({found: true, entry});
      } else {
        this.setState({found: false, entry: null});
      }
    }
  }

  public renderAddEntryForm(): ReactNode {
    let user = this.props.store!.user;
    let codeArray = this.props.match!.params.codePath.split("-");
    if (codeArray.length === 1 && codeArray[0] === user?.code) {
      let node = (
        <div styleName="form">
          <AddEntryForm userCode={codeArray[0]}/>
        </div>
      );
      return node;
    } else {
      return null;
    }
  }

  public renderHead(): ReactNode {
    let codePath = this.props.match!.params.codePath;
    let codeArray = codePath.split("-").map((code) => (code === "" || code === "0") ? "~" : code);
    let kind = ["user", "family", "language", "dialect"][codeArray.length - 1];
    let restCodeInnerNodes = codeArray.slice(1).map((code, index) => {
      let path = "/cla/" + codeArray.slice((code === "~") ? index + 2 : index + 1).map((code) => (code === "~") ? "0" : code).join("-");
      let restCodeInnerNode = (
        <Fragment key={index}>
          <div styleName="slash"/>
          <div styleName="code"><Link to={path}>{code}</Link></div>
        </Fragment>
      );
      return restCodeInnerNode;
    });
    let restCodeNode = (restCodeInnerNodes.length > 0) && (
      <div styleName="rest-code">
        {restCodeInnerNodes}
      </div>
    );
    let nameNode = (() => {
      let entry = this.state.entry as any;
      if (entry !== null) {
        let nameArray = ("name" in entry) ? [entry.name] : [entry.names.dialect, entry.names.language, entry.names.family, entry.names.user].filter((name) => name !== undefined);
        let restNameNodes = nameArray.slice(1).map((name, index) => {
          let restNameNode = (
            <Fragment key={index}>
              <span styleName="arrow"/>
              <span styleName="name">{(codeArray[index + 1] === "~") ? "—" : name}</span>
            </Fragment>
          );
          return restNameNode;
        });
        let nameNode = (
          <div styleName="right-bottom">
            <div styleName="main-name">{(codeArray[0] === "~") ? "—" : nameArray[0]}</div>
            <div styleName="rest-name">
              {restNameNodes}
            </div>
          </div>
        );
        return nameNode;
      } else {
        return null;
      }
    })();
    let rightTopNode = (
      <div styleName="right-top">
        {restCodeNode}
        <div styleName="separator"/>
        <div styleName="kind">{this.trans(`codePage.${kind}`)}</div>
      </div>
    );
    let node = (
      <div styleName="head">
        <div styleName="left">
          <div styleName="main-code">{codeArray[0]}</div>
        </div>
        <div styleName="right">
          {rightTopNode}
          {nameNode}
        </div>
      </div>
    );
    return node;
  }

  public renderMain(): ReactNode {
    let headNode = this.renderHead();
    let addEntryForm = this.renderAddEntryForm();
    let contentString = (this.state.found === null) ? "" : (this.state.found) ? this.trans("codePage.dummy") : this.trans("codePage.notFound");
    let node = (
      <Fragment>
        <div styleName="pane">
          {headNode}
          <div styleName="content">
            {contentString}
          </div>
        </div>
        {addEntryForm}
      </Fragment>
    );
    return node;
  }

  public render(): ReactNode {
    let valid = this.state.valid;
    if (valid !== null) {
      let innerNode = (valid) ? this.renderMain() : "invalid";
      let node = (
        <Page>
          {innerNode}
        </Page>
      );
      return node;
    } else {
      return null;
    }
  }

}


type Props = {
};
type State = {
  valid: boolean | null,
  found: boolean | null,
  entry: Entry | null
};
type Params = {
  codePath: string
};