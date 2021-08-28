//

import * as react from "react";
import Component from "/client/component/component";


export default class InformationList<E> extends Component<Props<E>, State<E>> {

  public constructor(props: Props<E>) {
    super(props);
    let entry = {...props.entry};
    this.state = {entry};
  }

  protected setEntry<T extends Array<unknown>>(setter: (...args: T) => void): (...args: T) => void {
    let outerThis = this;
    let wrapper = function (...args: T): void {
      setter(...args);
      let entry = outerThis.state.entry;
      outerThis.setState({entry});
    };
    return wrapper;
  }

}


type Props<E> = {
  entry: E,
  editable: boolean,
  onSet: (key: string, value: any) => void
};
type State<E> = {
  entry: E
};