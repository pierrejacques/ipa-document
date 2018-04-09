<template>
    <div class="markdown-body markdown-wrapper" v-html="html"></div>
</template>
<script>
import showdown from 'showdown';

const converter = new showdown.Converter();

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
