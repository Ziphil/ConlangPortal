//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Redirect,
  Route,
  RouteProps
} from "react-router-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(null, {withRouter: false, inject: true, injectIntl: false, observer: true})
export default class Authenticator extends Component<RouteProps & Props, State> {

  public render(): ReactNode {
    let type = this.props.type;
    let user = this.props.store!.user;
    let redirect = this.props.redirect?.replace(/:creatorCode/g, user?.code ?? "");
    if (type === "private" && redirect !== undefined) {
      let node = (user !== null) ? <Route {...this.props}/> : <Redirect to={redirect}/>;
      return node;
    } else if (type === "approver" && redirect !== undefined) {
      let node = (user !== null && (user.authority === "approver" || user.authority === "admin")) ? <Route {...this.props}/> : <Redirect to={redirect}/>;
      return node;
    } else if (type === "guest" && redirect !== undefined) {
      let node = (user === null) ? <Route {...this.props}/> : <Redirect to={redirect}/>;
      return node;
    } else {
      let node = <Route {...this.props}/>;
      return node;
    }
  }

}


type Props = {
  type: "private" | "approver" | "guest" | "none",
  redirect?: string
};
type State = {
};