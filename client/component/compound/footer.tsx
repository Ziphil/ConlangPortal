//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./footer.scss"))
export default class Footer extends Component<Props, State> {

  public render(): ReactNode {
    let version = process.env["npm_package_version"];
    let node = (
      <footer styleName="root">
        <div styleName="container">
          <div styleName="message">
            Conlang Portal (ver {version})<br/>
            This site is supported by <a href="https://migdal.jp/cl_kiita" target="_blank">CL-KIITA</a>
          </div>
        </div>
      </footer>
    );
    return node;
  }

}


type Props = {
};
type State = {
};