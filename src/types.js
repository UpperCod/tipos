export default class Types {
    type(next, data, isType, message) {
        let [all, type = ""] = {}.toString.call(data).match(/ ([^\]]+)/) || [];
        return type.toLowerCase() === isType
            ? next(data)
            : {
                  valid: false,
                  data
              };
    }
    equal(next, data, compare) {
        return compare === data ? next(data) : { valid: false, data };
    }
    minLength(next, data, min) {
        return data.length >= min ? next(data) : { valid: false, data };
    }
    maxLength(next, data, max) {
        return data.length <= max ? next(data) : { valid: false, data };
    }
    default(next, data, optional) {
        return next(data !== undefined ? data : optional);
    }
    min(next, data, min) {
        return data >= min ? next(data) : { valid: false, data };
    }
    max(next, data, max) {
        return data <= max ? next(data) : { valid: false, data };
    }
    not(next, data, compare) {
        return compare !== data ? next(data) : { valid: false, data };
    }
    option(next, data, ...opts) {
        return opts.indexOf(data) > -1
            ? next(data)
            : {
                  valid: false,
                  data
              };
    }
}
