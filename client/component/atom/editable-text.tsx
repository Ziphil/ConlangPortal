//

import * as react from "react";
import {
  ChangeEvent,
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./editable-text.scss"))
export default class EditableText extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    single: true
  };
  public state: State = {
    active: false
  };

  private handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    let value = event.target.value;
    if (this.props.single) {
      value = value.replace(/\n|\r/g, "");
    }
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  private handleConfirm(event: MouseEvent<HTMLButtonElement>): void {
    this.setState({active: false});
    if (this.props.onConfirm) {
      this.props.onConfirm(event);
    }
  }

  private handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    this.setState({active: false});
    if (this.props.onCancel) {
      this.props.onCancel(event);
    }
  }

  private renderInput(): ReactNode {
    let styleName = StyleNameUtil.create(
      "input",
      {if: this.state.active, true: "active"}
    );
    let node = (
      <div styleName={styleName}>
        <div styleName="input-dummy">{this.props.value}&#x200B;</div>
        <textarea
          styleName="input-inner"
          value={this.props.value}
          onFocus={() => this.setState({active: true})}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
    return node;
  }

  public render(): ReactNode {
    let inputNode = this.renderInput();
    let node = (
      <div styleName="root" className={this.props.className}>
        {inputNode}
        <div styleName="button">
          <Button iconLabel="&#xF00D;" onClick={this.handleCancel.bind(this)}/>
          <Button iconLabel="&#xF00C;" onClick={this.handleConfirm.bind(this)}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  value: string,
  single: boolean,
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
  onSet?: (value: string) => void,
  onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void,
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => void,
  className?: string
};
type DefaultProps = {
  single: boolean
};
type State = {
  active: boolean
};