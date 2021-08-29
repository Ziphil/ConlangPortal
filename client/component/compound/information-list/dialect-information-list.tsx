//

import * as react from "react";
import {
  ReactNode
} from "react";
import EditableText from "/client/component/atom/editable-text";
import InformationList from "/client/component/compound/information-list/information-list";
import InformationPane from "/client/component/compound/information-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dialect
} from "/client/skeleton/dialect";


@style(require("./information-list.scss"))
export default class DialectInformationList extends InformationList<Dialect> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <InformationPane label={this.trans("informationList.name")}>
          <EditableText
            value={this.state.entry.name ?? ""}
            editable={this.props.editable}
            onSet={this.setEntry((name) => this.state.entry.name = name)}
            onConfirm={() => this.props.onSet("name", this.state.entry.name)}
            onCancel={this.setEntry(() => this.state.entry.name = this.props.entry.name)}
          />
        </InformationPane>
        {this.renderFullCodeString()}
        {this.renderBcpString()}
        {this.renderApproval()}
      </div>
    );
    return node;
  }

}