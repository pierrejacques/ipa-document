<template>
    <div class="markdown-body markdown-wrapper markdown-pointer" v-html="html"></div>
</template>

<script>
import Article from '@/utils/Article';

export default {
    name: 'markdown',
    props: {
        input: {
            type: String,
            default: '',
        },
        interactive: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        html() {
            if (!this.input) return '';
            const article = new Article(
                this.input,
                this.interactive,
                ['h2', 'h3', 'h4'],
            );
            this.$emit('ready', article);
            return article.html;
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
