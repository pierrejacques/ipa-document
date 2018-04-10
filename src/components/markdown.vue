<template>
    <div class="markdown-body markdown-wrapper" v-html="html"></div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import menulize from '@/utils/html-menulize';

const md = new MarkdownIt({
    highlight: (str, lang) => lang ? hljs.highlight(lang, str).value : '',
});

export default {
    name: 'markdown',
    props: ['input'],
    computed: {
        html() {
            if (this.input === '') return '';
            return menulize(md.render(this.input), ['h2', 'h3', 'h4'], {
                attr: 'data-anchor',
                callback: (menu) => {
                    this.$emit('ready', menu);
                }
            });
        }
    },
}
</script>

<style lang="less" scoped>
.markdown-wrapper {
    display: inline-block;
    padding: 0 0 30vh;
}
</style>
