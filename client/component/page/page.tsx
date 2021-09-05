//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import Footer from "/client/component/compound/footer";
import Header from "/client/component/compound/header";
import {
  style
} from "/client/component/decorator";
import {
  OgpUtil
} from "/client/util/ogp";


@style(require("./page.scss"))
export default class Page extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    setTitle: true
  };

  public componentDidMount(): void {
    if (this.props.setTitle) {
      document.title = OgpUtil.createDefaultTitle();
    }
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root" id="page">
        <Header/>
        <div styleName="spacer">
          <div styleName="content">
            {this.props.children}
          </div>
        </div>
        <Footer/>
      </div>
    );
    return node;
  }

}


type Props = {
  setTitle: boolean
};
type DefaultProps = {
  setTitle: boolean
};
type State = {
};