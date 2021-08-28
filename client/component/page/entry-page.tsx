//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  Link
} from "react-router-dom";
import Component from "/client/component/component";
import AddEntryForm from "/client/component/compound/add-entry-form";
import EntryPane from "/client/component/compound/entry-pane";
import {
  style
} from "/client/component/decorator";
import Page from "/client/component/page/page";
import {
  Entry
} from "/client/skeleton/entry";
import {
  CodesUtil
} from "/client/util/codes";


@style(require("./entry-page.scss"))
export default class EntryPage extends Component<Props, State, Params> {

  public state: State = {
    valid: null
  };

  public async componentDidMount(): Promise<void> {
    this.checkValid();
  }

  public async componentDidUpdate(previousProps: any): Promise<void> {
    if (this.props.location!.key !== previousProps.location!.key) {
      this.checkValid();
    }
  }

  public checkValid(): void {
    let codePath = this.props.match!.params.codePath;
    if (CodesUtil.isValidCodePath(codePath)) {
      this.setState({valid: true});
    } else {
      this.setState({valid: false});
    }
  }

  private renderAddEntryForm(): ReactNode {
    let user = this.props.store!.user;
    let codeArray = this.props.match!.params.codePath.split("-");
    if (codeArray.length === 1 && codeArray[0] === user?.code) {
      let node = (
        <div styleName="form">
          <AddEntryForm userCode={codeArray[0]}/>
        </div>
      );
      return node;
    } else {
      return null;
    }
  }

  public render(): ReactNode {
    let valid = this.state.valid;
    if (valid === true) {
      let codePath = this.props.match!.params.codePath;
      let codes = CodesUtil.fromCodePath(codePath);
      let addEntryForm = this.renderAddEntryForm();
      let node = (
        <Page>
          <EntryPane codes={codes}/>
          {addEntryForm}
        </Page>
      );
      return node;
    } else if (valid === false) {
      let node = (
        <Page>
          invalid code
        </Page>
      );
      return node;
    } else {
      return null;
    }
  }

}


type Props = {
};
type State = {
  valid: boolean | null
};
type Params = {
  codePath: string
};