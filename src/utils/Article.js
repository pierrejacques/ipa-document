import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { POINT_CONVERSION_COMPRESSED } from 'constants';
import { encode } from 'punycode';

const CALIB = 100;

let last = null;
let first;

const getName = (str, tag) => {
    const last = arr => arr[arr.length - 1];
    let temp = str.match(new RegExp(`>(.+)<\/${tag}>`))[1];
    ['、', ',', '.'].forEach(ch => {
        temp = last(temp.split(ch));
    });
    return temp;
}

class InfoItem {
    constructor({ name, anchor, frac, pre, attr }) {
        this.name = name;
        this.anchor = anchor;
        this.frac = frac;
        this.pre = pre;
        this.post = null;
        this.$dom = null;
        this.attr = attr;
    }

    get dom() {
        if (this.$dom) return this.$dom;
        let pointer = first;
        [...document.querySelectorAll(`[${this.attr}]`)].forEach((dom) => {
            pointer.$dom = dom;
            dom.info = pointer;
            pointer = pointer.post;
        });
        return this.$dom;
    }
}

function mark (
    html,
    tags,
    attr,
    list,
    fracPre = null,
    anchorPre = null,
) {
    const tag = tags[0];
    return html.split(`<${tag}`).reduce((str, current, i) => {
        if (i > 0) {
            const name = getName(current, tag);
            const frac = fracPre === null ? name : `${fracPre}-${name}`;
            const anchor = anchorPre === null ? `${i}` : `${anchorPre}-${i}`;
            const insert = `<${tag} ${attr}="${anchor}"`;
            const item = new InfoItem({
                name,
                anchor,
                frac,
                attr,
                pre: last,
            });
            if (last) {
                last.post = item;
            }
            if (!first) {
                first = item;
            }
            last = item;
            if (tags[1]) {
                item.children = [];
                list.push(item);
                const trans = mark(
                    current,
                    tags.slice(1),
                    attr,
                    list[list.length - 1].children,
                    frac,
                    anchor,
                );
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

export default class Article {
    constructor(
        md, 
        interactive = true, 
        tags = ['h1', 'h2', 'h3'],
        attr = 'data-anchor',
    ) {
        const markdownit = new MarkdownIt({
            highlight: (str, lang) => lang ? hljs.highlight(lang, str).value : '',
        });
        this.html = markdownit.render(md);
        this.menu = [];
        this.$current = null;
        this.first = null;
        this.wrapper = null;
        if (interactive) {
            this.html = mark(this.html, tags, attr, this.menu);
            this.first = first;
            this.$current = first;
        }
    }

    setWrapper(dom) {
        this.wrapper = dom;
    }

    scrollToFrac(frac) {
        let pointer = first;
        while (pointer) {
            if (encodeURI(pointer.frac) === encodeURI(frac)) {
                return this.scrollToDom(pointer.dom);
            }
            pointer = pointer.post;
        }
    }

    scrollToDom(dom) {
        this.$current = dom.info;
        this.scrollTo(dom.offsetTop);
        return this.$current;
    }

    scrollTo(position) {
        this.wrapper.scrollTop = position;
    }

    get current() {
        const position = this.wrapper.scrollTop + CALIB;
        if (this.$current.pre && position < this.$current.dom.offsetTop) {
            this.$current = this.$current.pre;
            return this.$current;
        }
        if (this.$current.post && position > this.$current.post.dom.offsetTop) {
            this.$current = this.$current.post;
            return this.$current;
        }
        return this.$current;
    }

    search(keyword) {
        const result = [];
        if (!keyword) return result;
        const regexp = new RegExp(keyword, 'i');
        let pointer = first;
        while (pointer) {
            if (regexp.test(pointer.name)) {
                result.push(pointer);
            }
            pointer = pointer.post;
        }
        return result;
    }
}