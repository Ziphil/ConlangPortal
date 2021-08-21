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


@style(require("./input.scss"))
export default class Input extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    type: "text",
    readOnly: false,
    disabled: false
  };
  public state: State = {
    type: undefined as any,
    errorMessage: null
  };

  public constructor(props: any) {
    super(props);
    let type = this.props.type;
    if (type === "flexible") {
      type = "password";
    }
    this.state.type = type;
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
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

  private toggleType(): void {
    if (this.state.type === "text") {
      this.setState({type: "password"});
    } else {
      this.setState({type: "text"});
    }
  }

  private renderInput(): ReactNode {
    let styleName = StyleNameUtil.create(
      "input",
      {if: this.state.errorMessage !== null, true: "error"},
      {if: this.props.disabled, true: "disabled"}
    );
    let eyeStyleName = StyleNameUtil.create("eye", this.state.type);
    let eyeNode = (this.props.type === "flexible") && (
      <span styleName={eyeStyleName} onClick={this.toggleType.bind(this)}/>
    );
    let prefixNode = (this.props.prefix !== undefined) && (
      <div styleName="prefix">{this.props.prefix}</div>
    );
    let suffixNode = (this.props.suffix !== undefined || this.props.type === "flexible") && (
      <div styleName="suffix">
        {this.props.suffix}
        {eyeNode}
      </div>
    );
    let node = (
      <div styleName={styleName}>
        {prefixNode}
        <input
          styleName="input-inner"
          type={this.state.type}
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
  type: "text" | "password" | "flexible",
  validate?: (value: string) => string | null,
  readOnly: boolean,
  disabled: boolean,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: string) => void,
  className?: string
};
type DefaultProps = {
  type: "text" | "password" | "flexible",
  readOnly: boolean,
  disabled: boolean
};
type State = {
  type: "text" | "password",
  errorMessage: string | null
};