export default function parse(str) {
    let open = 0,
        current = "",
        block = [],
        index,
        fun = "",
        args = [],
        quote1 = 0,
        quote2 = 0;

    str = str + " ";

    for (let i = 0; i < str.length; i++) {
        let letter = str[i];
        switch (letter) {
            case "'":
                if (open) {
                    if (!quote1) {
                        quote1++;
                    } else {
                        quote1--;
                    }
                }
                current += letter;
                break;
            case '"':
                if (open) {
                    if (!quote2) {
                        quote2++;
                    } else {
                        quote2--;
                    }
                }
                current += letter;
                break;
            case "(":
                if (quote1 || quote2) {
                    current += letter;
                    continue;
                }
                if (!open) {
                    fun = current;
                    current = "";
                } else {
                    current += letter;
                }
                open++;
                break;
            case ")":
                if (quote1 || quote2) {
                    current += letter;
                    continue;
                }
                open--;
                if (!open) {
                    args.push(current);
                    current = fun;
                } else {
                    current += letter;
                }
                break;

            case ",":
                if (open === 1) {
                    args.push(current);
                    current = "";
                } else {
                    current += letter;
                }
                break;
            case " ":
            case "\n":
                if (!current) continue;
                if (open) {
                    current += letter;
                } else {
                    index = block.push({
                        fun: current,
                        args: args.map(str => {
                            let quote = str.match(/^(')(.+)(')$/);
                            quote = quote || str.match(/^(")(.+)(")$/);
                            if (quote) {
                                return quote[2];
                            } else {
                                return JSON.parse(str);
                            }
                        })
                    });
                    current = "";
                    args = [];
                }
                break;
            default:
                current += letter;
        }
    }
    return block;
}
