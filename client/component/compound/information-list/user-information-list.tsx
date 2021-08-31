//

import * as react from "react";
import {
  ReactNode
} from "react";
import EditableText from "/client/component/atom/editable-text";
import InformationList from "/client/component/compound/information-list/information-list";
import InformationPane from "/client/component/compound/information-pane";
import {
  style
} from "/client/component/decorator";
import {
  User
} from "/client/skeleton/user";


@style(require("./information-list.scss"))
export default class DialectInformationList extends InformationList<User> {

  protected renderTwitterLink(id: string): ReactNode {
    let node = (
      <a className="link twitter" href={`https://twitter.com/${id}`} target="_blank">@{id}</a>
    );
    return node;
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <InformationPane label={this.trans("informationList.name")}>
          <EditableText
            value={this.state.entry.name ?? ""}
            editable={this.props.editable}
            onSet={this.setEntry((name) => this.state.entry.name = name)}
            onConfirm={() => this.props.onSet("name", this.state.entry.name)}
            onCancel={this.setEntry(() => this.state.entry.name = this.props.entry.name)}
          />
        </InformationPane>
        <InformationPane label={this.trans("informationList.homepageUrl")}>
          <EditableText
            value={this.state.entry.homepageUrl ?? ""}
            editable={this.props.editable}
            render={this.renderLink.bind(this)}
            onSet={this.setEntry((homepageUrl) => this.state.entry.homepageUrl = homepageUrl)}
            onConfirm={() => this.props.onSet("homepageUrl", this.state.entry.homepageUrl)}
            onCancel={this.setEntry(() => this.state.entry.homepageUrl = this.props.entry.homepageUrl)}
          />
        </InformationPane>
        <InformationPane label={this.trans("informationList.twitterId")}>
          <EditableText
            value={this.state.entry.twitterId ?? ""}
            editable={this.props.editable}
            render={this.renderTwitterLink.bind(this)}
            onSet={this.setEntry((twitterId) => this.state.entry.twitterId = twitterId)}
            onConfirm={() => this.props.onSet("twitterId", this.state.entry.twitterId)}
            onCancel={this.setEntry(() => this.state.entry.twitterId = this.props.entry.twitterId)}
          />
        </InformationPane>
        <InformationPane label={this.trans("informationList.biography")}>
          <EditableText
            value={this.state.entry.biography ?? ""}
            editable={this.props.editable}
            single={false}
            onSet={this.setEntry((biography) => this.state.entry.biography = biography)}
            onConfirm={() => this.props.onSet("biography", this.state.entry.biography)}
            onCancel={this.setEntry(() => this.state.entry.biography = this.props.entry.biography)}
          />
        </InformationPane>
        {this.renderFullCodeString()}
        {this.renderApproval()}
      </div>
    );
    return node;
  }

}