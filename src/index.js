import { schema, filter } from "./schema";
import Types from "./types";

export default function(data) {
    let types = new Types(),
        filter = schema(data, types);
    filter.types = types;
    return filter;
}
