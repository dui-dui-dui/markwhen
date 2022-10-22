const result = {
  "groups": [
    {
      "group_id": "pd",
      "group_index": 0,
      "group_override": false,
      "rules": [
        {
          "group_id": "pd",
          "id": "default",
          "index": 0,
          "override": false,
          "start_key": "",
          "end_key": "",
          "role": "voter",
          "count": 3,
          "location_labels": [
            "zone"
          ]
        },
        {
          "group_id": "pd",
          "id": "meta",
          "index": 1,
          "override": false,
          "start_key": "",
          "end_key": "7480000000000000FF0000000000000000F8",
          "role": "voter",
          "count": 2,
          "location_labels": [
            "zone"
          ]
        }
      ]
    },
    {
      "group_id": "tiflash",
      "group_index": 120,
      "group_override": false,
      "rules": [
        {
          "group_id": "tiflash",
          "id": "happy",
          "index": 0,
          "override": false,
          "start_key": "7480000000000000FF4E00000000000000F8",
          "end_key": "7480000000000000FF5000000000000000F8",
          "role": "learner",
          "count": 1
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
  "markdown": "group pd\n\n10/22/2022 - 10/22/2022: default\n10/23/2022: meta\ngroup tiflash\n\n10/22/2022 - 10/23/2022: happy\n",
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

export { result }