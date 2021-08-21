//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  Dialect
} from "/client/skeleton/dialect";


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
    let rowNodes = this.state.dialects.map((dialect) => {
      let rowNode = (
        <div styleName="row">
          <div styleName="code-cell">
            <span styleName="code">{dialect.codes.dialect}</span>
            <span styleName="slash"/>
            <span styleName="code">{dialect.codes.language}</span>
            <span styleName="slash"/>
            <span styleName="code">{dialect.codes.family}</span>
            <span styleName="slash"/>
            <span styleName="code">{dialect.codes.user}</span>
          </div>
          <div styleName="name-cell">
            <span styleName="name">{dialect.names.dialect || "—"}</span>
            <span styleName="arrow"/>
            <span styleName="name">{dialect.names.language || "—"}</span>
            <span styleName="arrow"/>
            <span styleName="name">{dialect.names.family || "—"}</span>
            <span styleName="arrow"/>
            <span styleName="name">{dialect.names.user || "—"}</span>
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