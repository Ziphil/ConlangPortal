//

import * as react from "react";
import {
  ChangeEvent,
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./text-area.scss"))
export default class TextArea extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    readOnly: false,
    disabled: false
  };
  public state: State = {
    errorMessage: null
  };

  private handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    let value = event.target.value;
    this.updateValue(value);
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  private updateValue(value: string): void {
    let validate = this.props.validate;
    if (validate !== undefined) {
      let errorMessage = validate(value);
      this.setState({errorMessage});
    } else {
      this.setState({errorMessage: null});
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  private renderInput(): ReactNode {
    let styleName = StyleNameUtil.create(
      "input",
      {if: this.state.errorMessage !== null, true: "error"},
      {if: this.props.disabled, true: "disabled"}
    );
    let prefixNode = (this.props.prefix !== undefined) && (
      <div styleName="prefix">{this.props.prefix}</div>
    );
    let suffixNode = (this.props.suffix !== undefined) && (
      <div styleName="suffix">{this.props.suffix}</div>
    );
    let node = (
      <div styleName={styleName}>
        {prefixNode}
        <textarea
          styleName="input-inner"
          value={this.props.value}
          readOnly={this.props.readOnly}
          disabled={this.props.disabled}
          onChange={this.handleChange.bind(this)}
        />
        {suffixNode}
      </div>
    );
    return node;
  }

  private renderLabel(): ReactNode {
    let styleName = StyleNameUtil.create(
      "label",
      {if: this.props.disabled, true: "disabled"}
    );
    let node = (this.props.label) && (
      <div styleName={styleName}>
        {this.props.label}
      </div>
    );
    return node;
  }

  public render(): ReactNode {
    let inputNode = this.renderInput();
    let labelNode = this.renderLabel();
    let node = (
      <div styleName="root" className={this.props.className}>
        <label styleName="label-wrapper">
          {labelNode}
          {inputNode}
        </label>
      </div>
    );
    return node;
  }

}


type Props = {
  value: string,
  label?: string,
  prefix?: ReactNode,
  suffix?: ReactNode,
  validate?: (value: string) => string | null,
  readOnly: boolean,
  disabled: boolean,
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
  onSet?: (value: string) => void,
  className?: string
};
type DefaultProps = {
  readOnly: boolean,
  disabled: boolean
};
type State = {
  errorMessage: string | null
};