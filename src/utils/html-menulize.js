const getName = (str, tag) => {
    const last = arr => arr[arr.length - 1];
    let temp = str.match(new RegExp(`>(.+)<\/${tag}>`))[1];
    ['、', ',', '.'].forEach(ch => {
        temp = last(temp.split(ch));
    });
    return temp;
}

const mark = ({
    text,
    tags,
    fracPre = null,
    anchorPre = null,
    attr,
    list,
}) => {
    const tag = tags[0];
    return text.split(`<${tag}`).reduce((str, current, i) => {
        if (i > 0) {
            const name = getName(current, tag);
            const frac = fracPre === null ? name : `${fracPre}-${name}`;
            const anchor = anchorPre === null ? `${i}` : `${anchorPre}-${i}`;
            const insert = `<${tag} ${attr}="${anchor}"`;
            const item = { name, anchor, frac };
            if (tags[1]) {
                item.children = [];
                list.push(item);
                const trans = mark({
                    text: current,
                    tags: tags.slice(1),
                    fracPre: frac,
                    anchorPre: anchor,
                    attr,
                    list: list[list.length - 1].children,
                });
                return `${str}${insert}${trans}`;
            } else {
                list.push(item);
                return `${str}${insert}${current}`;
            }
        } else {
            return `${str}${current}`;
        }
    }, '');
};

module.exports = (text, tags, { attr = 'data-anchor', callback = null }) => {
    const rootMenu = [];
    const result = mark({
        text,
        tags,
        attr,
        list: rootMenu,
    });
    if (callback) callback(rootMenu);
    return result;
}