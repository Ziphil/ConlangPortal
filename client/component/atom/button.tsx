//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  CancelablePromise
} from "/client/util/cancelable";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./button.scss"))
export default class Button extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    reactive: false,
    disabled: false
  };
  public state: State = {
    loading: false
  };

  private promise: CancelablePromise<void> | null = null;

  public componentWillUnmount(): void {
    this.promise?.cancel();
  }

  private handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    let onClick = this.props.onClick;
    if (this.props.reactive) {
      this.setState({loading: true});
      if (onClick) {
        let result = onClick(event);
        if (typeof result === "object" && typeof result.then === "function") {
          let promise = new CancelablePromise(result);
          this.promise = promise;
          promise.then(() => {
            this.setState({loading: false});
          }).catch((error) => {
          });
        } else {
          this.setState({loading: false});
        }
      } else {
        this.setState({loading: false});
      }
    } else {
      if (onClick) {
        onClick(event);
      }
    }
  }

  public render(): ReactNode {
    let styleName = StyleNameUtil.create(
      "root",
      {if: this.props.label === undefined, true: "only-icon"},
      {if: this.state.loading, true: "loading"}
    );
    let labelNode = (this.props.label !== undefined) && <span styleName="label">{this.props.label}</span>;
    let iconNode = (this.props.iconLabel !== undefined) && <span styleName="icon">{this.props.iconLabel}</span>;
    let spinnerNode = (this.props.reactive) && (
      <span styleName="spinner-wrapper">
        <span styleName="spinner"/>
      </span>
    );
    let disabled = this.props.disabled || this.state.loading;
    let node = (
      <button styleName={styleName} className={this.props.className} disabled={disabled} onClick={this.handleClick.bind(this)}>
        {iconNode}
        {labelNode}
        {spinnerNode}
      </button>
    );
    return node;
  }

}


type Props = {
  label?: string,
  iconLabel?: string,
  reactive: boolean,
  disabled: boolean,
  onClick?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>,
  className?: string
};
type DefaultProps = {
  reactive: boolean,
  disabled: boolean
};
type State = {
  loading: boolean
};