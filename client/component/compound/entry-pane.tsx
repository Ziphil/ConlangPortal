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
import CommonPane from "/client/component/compound/common-pane";
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
  EntryStatic
} from "/client/skeleton/entry";
import {
  CodesUtil
} from "/client/util/codes";
import {
  OgpUtil
} from "/client/util/ogp";


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
      document.title = OgpUtil.createDefaultTitle();
      this.setState({found: null, entry: null});
      await this.fetchEntry();
    }
  }

  private async fetchEntry(): Promise<void> {
    let codes = this.props.codes;
    let response = await this.request("fetchEntry", {codes});
    if (response.status === 200) {
      let entry = (response.data !== null) ? EntryStatic.create(response.data) : null;
      document.title = OgpUtil.createTitle(entry);
      if (entry !== null) {
        this.setState({found: true, entry});
      } else {
        this.setState({found: false, entry: null});
      }
    }
  }

  private async changeInformations(key: string, value: any): Promise<void> {
    let entry = this.state.entry;
    if (entry !== null) {
      let codes = entry.codes;
      let informations = {[key]: value};
      let response = await this.request("changeEntryInformations", {codes, informations});
      if (response.status === 200) {
        entry.changeInformations(informations);
        this.setState({entry});
      }
    }
  }

  private renderHeadMainCode(): ReactNode {
    let codes = this.props.codes as any;
    let codeArray = [codes.dialect, codes.language, codes.family, codes.user].filter((name) => name !== undefined);
    let markNode = (this.state.entry?.approved) && <div styleName="mark"/>;
    let node = (
      <div styleName="left-inner">
        <div styleName="main-code">{codeArray[0]}</div>
        {markNode}
      </div>
    );
    return node;
  }

  private renderHeadRightTop(): ReactNode {
    let codes = this.props.codes;
    let ancestorCodes = CodesUtil.getAncestorCodes(codes);
    let restCodeInnerNodes = ancestorCodes.map((codes, index) => {
      let path = "/cla/" + CodesUtil.toCodePath(codes);
      let topCode = CodesUtil.toCodeArray(codes)[0];
      let restCodeInnerNode = (
        <Fragment key={index}>
          <span styleName="slash"/>
          <Link styleName="code" to={path}>{topCode}</Link>
        </Fragment>
      );
      return restCodeInnerNode;
    });
    let restCodeNode = (restCodeInnerNodes.length > 0) && (
      <div styleName="rest-code">
        {restCodeInnerNodes}
      </div>
    );
    let node = (
      <div styleName="right-top">
        {restCodeNode}
        <div styleName="separator"/>
        <div styleName="kind">{this.trans(`entryPane.${CodesUtil.getKind(codes)}`)}</div>
      </div>
    );
    return node;
  }

  private renderHeadNames(): ReactNode {
    let entry = this.state.entry;
    if (entry !== null) {
      let nameArray = entry.getNameArray();
      let restNameNodes = nameArray.slice(1).map((name, index) => {
        let restNameNode = (
          <Fragment key={index}>
            <span styleName="arrow"/>
            <span styleName="name">{name}</span>
          </Fragment>
        );
        return restNameNode;
      });
      let nameNode = (
        <div styleName="right-bottom">
          <div styleName="main-name">{nameArray[0]}</div>
          <div styleName="rest-name">
            {restNameNodes}
          </div>
        </div>
      );
      return nameNode;
    } else {
      return null;
    }
  }

  private renderHead(): ReactNode {
    let mainCodeNode = this.renderHeadMainCode();
    let rightTopNode = this.renderHeadRightTop();
    let namesNode = this.renderHeadNames();
    let node = (
      <div styleName="head">
        <div styleName="left">
          {mainCodeNode}
        </div>
        <div styleName="right">
          {rightTopNode}
          {namesNode}
        </div>
      </div>
    );
    return node;
  }

  private renderInformationList(): ReactNode {
    let entry = this.state.entry;
    if (entry !== null) {
      let approved = entry !== null && (entry.approved || entry.kind === "user");
      let editable = approved && this.props.store!.user?.code === entry.codes.user;
      if (entry.kind === "dialect") {
        return <DialectInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      } else if (entry.kind === "language") {
        return <LanguageInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      } else if (entry.kind === "family") {
        return <FamilyInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      } else {
        return <UserInformationList entry={entry} editable={editable} onSet={this.changeInformations.bind(this)}/>;
      }
    }
  }

  private renderUnspecifiedMessage(): ReactNode {
    let node = (
      <div styleName="message">
        {this.trans("entryPane.unspecified")}
      </div>
    );
    return node;
  }

  private renderUnregisteredMessage(): ReactNode {
    let node = (
      <div styleName="message">
        {this.trans("entryPane.unregistered")}
      </div>
    );
    return node;
  }

  private renderContent(): ReactNode {
    let found = this.state.found;
    let entry = this.state.entry;
    if (found !== null) {
      if (found && entry !== null) {
        if (CodesUtil.toCodeArray(entry.codes)[0] !== "~") {
          let approved = entry !== null && (entry.approved || entry.kind === "user");
          let maybeEditable = entry !== null && this.props.store!.user?.code === entry.codes.user;
          let informationListNode = this.renderInformationList();
          let guideNode = (maybeEditable) && (
            <div styleName="guide">{this.trans(`entryPane.guide.${(approved) ? "approved" : "unapproved"}`)}</div>
          );
          let node = (
            <Fragment>
              {guideNode}
              {informationListNode}
            </Fragment>
          );
          return node;
        } else {
          return this.renderUnspecifiedMessage();
        }
      } else {
        return this.renderUnregisteredMessage();
      }
    } else {
      return null;
    }
  }

  public render(): ReactNode {
    let headNode = this.renderHead();
    let contentNode = this.renderContent();
    let node = (
      <div styleName="root">
        <CommonPane>
          {headNode}
          {contentNode}
        </CommonPane>
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