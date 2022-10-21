import * as axios from "axios";
import { PlacementRulesConfig } from './utils'

interface Response {
    data: PlacementRulesConfig
    status: string
}

const mockData = {
    "schemas": [
      {
        "name": "meta",
        "description": "meta data of tidb cluster",
        "start_key": "",
        "end_key": "7480000000000000FF0000000000000000F8"
      },
      {
        "name": "system",
        "description": "system tables of mysql database",
        "start_key": "7480000000000000FF4400000000000000F8",
        "end_key": "7480000000000000FF4600000000000000F8"
      },
      {
        "name": "foo",
        "description": "test/foo",
        "start_key": "7480000000000000FF4600000000000000F8",
        "end_key": "7480000000000000FF4800000000000000F8"
      },
      {
        "name": "bar",
        "description": "test/bar",
        "start_key": "7480000000000000FF4800000000000000F8",
        "end_key": "7480000000000000FF4A00000000000000F8"
      },
      {
        "name": "baz",
        "description": "test/baz",
        "start_key": "7480000000000000FF4A00000000000000F8",
        "end_key": "7480000000000000FF4C00000000000000F8"
      },
      {
        "name": "happy",
        "description": "hackathon/happy",
        "start_key": "7480000000000000FF4E00000000000000F8",
        "end_key": "7480000000000000FF5000000000000000F8"
      },
      {
        "name": "lucky",
        "description": "hackathon/lucky",
        "start_key": "7480000000000000FF5000000000000000F8",
        "end_key": "7480000000000000FF5200000000000000F8"
      },
      {
        "name": "default",
        "description": "future tables",
        "start_key": "7480000000000000FF5200000000000000F8",
        "end_key": ""
      }
    ],
    "rule_config": [
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
            "start_schema": "meta",
            "end_schema": "default",
            "start_key": "",
            "end_key": "",
            "role": "voter",
            "count": 3
          },
          {
            "group_id": "pd",
            "id": "meta",
            "index": 1,
            "override": false,
            "start_schema": "meta",
            "end_schema": "meta",
            "start_key": "",
            "end_key": "7480000000000000FF0000000000000000F8",
            "role": "voter",
            "count": 2
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
            "start_schema": "happy",
            "end_schema": "happy",
            "start_key": "7480000000000000FF4E00000000000000F8",
            "end_key": "7480000000000000FF5000000000000000F8",
            "role": "learner",
            "count": 1
          }
        ]
      }
    ],
    "store_labels": [
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
    ]
  }

export interface Api {
  get: () => Promise<axios.AxiosResponse<any>>;
}

// export const getPlacementRules: Response = () => {
//   return { data: mockData, status: "" };
// };

// TODO: getEventsAPI
// export const getPlacementRules = async () => {
//   const res = await apiGetPlacementRules();
//   if (!res) {
//     return [];
//   }
//   return res.data;
// };
