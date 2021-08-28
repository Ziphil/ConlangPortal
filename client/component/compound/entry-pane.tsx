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
import {
  style
} from "/client/component/decorator";
import {
  Entry,
  EntryCodes
} from "/client/skeleton/entry";


@style(require("./entry-pane.scss"))
export default class EntryPane extends Component<Props, State, Params> {

  private renderHead(): ReactNode {
    let codes = this.props.codes as any;
    let codeArray = [codes.dialect, codes.language, codes.family, codes.user].filter((name) => name !== undefined);
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
      let entry = this.props.entry as any;
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

  public render(): ReactNode {
    let headNode = this.renderHead();
    let contentString = (this.props.found === null) ? "" : (this.props.found) ? this.trans("codePage.dummy") : this.trans("codePage.notFound");
    let node = (
      <div styleName="root">
        {headNode}
        <div styleName="content">
          {contentString}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  entry: Entry | null,
  codes: EntryCodes,
  found: boolean | null
};
type State = {
};
type Params = {
};