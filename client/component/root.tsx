//

import {
  History,
  createBrowserHistory
} from "history";
import {
  Provider
} from "mobx-react";
import * as react from "react";
import {
  ReactNode,
  Suspense,
  lazy
} from "react";
import {
  IntlProvider
} from "react-intl";
import {
  Route,
  Router,
  Switch
} from "react-router-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import ErrorPage from "/client/component/page/error-page";
import {
  GlobalStore
} from "/client/component/store";
import Authenticator from "/client/component/util/authenticator";
import ErrorBoundary from "/client/component/util/error-boundary";
import ScrollTop from "/client/component/util/scroll-top";


let AboutPage = lazy(() => import("/client/component/page/about-page"));
let EntryPage = lazy(() => import("/client/component/page/entry-page"));
let LoginPage = lazy(() => import("/client/component/page/login-page"));
let TopPage = lazy(() => import("/client/component/page/top-page"));


@style(require("./root.scss"), {withRouter: false, inject: false, injectIntl: false, observer: true})
export class Root extends Component<Props, State> {

  private store: GlobalStore = new GlobalStore();
  private history: History = createBrowserHistory();

  public state: State = {
    ready: false
  };

  public async componentDidMount(): Promise<void> {
    await Promise.all([this.store.fetchUser(), this.store.defaultLocale()]);
    this.setState({ready: true});
  }

  public render(): ReactNode {
    let node = (this.state.ready) && (
      <Router history={this.history}>
        <Provider store={this.store}>
          <IntlProvider defaultLocale="ja" locale={this.store.locale} messages={this.store.messages}>
            <Suspense fallback={""}>
              <ErrorBoundary component={ErrorPage}>
                <ScrollTop>
                  <Switch>
                    <Authenticator type="none" exact sensitive path="/" component={TopPage}/>
                    <Authenticator type="guest" exact sensitive path="/login" redirect="/cla/:userCode" component={LoginPage}/>
                    <Authenticator type="none" exact sensitive path="/about" component={AboutPage}/>
                    <Authenticator type="none" exact sensitive path="/cla/:codePath" component={EntryPage}/>
                  </Switch>
                </ScrollTop>
              </ErrorBoundary>
            </Suspense>
          </IntlProvider>
        </Provider>
      </Router>
    );
    return node;
  }

}


type Props = {
};
type State = {
  ready: boolean
};