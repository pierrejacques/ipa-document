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
            const temp = current.match(new RegExp(`>(.+)<\/${tag}>`))[1].split('、');
            const name = temp[temp.length - 1]; // 去除标号
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

module.exports = (tags, attr = 'data-anchor', callback) => ({
    type: 'output',
    filter(text) {
        const rootMenu = [];
        const result = mark({
            text,
            tags,
            attr,
            list: rootMenu,
        });
        callback(rootMenu);
        return result;
    },
});