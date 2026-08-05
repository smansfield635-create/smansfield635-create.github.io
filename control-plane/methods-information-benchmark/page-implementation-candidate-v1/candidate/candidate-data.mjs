import { RECORDS_1 } from "./records-1.mjs";
import { RECORDS_2 } from "./records-2.mjs";
import { MODEL_CORE } from "./model-core.mjs";
import { MODEL_GRAPH } from "./model-graph.mjs";
import { MODEL_ROUTING } from "./model-routing.mjs";
import { MODEL_DEVELOPMENT } from "./model-development.mjs";
export const MODEL = Object.freeze({ ...MODEL_CORE, records: Object.freeze([...RECORDS_1, ...RECORDS_2]), ...MODEL_GRAPH, ...MODEL_ROUTING, ...MODEL_DEVELOPMENT });
