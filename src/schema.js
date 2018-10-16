import parse from "./parse";

export function schema(map, filters, structure = {}) {
    for (let prop in map) {
        let cursor = map[prop];
        switch (typeof cursor) {
            case "string":
                structure[prop] = parse(cursor)
                    .map(({ fun, args }) => {
                        let [all, method, optional] = fun.match(
                            /([^\?]+)(\?){0,1}/
                        );
                        optional = optional === "?";
                        return (next, data) => {
                            let state = filters[method](next, data, ...args);
                            return state.valid
                                ? state
                                : {
                                      ...state,
                                      optional,
                                      method: state.method || method
                                  };
                        };
                    })
                    .concat(data => ({ valid: true, data }))
                    .reduceRight((after, before) => data =>
                        before ? before(after, data) : data
                    );
                break;
            case "object":
                schema(map[prop], filters, (structure[prop] = {}));
                break;
        }
    }
    return data => filter(structure, data);
}

export function filter(structure, data = {}, parent) {
    let valid = {},
        invalid = {},
        count = { valid: 0, invalid: 0 };

    for (let prop in structure) {
        let promise,
            space = (parent ? parent + "." : "") + prop;
        if (typeof structure[prop] === "object") {
            let sub = filter(structure[prop], data[prop], space);
            count.valid += sub.count.valid;
            count.invalid += sub.count.invalid;
            if (sub.count.valid) valid[prop] = sub.valid;
            if (sub.count.invalid) {
                for (let prop in sub.invalid) {
                    if (!sub.optional) invalid[prop] = sub.invalid[prop];
                }
            }
        } else {
            let state = structure[prop](data[prop]);
            if (state.valid) {
                valid[prop] = state.data;
                count.valid++;
            } else {
                if (state.optional) continue;
                invalid[space] = state;
                count.invalid++;
            }
        }
    }

    return { valid, invalid, count };
}
