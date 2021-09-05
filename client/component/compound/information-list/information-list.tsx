//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "react-router-dom";
import Component from "/client/component/component";
import InformationPane from "/client/component/compound/information-pane";
import {
  Dialect
} from "/client/skeleton/dialect";
import {
  Entry
} from "/client/skeleton/entry";
import {
  CodesUtil
} from "/client/util/codes";


export default class InformationList<E extends Entry> extends Component<Props<E>, State<E>> {

  public state: State<E> = {
    entry: undefined as any,
    descendantDialects: null
  };

  public constructor(props: Props<E>) {
    super(props);
    this.state.entry = {...props.entry};
  }

  public async componentDidMount(): Promise<void> {
    await this.fetchDescendantDialects();
  }

  private async fetchDescendantDialects(): Promise<void> {
    let codes = this.props.entry.codes;
    let response = await this.request("fetchDescendantDialects", {codes});
    if (response.status === 200) {
      let descendantDialects = response.data.map(Dialect.create);
      this.setState({descendantDialects});
    }
  }

  protected renderLink(url: string): ReactNode {
    let node = (
      <a className="link" href={url} target="_blank">{url}</a>
    );
    return node;
  }

  protected renderDescendantDialects(): ReactNode {
    let entry = this.state.entry;
    let dialects = this.state.descendantDialects;
    let innerNode = (() => {
      if (dialects !== null) {
        if (entry.kind === "language") {
          dialects = dialects.filter((dialect) => dialect.codes.dialect !== "~");
        }
        if (dialects.length > 0) {
          let dialectNodes = dialects.map((dialect) => {
            let path = "/cla/" + CodesUtil.toCodePath(dialect.codes);
            let dialectNode = (
              <li key={dialect.id}>
                <Link className="link" to={path}>{CodesUtil.toNormalizedForm(dialect.codes)}</Link>
              </li>
            );
            return dialectNode;
          });
          let innerNode = (
            <ul className="list">
              {dialectNodes}
            </ul>
          );
          return innerNode;
        } else {
          let innerNode = (
            <div className="no-data">{this.trans("informationList.noData")}</div>
          );
          return innerNode;
        }
      } else {
        let innerNode = (
          <div className="loading">?</div>
        );
        return innerNode;
      }
    })();
    let node = (
      <InformationPane label={this.trans("informationList.descendantDialects")}>
        {innerNode}
      </InformationPane>
    );
    return node;
  }

  protected renderFullCodeString(): ReactNode {
    let node = (
      <InformationPane label={this.trans("informationList.fullCodeString")}>
        {CodesUtil.toNormalizedForm(this.props.entry.codes)}
      </InformationPane>
    );
    return node;
  }

  protected renderBcpString(): ReactNode {
    let node = (
      <InformationPane label={this.trans("informationList.bcpString")}>
        {CodesUtil.toBcpString(this.props.entry.codes)}
      </InformationPane>
    );
    return node;
  }

  protected renderApproval(): ReactNode {
    let entry = this.props.entry;
    let text = (() => {
      if (entry.approved) {
        let dateString = this.transDate(entry.approvedDate);
        let text = this.trans("informationList.approved", {dateString});
        return text;
      } else {
        let text = this.trans("informationList.unapproved");
        return text;
      }
    })();
    let node = (
      <InformationPane label={this.trans("informationList.approval")}>
        {text}
      </InformationPane>
    );
    return node;
  }

  protected setEntry<T extends Array<unknown>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let entry = outerThis.state.entry;
      outerThis.setState({entry});
    };
    return wrapper;
  }

}


type Props<E> = {
  entry: E,
  editable: boolean,
  onSet: (key: string, value: any) => void
};
type State<E> = {
  entry: E,
  descendantDialects: Array<Dialect> | null
};