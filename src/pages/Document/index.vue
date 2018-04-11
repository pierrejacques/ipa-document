<template>
    <div class="doc-wrapper">
        <aside class="aside box scroll">
            <header class="header">
                <router-link to="/">
                    <img src="../../asset/img/logo.svg" class="logo" alt=""> 
                </router-link>
                <!-- <h1 class="title">IPA.js文档</h1> -->
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

let chain = null;
const CALIB = 50;

class Chain {
    constructor(menu, scroller) {
        this.chain = [];
        const linearize = (arr) => {
            arr.forEach(item => {
                this.chain.push(item);
                if (item.children) {
                    linearize(item.children);
                }
            });
        };
        linearize(menu);
        [...document.querySelectorAll('[data-anchor]')].forEach((dom, idx) => {
            this.chain[idx].dom = dom;
            dom.info = this.chain[idx];
            dom.info.pre = idx > 0 ? this.chain[idx - 1] : false;
            dom.info.post = idx < this.chain.length - 1 ? this.chain[idx + 1] : false;
        });
        this.current = this.chain[0];
        this.scroller = scroller;
    }

    getCurrent() {
        const position = this.scroller.scrollTop + CALIB;
        if (this.current.pre && position < this.current.dom.offsetTop) {
            this.current = this.current.pre;
            return this.current;
        }
        if (this.current.post && position > this.current.post.dom.offsetTop) {
            this.current = this.current.post;
            return this.current;
        }
        return this.current;
    }

    scrollTo(dom) {
        this.current = dom.info;
        this.scroller.scrollTop = dom.offsetTop;
        location.hash = '#/' + location.hash.split('#/')[1].split('#')[0] +
            '#' + dom.info.frac; // set fraction
        return this.current;
    }

    search(keyword) {
        if (!keyword) return [];
        const regexp = new RegExp(keyword, 'i');
        return this.chain.filter(item => regexp.test(item.name));
    }
}

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
        };
    },
    mounted() {
        axios.get('static/document.md').then(res => {
            this.content = res.data;
        });
    },
    methods: {
        makeMenu(menu) {
            this.menu = menu;
            this.$nextTick(() => {
                chain = new Chain(menu, this.$refs.content);
                this.current = chain.getCurrent();
            });
        },
        onClickContent(e) {
            const target = e.target;
            if (target.info) {
                chain.scrollTo(target);
            }
        },
        selectMenu(info) {
            this.current = chain.scrollTo(info.dom);
        },
        onWheel() {
            if (chain) {
                this.current = chain.getCurrent();
            }
        },
        search(keyword, cb) {
            cb(chain ? chain.search(this.keyword) : []);
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
            opacity: 0.8;
            transition: 0.3s;
            &:hover {
                opacity: 1;
            }
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
