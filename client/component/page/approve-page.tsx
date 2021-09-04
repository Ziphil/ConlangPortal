//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import DialectList from "/client/component/compound/dialect-list";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";


@style(require("./approve-page.scss"))
export default class ApprovePage extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <Page>
        <div styleName="list">
          <DialectList title={this.trans("approvePage.list")} includeOptions={{approved: false, unapproved: true}} makeLink={false} showApproveButton={true}/>
        </div>
      </Page>
    );
    return node;
  }

}


type Props = {
};
type State = {
};