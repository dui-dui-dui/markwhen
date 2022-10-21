// import { getPlacementRules } from './services'
interface Rules {
    group_id: string;
    id: string;
    index: number;
    override: boolean;
    start_schema: string;
    end_schema: string;
    start_key: string;
    end_key: string;
    role: string;
    count: number;
}

interface RuleConfig {
    group_id: string;
    group_index: number;
    gruop_override: boolean;
    rules: Rules[];
}

interface Schema {
    name: string,
    description: string,
    start_key: string,
    end_key: string,
}

interface StroeLabels {
    key: string,
    values: string[]
}

export interface PlacementRulesConfig {
    schemas: Schema[]
    rule_config: RuleConfig[];
    store_labels: StroeLabels[]
}

// TODO: convert PlacementRulesConfig to event
// function RuleSchemaMap(data: PlacementRulesConfig) {
//

// }

// function Schema() {
//     const schemas = getPlacementRules().data
//     return
// }
