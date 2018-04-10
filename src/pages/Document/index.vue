<template>
    <div class="doc-wrapper">
        <aside class="aside box scroll">
            <header class="header">
                <router-link to="/">
                    <img src="../../asset/img/logo.svg" class="logo" alt="">
                </router-link>
            </header>
            <label class="label" for="">
                <input type="text">
            </label>
            <aside-menu class="menu" :menu="menu" @select="selectMenu"/>
        </aside>
        <main ref="content" class="content scroll" @wheel.passive="onWheel" @click.stop="clickContent">
            <md :input="content" @ready="makeMenu"/>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
import IScroll from 'iscroll';
import Md from '@/components/markdown';
import Menu from './menu';
import { setTimeout } from 'timers';

let scroller = null;
let lastWidth;
let posIdx = 0;
let doms = null;
let linearMenu = []; // 存放页面锚点位置

function updateLinear (menu) {
    const linearize = (arr) => {
        arr.forEach(item => {
            linearMenu.push(item);
            if (item.children) {
                linearize(item.children);
            }
        });
    };
    linearMenu = [];
    linearize(menu);
    updatePosition();
};

function updatePosition () {
    const attr = 'data-anchor';
    if (doms === null) {
        doms = [...document.querySelectorAll(`[${attr}]`)];
        doms.forEach((dom, idx) => {
            dom.info = linearMenu[idx];
        })
    }
    doms.forEach((i, idx) => {
        linearMenu[idx].position = i.offsetTop;
    });
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
            ready: false,
            current: null,
        };
    },
    mounted() {
        axios.get('static/document.md').then(res => {
            this.content = res.data;
        });
        window.addEventListener('resize', () => {
            const width = document.body.clientWidth;
            if (width !== lastWidth) {
                updatePosition();
                lastWidth = width;
            }
        });
    },
    methods: {
        makeMenu(menu) {
            this.menu = menu;
            this.ready = true;
            this.current = menu[0];
            this.$nextTick(() => {
                updateLinear(menu);
                scroller = new IScroll(this.$refs.content);
            });
        },
        selectMenu(item) {
            console.log(item.anchor);
        },
        clickContent(e) {
            const target = e.target;
            if (target.info) {
                this.current = target.info;
                location.hash = '#/' + location.hash.split('#/')[1].split('#')[0] +
                    '#' + target.info.frac; // set fraction
            }
        },
        onWheel() {
            if (this.ready) {
                const pos = this.$refs.content.scrollTop + 100;
                if (posIdx < linearMenu.length - 1 && pos > linearMenu[posIdx + 1].position) {
                    posIdx = posIdx + 1;
                    this.current = linearMenu[posIdx];
                    return;
                }
                if (pos < this.current.position && posIdx > 0) {
                    posIdx = posIdx - 1;
                    this.current = linearMenu[posIdx];
                    return;
                }
            }
        },
    }
}
</script>

<style lang="less" scoped>
@import url(../../asset/style/atom.less);

.doc-wrapper {
    display: grid;
    grid-template-columns: 300px auto;
    height: 100vh;
    overflow: hidden;
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
        overflow: hidden;
    }

    .content {
        padding: 50px 0 0;
    }    
}
</style>
