<template>
    <div class="doc-wrapper">
        <aside class="aside box scroll">
            <header class="header">
                <router-link to="/">
                    <img src="../../asset/img/logo.svg" class="logo" alt=""> 
                </router-link>
            </header>
            <el-autocomplete
                class="auto-complete"
                v-model="keyword"
                :fetch-suggestions="search"
                placeholder="搜索文档"
                @select="selectMenu"
            >
                <template slot-scope="props">
                    <div class="name">{{ props.item.name }}</div>
                </template>
            </el-autocomplete>
            <aside-menu 
                class="menu" 
                :menu="menu" 
                :current="current" 
                @select="selectMenu"
            />
        </aside>
        <main 
            ref="content" 
            class="content scroll" 
            @wheel.passive="onWheel"
            @click.stop="onClickContent">
            <md 
                :input="content" 
                @ready="makeMenu"
            />
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import Md from '@/components/markdown';
import Menu from './menu';
import { setTimeout } from 'timers';

let article = null;

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
            current: null,
            keyword: '',
            article: null,
        };
    },
    mounted() {
        axios.get('/static/document.md').then(res => {
            this.content = res.data;
        });
    },
    methods: {
        makeMenu(art) {
            article = art;
            article.setWrapper(this.$refs.content);
            this.menu = article.menu;
            this.$nextTick(() => {
                this.current = article.updateCurrent();
                article.scrollToFrac(article.fraction);
            })
        },
        onClickContent(e) {
            const target = e.target;
            if (target.info) {
                this.current = article.scrollToDom(target);
                article.fraction = this.current.frac;
            }
            if (target.href) {
                this.$nextTick(() => {
                    article.scrollToFrac(article.fraction);
                });
            }
        },
        selectMenu(info) {
            this.current = article.scrollToDom(info.dom);
            article.fraction = this.current.frac;
        },
        onWheel() {
            if (article) {
                this.current = article.updateCurrent();
            }
        },
        search(keyword, cb) {
            cb(article ? article.search(this.keyword) : []);
        }
    }
}
</script>

<style lang="less" scoped>
@import url(../../asset/style/atom.less);

.doc-wrapper {
    display: grid;
    grid-template-columns: 290px auto;
    height: 100vh;
    overflow: hidden;
    @header-h: 140px;

    .aside {
        max-height: 100%;
        z-index: 1;
        overflow: hidden;
        padding: 20px 30px;
        .header {
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: @header-h;
            text-align: center;
        }
        .logo {
            width: 60%;
            margin: auto;
        }
        .title {
            font-size: 22px;
            color: #b9a7a7;
        }
        .auto-complete {
            width: 100%;
            margin: 15px 0 20px;
        }
        .menu {
            height: calc(100% - @header-h);
        }
    }

    .content {
        padding: 50px 0 30vh;
    }    
}
</style>
