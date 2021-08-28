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

  public state: State = {
    active: false
  };

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value;
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
        <input
          styleName="input-inner"
          type="input"
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
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: string) => void,
  onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void,
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => void,
  className?: string
};
type State = {
  active: boolean
};