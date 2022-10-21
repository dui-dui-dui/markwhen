### 方案一：接口请求

**Events Type**

```JS
type Range = {
  from: number; // timestamp?
  to: number; // timestamp?
  type: string;
  content?: any;
};

interface DateRangePart {
  fromDateTime: DateTime;
  toDateTime: DateTime;
  originalString?: string;
  dateRangeInText: Range;
}

type EventRanges = { event: Range; date: DateRangePart }

interface EventDescription {
    eventDescription: string;
    tags: string[] = [];
    supplemental: string[];
    googlePhotosLink?: string;
    locations: string[] = [];
    id?: string;
    percent?: number;
}

interface Event {
  eventString: string;
  ranges: EventRanges;
  event: EventDescription;
}
```

```JSON
// example

{
    "event": {
        "eventDescription": "", // 默认为空字符串
        "locations": [], // 默认为空数组
        "supplemental": [], // 默认为空数组
        "tags": [], // 默认为空数组
    },
    "eventString": "", // 对应 rule id
    "ranges": {
        "event": {
            "from": "", // 应该跟 editor 日期 parse 有关系，还不确定。。
            "to": "",// 应该跟 editor 日期 parse 有关系，还不确定。。
            "type": "event", // 默认 event
        },
        "date": {
            "fromDateTime": , // DateTime 类型，对齐 schema 的 from 和 to
            "toDateTime": , // DateTime 类型，对齐 schema 的 to
            "dateRangeInText": {
                "from": "", // 应该跟 editor 日期 parse 有关系，还不确定。。
                "to": "",// 应该跟 editor 日期 parse 有关系，还不确定。。
                "type": "dateRange", // 默认 dateRange
            },
        }
    }
}
```

**Group Type**

```JS
export interface EventSubGroup extends Array<Event> {
  tags?: string[];
  title?: string;
  range?: {
    min: DateTime;
    max: DateTime;
    latest: DateTime;
  };
  startExpanded?: boolean;
  style?: "group" | "section";
}
```

```JSON
// example
{
    "range": {
        "min": , // DateTime, group 中最左 rule 对齐 的 schema 的 start 时间
        "max": , // DateTime, group 中最右 rule 对齐 的 schema 的 end 时间
        "latest": // group 中最右 rule 对齐 的 schema 的 end 时间
    },
    "startExpanded": true,
    "style": "group",
    "tags": [], // 默认为空
    "title": "group_name", // 对应 group_id
}
```

**Schema**

```JS
export interface Schema {
  ts: number
  dateTime: DateTime
  size: number
  left: number
  name: string,
  description: string,
  start_key: string,
  end_key: string
}
```

```json
// example
{
    "ts": 1666195200000,
    "dateTime": , // 默认第一天为当天0点，schema dataTime 递增单位为天
    "size": 0, // 默认 0
    "left": 0, // 默认 0
    "name": "schema name",
    "description": "",
    "start_key": "",
    "edd_key: ""
}
```

