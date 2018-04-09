<template>
    <div class="doc-wrapper">
        <aside class="aside box scroll">
            <header class="header">
                <router-link to="/">
                    <img src="../../asset/img/logo.svg" class="logo" alt="">
                </router-link>
            </header>
            <aside-menu class="menu" :menu="menu" @select="selectItem"/>
        </aside>
        <main class="content scroll">
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
        },
        selectItem(item) {
            console.log(item.anchor);
        }
    }
}
</script>

<style lang="less" scoped>
@import url(../../asset/style/atom.less);

.doc-wrapper {
    display: grid;
    grid-template-columns: 300px auto;
    height: 100vh;
    @header-h: 150px;
    .header {
        height: @header-h;
        .logo {
            height: 80%;
        }
    }

    .menu {
        height: calc(100% - @header-h);
    }

    .aside {
        max-height: 100%;
        z-index: 1;
    }

    .content {
        padding: 50px 0 0;
    }


    
}
</style>
