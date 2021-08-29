//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import InformationPane from "/client/component/compound/information-pane";
import {
  Entry
} from "/client/skeleton/entry";
import {
  CodesUtil
} from "/client/util/codes";


export default class InformationList<E extends Entry> extends Component<Props<E>, State<E>> {

  public constructor(props: Props<E>) {
    super(props);
    let entry = {...props.entry};
    this.state = {entry};
  }

  protected renderFullCodeString(): ReactNode {
    let node = (
      <InformationPane label={this.trans("informationList.fullCodeString")}>
        {CodesUtil.toFullCodeString(this.props.entry.codes)}
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
  entry: E
};