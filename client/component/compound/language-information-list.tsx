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
            onConfirm={() => this.props.onSet("name", this.state.entry.name)}
            onCancel={this.setEntry(() => this.state.entry.name = this.props.entry.name)}
          />
        </InformationPane>
        <InformationPane label="ホームページ URL">
          <EditableText
            value={this.state.entry.homepageUrl ?? ""}
            onSet={this.setEntry((homepageUrl) => this.state.entry.homepageUrl = homepageUrl)}
            onConfirm={() => this.props.onSet("homepageUrl", this.state.entry.homepageUrl)}
            onCancel={this.setEntry(() => this.state.entry.homepageUrl = this.props.entry.homepageUrl)}
          />
        </InformationPane>
        <InformationPane label="辞書 URL">
          <EditableText
            value={this.state.entry.dictionaryUrl ?? ""}
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


type Props = {
  entry: Language,
  onSet: (key: string, value: any) => void
};
type State = {
  entry: Language
};
type Params = {
};