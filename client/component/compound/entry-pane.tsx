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
import DialectInformationList from "/client/component/compound/information-list/dialect-information-list";
import FamilyInformationList from "/client/component/compound/information-list/family-information-list";
import LanguageInformationList from "/client/component/compound/information-list/language-information-list";
import UserInformationList from "/client/component/compound/information-list/user-information-list";
import {
  style
} from "/client/component/decorator";
import {
  Entry,
  EntryCodes,
  EntryUtil
} from "/client/skeleton/entry";
import {
  CodesUtil
} from "/client/util/codes";


@style(require("./entry-pane.scss"))
export default class EntryPane extends Component<Props, State, Params> {

  public state: State = {
    entry: null,
    found: null
  };

  public async componentDidMount(): Promise<void> {
    await this.fetchEntry();
  }

  public async componentDidUpdate(previousProps: any): Promise<void> {
    if (this.props.codes !== previousProps.codes) {
      this.setState({found: null, entry: null});
      await this.fetchEntry();
    }
  }

  private async fetchEntry(): Promise<void> {
    let codes = this.props.codes;
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

  private async changeInformations(key: string, value: any): Promise<void> {
    let entry = this.state.entry as any;
    if (entry !== null) {
      let codes = entry.codes;
      let informations = {[key]: value};
      let response = await this.request("changeEntryInformations", {codes, informations});
      if (response.status === 200) {
        entry[key] = value;
        if (key === "name") {
          let kind = CodesUtil.getKind(codes);
          entry.names[kind] = value;
        }
        this.setState({entry});
      }
    }
  }

  private renderHead(): ReactNode {
    let codes = this.props.codes as any;
    let codeArray = [codes.dialect, codes.language, codes.family, codes.user].filter((name) => name !== undefined);
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
        let nameArray = [entry.names.dialect, entry.names.language, entry.names.family, entry.names.user].filter((name) => name !== undefined);
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
        <div styleName="kind">{this.trans(`codePage.${CodesUtil.getKind(codes)}`)}</div>
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

  private renderInformationList(): ReactNode {
    let entry = this.state.entry;
    if (entry !== null) {
      let editable = this.props.store!.user?.code === entry.codes.user;
      if (EntryUtil.is(entry, "dialect")) {
        return <DialectInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      } else if (EntryUtil.is(entry, "language")) {
        return <LanguageInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      } else if (EntryUtil.is(entry, "family")) {
        return <FamilyInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      } else {
        return <UserInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      }
    }
  }

  public render(): ReactNode {
    let editable = this.state.entry !== null && this.props.store!.user?.code === this.state.entry.codes.user;
    let headNode = this.renderHead();
    let informationList = (this.state.found === null) ? "" : (this.state.found) ? this.renderInformationList() : this.trans("codePage.notFound");
    let guideNode = (editable) && (
      <div styleName="guide">{this.trans("entryPane.guide")}</div>
    );
    let node = (
      <div styleName="root">
        {headNode}
        {guideNode}
        {informationList}
      </div>
    );
    return node;
  }

}


type Props = {
  codes: EntryCodes
};
type State = {
  entry: Entry | null,
  found: boolean | null
};
type Params = {
};