//

import axios from "axios";
import {
  AxiosInstance,
  AxiosRequestConfig
} from "axios";
import {
  AxiosResponse
} from "axios";
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
import {
  DateUtil
} from "/client/util/date";
import {
  ProcessName,
  RequestData,
  ResponseData,
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


export default class BaseComponent<P = {}, S = {}, Q = {}, H = any> extends Component<Props<P, Q>, S, H> {

  private static client: AxiosInstance = BaseComponent.createClient();

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

  protected transDate(date: Date | number | string | null | undefined): string {
    if (date !== null && date !== undefined) {
      let format =  this.props.intl!.formatMessage({id: "common.dateFormat"});
      let locale = this.props.intl!.locale;
      return DateUtil.format(date, format, locale);
    } else {
      return this.props.intl!.formatMessage({id: "common.dateUndefined"});
    }
  }

  protected transShortDate(date: Date | number | string | null | undefined): string {
    if (date !== null && date !== undefined) {
      let format =  this.props.intl!.formatMessage({id: "common.shortDateFormat"});
      let locale = this.props.intl!.locale;
      return DateUtil.format(date, format, locale);
    } else {
      return this.props.intl!.formatMessage({id: "common.dateUndefined"});
    }
  }

  protected pushPath(path: string, state?: object, preservesPopup?: boolean): void {
    this.props.history!.push(path, state);
  }

  protected replacePath(path: string, state?: object, preservesPopup?: boolean): void {
    this.props.history!.replace(path, state);
  }

  // サーバーに POST リクエストを送り、そのリスポンスを返します。
  // HTTP ステータスコードが 400 番台もしくは 500 番台の場合は、例外は投げられませんが、代わりにグローバルストアにエラータイプを送信します。
  // これにより、ページ上部にエラーを示すポップアップが表示されます。
  // ignroesError に true を渡すことで、このエラータイプの送信を抑制できます。
  protected async request<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    let url = SERVER_PATH_PREFIX + SERVER_PATHS[name];
    let method = "post" as const;
    let response = await (async () => {
      try {
        return await BaseComponent.client.request({url, method, ...config, data});
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          let data = undefined as any;
          let headers = config.headers;
          return {status: 408, statusText: "Request Timeout", data, headers, config};
        } else {
          throw error;
        }
      }
    })();
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      this.catchError(response);
    }
    return response;
  }

  protected async login(data: RequestData<"login">, config?: RequestConfig): Promise<AxiosResponseSpec<"login">> {
    let response = await this.request("login", data, config);
    if (response.status === 200) {
      let body = response.data;
      this.props.store!.user = body.user;
    }
    return response;
  }

  protected async logout(config?: RequestConfig): Promise<AxiosResponseSpec<"logout">> {
    let response = await this.request("logout", {}, config);
    if (response.status === 200) {
      this.props.store!.user = null;
    }
    return response;
  }

  private catchError<T>(response: AxiosResponse<T>): AxiosResponse<T> {
    let status = response.status;
    if (status === 401) {
      this.props.store!.user = null;
    }
    return response;
  }

  private static createClient(): AxiosInstance {
    let client = axios.create({timeout: 5000, validateStatus: () => true});
    return client;
  }

}


type AdditionalProps = {
  styles: StylesRecord,
  intl: IntlShape,
  store: GlobalStore
};
type AdditionalRequestConfig = {
  ignoreError?: boolean
};

type Props<P, Q> = Partial<RouteComponentProps<Q, any, any> & AdditionalProps> & P;

type RequestConfig = AxiosRequestConfig & AdditionalRequestConfig;
type AxiosResponseSpec<N extends ProcessName> = AxiosResponse<ResponseData<N>>;
type StylesRecord = {[key: string]: string | undefined};
type FormatFunction<T, R> = (parts: Array<string | T>) => R;