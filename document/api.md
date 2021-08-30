## GET `/api/cla/list`

### クエリパラメータ
| 名前 | 説明 |
|:-----|:-----|
| `onlyApproved` (任意) | 承認済みコードのみを返すかどうか<br>このキーに空文字列以外が指定された場合は承認済みのコードのみを返す |

リクエスト URL 例:
```
https://conlang-portal.herokuapp.com/api/cla/list?onlyApproved=1
```

### レスポンス
| 名前 | 型 | 説明 |
|:-----|:---|:-----|
| `entries` | object list | コードとそれに紐付けられた各種情報を格納したオブジェクトの配列 |
| ├ `normalizedCode` | string | CLA 正規形 |
| ├ `codes` | object | 階層ごとのコード文字列 |
| │├ `dialect` | string | 方言コード (2 桁) |
| │├ `language` | string | 言語コード (2 桁) |
| │├ `family` | string | 語族コード (3 桁) |
| │└ `user` | string | 製作者コード (3 桁) |
| ├ `names` | object | 階層ごとの名称 |
| │├ `dialect` | string | 方言名 |
| │├ `language` | string | 言語名 |
| │├ `family` | string | 語族名 |
| │└ `user` | string | 製作者名 |
| ├ `approved` | boolean | 承認済みかどうか |
| ├ `createdDate` | string | 申請日時 (ISO 8601 文字列) |
| └ `approvedDate` | string\|null | 承認日時 (ISO 8601 文字列), 未承認なら null |

レスポンス例:
```json
{
  "entries": [
    {
      "normalizedCode": "{cla3}~_xl_~_zph",
      "codes": {
        "dialect": "~",
        "language": "xl",
        "family": "~",
        "user": "zph"
      },
      "names": {
        "dialect": "",
        "language": "シャレイア語",
        "family": "",
        "user": "Ziphil"
      },
      "approved": true,
      "createdDate": "2021-08-21T14:46:59.597Z",
      "approvedDate": "2021-08-29T14:49:10.889Z"
    },
    {
      "normalizedCode": "{cla3}uk_en_ine_nat",
      "codes": {
        "dialect": "uk",
        "language": "en",
        "family": "ine",
        "user": "nat"
      },
      "names": {
        "dialect": "イギリス英語",
        "language": "英語",
        "family": "インド・ヨーロッパ語族",
        "user": "自然言語"
      },
      "approved": false,
      "createdDate": "2021-08-21T14:29:51.180Z",
      "approvedDate": null
    }
  ]
}
```