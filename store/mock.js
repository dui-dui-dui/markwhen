export const mockData = {
  "groups": [
    {
      "tags": [],
      "title": "pd",
      "range": {
        "min": "2022-01-01T00:00:00+08:00",
        "max": "2022-01-08T00:00:00+08:00",
        "latest": "2022-01-08T00:00:00+08:00"
      },
      "startExpanded": true,
      "style": "group",
      "events": [
        {
          "eventString": "default",
          "ranges": {
            "event": {
              "from": 0,
              "to": 0,
              "type": "event",
              "content": null
            },
            "date": {
              "fromDateTime": "2022-01-01T00:00:00+08:00",
              "toDateTime": "2022-01-08T00:00:00+08:00",
              "originalString": "",
              "dateRangeInText": {
                "from": 0,
                "to": 0,
                "type": "dateRange",
                "content": null
              }
            }
          },
          "event": {
            "eventDescription": "3 voters",
            "tags": [],
            "supplemental": null,
            "googlePhotosLink": "",
            "locations": null,
            "id": "",
            "percent": 0
          }
        },
        {
          "eventString": "meta",
          "ranges": {
            "event": {
              "from": 0,
              "to": 0,
              "type": "event",
              "content": null
            },
            "date": {
              "fromDateTime": "2022-01-01T00:00:00+08:00",
              "toDateTime": "2022-01-01T00:00:00+08:00",
              "originalString": "",
              "dateRangeInText": {
                "from": 0,
                "to": 0,
                "type": "dateRange",
                "content": null
              }
            }
          },
          "event": {
            "eventDescription": "2 voters",
            "tags": [],
            "supplemental": null,
            "googlePhotosLink": "",
            "locations": null,
            "id": "",
            "percent": 0
          }
        }
      ]
    },
    {
      "tags": [],
      "title": "tiflash",
      "range": {
        "min": "2022-01-06T00:00:00+08:00",
        "max": "2022-01-06T00:00:00+08:00",
        "latest": "2022-01-06T00:00:00+08:00"
      },
      "startExpanded": true,
      "style": "group",
      "events": [
        {
          "eventString": "happy",
          "ranges": {
            "event": {
              "from": 0,
              "to": 0,
              "type": "event",
              "content": null
            },
            "date": {
              "fromDateTime": "2022-01-06T00:00:00+08:00",
              "toDateTime": "2022-01-06T00:00:00+08:00",
              "originalString": "",
              "dateRangeInText": {
                "from": 0,
                "to": 0,
                "type": "dateRange",
                "content": null
              }
            }
          },
          "event": {
            "eventDescription": "1 learner",
            "tags": [],
            "supplemental": null,
            "googlePhotosLink": "",
            "locations": null,
            "id": "",
            "percent": 0
          }
        }
      ]
    }
  ],
  "labels": [
    {
      "key": "engine",
      "values": [
        "tikv",
        "tiflash"
      ]
    },
    {
      "key": "zone",
      "values": [
        "zone-1",
        "zone-2",
        "zone-3"
      ]
    },
    {
      "key": "disk",
      "values": [
        "ssd",
        "hdd"
      ]
    }
  ],
  "schemas": [
    {
      "ts": 1640966400000000,
      "size": 0,
      "left": 0,
      "name": "meta",
      "description": "meta data of tidb cluster",
      "start_key": "",
      "end_key": "7480000000000000FF0000000000000000F8"
    },
    {
      "ts": 1641052800000000,
      "size": 0,
      "left": 0,
      "name": "system",
      "description": "system tables of mysql database",
      "start_key": "7480000000000000FF4400000000000000F8",
      "end_key": "7480000000000000FF4600000000000000F8"
    },
    {
      "ts": 1641139200000000,
      "size": 0,
      "left": 0,
      "name": "foo",
      "description": "test/foo",
      "start_key": "7480000000000000FF4600000000000000F8",
      "end_key": "7480000000000000FF4800000000000000F8"
    },
    {
      "ts": 1641225600000000,
      "size": 0,
      "left": 0,
      "name": "bar",
      "description": "test/bar",
      "start_key": "7480000000000000FF4800000000000000F8",
      "end_key": "7480000000000000FF4A00000000000000F8"
    },
    {
      "ts": 1641312000000000,
      "size": 0,
      "left": 0,
      "name": "baz",
      "description": "test/baz",
      "start_key": "7480000000000000FF4A00000000000000F8",
      "end_key": "7480000000000000FF4C00000000000000F8"
    },
    {
      "ts": 1641398400000000,
      "size": 0,
      "left": 0,
      "name": "happy",
      "description": "hackathon/happy",
      "start_key": "7480000000000000FF4E00000000000000F8",
      "end_key": "7480000000000000FF5000000000000000F8"
    },
    {
      "ts": 1641484800000000,
      "size": 0,
      "left": 0,
      "name": "lucky",
      "description": "hackathon/lucky",
      "start_key": "7480000000000000FF5000000000000000F8",
      "end_key": "7480000000000000FF5200000000000000F8"
    },
    {
      "ts": 1641571200000000,
      "size": 0,
      "left": 0,
      "name": "default",
      "description": "future tables",
      "start_key": "7480000000000000FF5200000000000000F8",
      "end_key": ""
    }
  ]
}