<template>
    <div class="markdown-body markdown-wrapper" v-html="html"></div>
</template>

<script>
import showdown from 'showdown';
import highlight from 'showdown-highlight';
import menulize from '@/utils/showdown-menulize';

export default {
    name: 'markdown',
    props: ['input'],
    computed: {
        html() {
            const converter = new showdown.Converter({
                extensions: [
                    highlight,
                    menulize(['h2', 'h3', 'h4'], 'data-anchor', (menu) => {
                        this.$emit('ready', menu);
                    }),
                ],
            });
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
