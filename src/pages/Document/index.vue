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
                    <span 
                        :style="{ 
                            color: '#ccc',
                            fontSize: '12px',
                            lineHeight: '12px',
                        }"
                    >{{ props.item.frac.replace('-', ' > ') }}</span>
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
        <a 
            @click="toTop" 
            class="to-top"
            :class="{ active: showToTop }"
        />
    </div>
</template>

<script>
import axios from 'axios';
import Md from '@/components/markdown';
import Menu from './menu';
import linkto from '@/utils/linkto';

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
            showToTop: false,
            location: null,
        };
    },
    mounted() {
        axios.get('static/document.md').then(res => {
            this.content = res.data;
        });
    },
    watch: {
        current(v) {
            if (article.ready) {
                this.showToTop = document.body.clientHeight < article.wrapper.scrollTop;
            }
        },
    },
    methods: {
        makeMenu(art) {
            article = art;
            article.initDom(this.$refs.content);
            this.menu = article.menu;
            this.current = article.scrollToFrac(article.fraction);
            this.location = window.location;
        },
        onClickContent(e) {
            const target = e.target;
            if (target.info) {
                this.current = article.scrollToDom(target);
                article.fraction = this.current.frac;
            }
            if (target.href) {
                linkto(target.href, () => {
                    article.scrollToFrac(article.fraction);
                });
                e.preventDefault();
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
        },
        toTop() {
            this.current = article.scrollToDom(article.first.dom);
        },
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

    .to-top {
        @size: 50px;
        display: block;
        position: fixed;
        z-index: 1;
        bottom: -@size;
        right: 50px;
        width: @size;
        height: @size;
        line-height: @size;
        background: white;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0.7;
        transition: 0.3s;
        box-shadow: 0 1px 5px #0005;
        &.active {
            bottom: 70px;
        }
        &:hover {
            opacity: 1;
        }
        &::before {
            @arrow: 15px;
            content: '';
            display: inline-block;
            position: absolute;
            height: @arrow;
            width: @arrow;
            line-height: @size;
            border: 2px solid silver;
            border-left: none;
            border-bottom: none;
            transform: rotate(-45deg);
            margin-top: (@size - @arrow) / 2 + 3px;
            margin-left: (@size - @arrow) / 2;
        }
    }
}
</style>
