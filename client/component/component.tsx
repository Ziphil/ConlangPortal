//

import {
  Component,
  ReactNode
} from "react";
import {
  IntlShape
} from "react-intl";
import {
  RouteComponentProps
} from "react-router-dom";
import {
  Primitive
} from "ts-essentials";
import {
  GlobalStore
} from "/client/component/store";


export default class BaseComponent<P = {}, S = {}, Q = {}, H = any> extends Component<Props<P, Q>, S, H> {

  public constructor(props?: any) {
    super(props);
    this.initialize();
  }

  protected initialize(): void {
  }

  protected trans(id: string | number, values?: Record<string, Primitive | FormatFunction<string, string>>): string;
  protected trans(id: string | number, values?: Record<string, Primitive | ReactNode | FormatFunction<ReactNode, ReactNode>>): ReactNode;
  protected trans(id: string | number, values?: Record<string, any>): ReactNode {
    let defaultMessage = "[?]";
    return this.props.intl!.formatMessage({id, defaultMessage}, values);
  }

  protected transNumber(number: number | null | undefined, digit?: number): string {
    let options = {minimumFractionDigits: digit, maximumFractionDigits: digit};
    if (number !== null && number !== undefined) {
      return this.props.intl!.formatNumber(number, options);
    } else {
      return this.props.intl!.formatMessage({id: "common.numberUndefined"});
    }
  }

  protected pushPath(path: string, state?: object): void {
    this.props.history!.push(path, state);
  }

  protected replacePath(path: string, state?: object): void {
    this.props.history!.replace(path, state);
  }

}


type AdditionalProps = {
  styles: StylesRecord,
  intl: IntlShape,
  store: GlobalStore
};

type Props<P, Q> = Partial<RouteComponentProps<Q, any, any> & AdditionalProps> & P;

type StylesRecord = {[key: string]: string | undefined};
type FormatFunction<T, R> = (parts: Array<string | T>) => R;