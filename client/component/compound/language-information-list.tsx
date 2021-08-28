//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import EditableText from "/client/component/atom/editable-text";
import Component from "/client/component/component";
import InformationPane from "/client/component/compound/information-pane";
import {
  style
} from "/client/component/decorator";
import {
  Language
} from "/client/skeleton/language";


@style(require("./language-information-list.scss"))
export default class LanguageInformationList extends Component<Props, State, Params> {

  public constructor(props: Props) {
    super(props);
    let entry = {...props.entry};
    this.state = {entry};
  }

  private setEntry<T extends Array<unknown>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let entry = outerThis.state.entry;
      outerThis.setState({entry});
    };
    return wrapper;
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <InformationPane label="名前">
          <EditableText
            value={this.state.entry.name ?? ""}
            onSet={this.setEntry((name) => this.state.entry.name = name)}
            onCancel={this.setEntry(() => this.state.entry.name = this.props.entry.name)}
          />
        </InformationPane>
        <InformationPane label="ホームページ URL">
          {this.props.entry.homepageUrl}
        </InformationPane>
        <InformationPane label="辞書 URL">
          {this.props.entry.dictionaryUrl}
        </InformationPane>
      </div>
    );
    return node;
  }

}


type Props = {
  entry: Language,
  onSet?: (entry: Language) => void
};
type State = {
  entry: Language
};
type Params = {
};