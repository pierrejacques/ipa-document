<template>
    <div class="intro-page">
        <header class="header box">
            <hgroup class="hgroup">
                <h1 class="title">IPA.js</h1>
                <h2 class="sub-title">javascript声明式数据结构校验库</h2>
            </hgroup>
            <div class="btn-group">
                <router-link class="btn dark" to="doc">document</router-link>
                <a class="btn" target="_blank" href="https://github.com/pierrejacques/IPA.js">repository</a>
            </div>

        </header>
        <main class="content box" @click="onClickContent">
            <!-- <p class="pre-intro">
                IPA是一个声明式数据结构校验库。
                通过先声明后操作的方式实现对数据结构的校验、保障和随机生成。
                将IPA应用于浏览器端或node端的数据接口层，可以最大程度地避免代码受不安全数据的威胁而产生异常。
                IPA采用先编译后执行的实现策略，运行迅速。
            </p> -->
            <md :input="content" :interactive="false"/>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import md from '@/components/markdown';
import linkto from '@/utils/linkto';

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
    methods: {
        onClickContent(e) {
            if (e.target.href) {
                linkto(e.target.href);
                e.preventDefault();
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url(../asset/style/variable.less);
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
        height: 90px;
        padding: 10px @margin;
        .hgroup {
            flex-grow: 1;
            // margin-left: 20px;
            padding-left: 20px;
            // border-left: 5px solid @light-color;
        }
        .title {
            margin: 0;
            font-size: 30px;
            font-weight: 800;
            // font-family: serif;
            color: #4d4d4d;
        }
        .sub-title {
            margin: 0;
            line-height: 26px;
            font-size: 14px;
            font-weight: 400;
            color: #8a8a8a;
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
