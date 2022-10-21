**getSchemas**

```
{
    schemas: [''] // string[]
}
```

timline 获取所有 events 的方法 `getters.filteredEvents`

**getPlacementRule**

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
    config: {
        ...
    }
}

interface Events {
  eventString: string;
  ranges: EventRanges;
  event: EventDescription;
}
```

**Group Type**

```

```
