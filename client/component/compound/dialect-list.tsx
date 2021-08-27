//

import * as react from "react";
import {
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
  Dialect
} from "/client/skeleton/dialect";
import {
  CodesUtil
} from "/client/util/codes";


@style(require("./dialect-list.scss"))
export default class DialectList extends Component<Props, State> {

  public state: State = {
    dialects: []
  };

  public async componentDidMount(): Promise<void> {
    let response = await this.request("fetchDialects", {});
    if (response.status === 200) {
      let dialects = response.data;
      this.setState({dialects});
    }
  }

  public render(): ReactNode {
    let rowNodes = this.state.dialects.map((dialect, index) => {
      let path = "/cla/" + CodesUtil.toCodePath(dialect.codes);
      let rowNode = (
        <div styleName="row" key={index}>
          <div styleName="code-cell">
            <Link to={path}>
              <span styleName="code">{dialect.codes.dialect}</span>
              <span styleName="slash"/>
              <span styleName="code">{dialect.codes.language}</span>
              <span styleName="slash"/>
              <span styleName="code">{dialect.codes.family}</span>
              <span styleName="slash"/>
              <span styleName="code">{dialect.codes.user}</span>
            </Link>
          </div>
          <div styleName="name-cell">
            <span styleName="name">{(dialect.codes.dialect === "~") ? "—" : dialect.names.dialect}</span>
            <span styleName="arrow"/>
            <span styleName="name">{dialect.names.language}</span>
            <span styleName="arrow"/>
            <span styleName="name">{(dialect.codes.family === "~") ? "—" : dialect.names.family || "—"}</span>
            <span styleName="arrow"/>
            <span styleName="name">{dialect.names.user}</span>
          </div>
        </div>
      );
      return rowNode;
    });
    let node = (
      <div styleName="root">
        {rowNodes}
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  dialects: Array<Dialect>
};