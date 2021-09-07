## 概要
バージョンアップに伴い、想定するデータベース内のデータの構造が変更されることがあります。
このドキュメントには、それ以前のバージョンから特定のバージョンにアップデートするときに必要な処理が記載されています。
アップデート時に該当処理を行わなかった場合、データベースへのアクセスの際にエラーが発生したり、データを正しく取り出せなくなったりする可能性があります。

## 移行に必要な処理

### ver 1.3.2 → ver 1.4.0
Mongo Shell で該当のデータベースを選択した後、以下を実行してください。
```
db.users.renameCollection("creators");
db.families.updateMany({}, {$rename: {"codes.user": "codes.creator"}});
db.languages.updateMany({}, {$rename: {"codes.user": "codes.creator"}});
db.dialects.updateMany({}, {$rename: {"codes.user": "codes.creator"}});
```