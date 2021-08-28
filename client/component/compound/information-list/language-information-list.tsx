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
  Language
} from "/client/skeleton/language";


@style(require("./information-list.scss"))
export default class LanguageInformationList extends InformationList<Language> {

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
        <InformationPane label={this.trans("informationList.homepageUrl")}>
          <EditableText
            value={this.state.entry.homepageUrl ?? ""}
            editable={this.props.editable}
            onSet={this.setEntry((homepageUrl) => this.state.entry.homepageUrl = homepageUrl)}
            onConfirm={() => this.props.onSet("homepageUrl", this.state.entry.homepageUrl)}
            onCancel={this.setEntry(() => this.state.entry.homepageUrl = this.props.entry.homepageUrl)}
          />
        </InformationPane>
        <InformationPane label={this.trans("informationList.dictionaryUrl")}>
          <EditableText
            value={this.state.entry.dictionaryUrl ?? ""}
            editable={this.props.editable}
            onSet={this.setEntry((dictionaryUrl) => this.state.entry.dictionaryUrl = dictionaryUrl)}
            onConfirm={() => this.props.onSet("dictionaryUrl", this.state.entry.dictionaryUrl)}
            onCancel={this.setEntry(() => this.state.entry.dictionaryUrl = this.props.entry.dictionaryUrl)}
          />
        </InformationPane>
      </div>
    );
    return node;
  }

}