<template>
    <div class="markdown-body markdown-wrapper" v-html="html"></div>
</template>
<script>
import showdown from 'showdown';
import hljs from 'highlight.js';

const converter = new showdown.Converter({
    extensions: function() {
        const htmlunencode = (text) => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        return [{
            type: 'output',
            filter: function (text, converter, options) {
                // use new shodown's regexp engine to conditionally parse codeblocks
                var left  = '<pre><code\\b[^>]*>',
                    right = '</code></pre>',
                    flags = 'g',
                    replacement = function (wholeMatch, match, left, right) {
                    // unescape match to prevent double escaping
                    match = htmlunencode(match);
                    return left + hljs.highlightAuto(match).value + right;
                    };
                return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
            }
        }];
    }()
});

export default {
    name: 'markdown',
    props: ['input'],
    computed: {
        html() {
            return converter.makeHtml(this.input);
        }
    }
}
</script>

<style lang="less" scoped>
.markdown-wrapper {
    display: inline-block;
    padding: 0 0 30vh;
}
</style>
