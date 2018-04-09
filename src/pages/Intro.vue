<template>
    <div class="intro-page">
        <header class="header box">
            <img src="../asset/img/logo.svg" class="logo" alt="">
            <hgroup class="hgroup">
                <h1 class="title">IPA.js</h1>
                <h2 class="sub-title">javascript声明式数据结构校验库</h2>
            </hgroup>
            <div class="btn-group">
                <router-link class="btn dark" to="doc">document</router-link>
                <a class="btn" target="_blank" href="https://github.com/pierrejacques/IPA.js">repository</a>
            </div>

        </header>
        <main class="content box">
            <md :input="content"/>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import md from '@/components/markdown';

export default {
    name: 'intro',
    data() {
        return {
            content: '',
        }
    },
    components: {
        md,
    },
    created() {
        axios.get('/static/intro.md').then(res => {
            this.content = res.data;
        });
    },
}
</script>

<style lang="less" scoped>
@import url(../asset/style/atom.less);

.intro-page {
    background: #eee;
    padding-bottom: 50px;
    @margin: 150px;

    // layout
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        height: 110px;
        padding: 10px @margin;
        .hgroup {
            flex-grow: 1;
            margin-left: 20px;
            // border-left: 2px solid #ccc;
        }
        .title {
            margin: 0;
            font-size: 30px;
            font-weight: 400;
            // font-family: serif;
            color: #666;
        }
        .sub-title {
            margin: 0;
            line-height: 26px;
            font-size: 14px;
            font-weight: 400;
            color: #aaa;
        }
    }

    .content {
        min-height: 100vh;
        margin: 35px @margin 0;
        background: white;
    }

    .logo {
        height: 70px;
    }
}
</style>
