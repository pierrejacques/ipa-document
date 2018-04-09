<template>
    <div class="doc-wrapper">
        <aside class="aside box">
            <header class="header">
                <router-link to="/">
                    <img src="../../asset/img/logo.svg" class="logo" alt="">
                </router-link>
            </header>
            <aside-menu :menu="menu" @select=""/>
        </aside>
        <main class="content">
            <md :input="content" @ready="makeMenu"/>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import Md from '@/components/markdown';
import Menu from './menu';

export default {
    name: 'document',
    components: {
        'md': Md,
        'aside-menu': Menu,
    },
    data() {
        return {
            content: '',
            menu: [],
        };
    },
    created() {
        axios.get('static/document.md').then(res => {
            this.content = res.data;
        })
    },
    methods: {
        makeMenu(menu) {
            this.menu = menu;
        }
    }
}
</script>

<style lang="less" scoped>
@import url(../../asset/style/atom.less);

.doc-wrapper {
    display: grid;
    grid-template-columns: 300px auto;
    .header {
        .logo {
            width: 60%;
        }
    }

    .aside {
        z-index: 1;
    }

    .content {
        height: 100vh;
        overflow: auto;
        padding: 50px 0 0;
    }
    
}
</style>
