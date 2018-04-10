<template>
        <div class="scroll">
            <ul class="menu-list ul-1">
                <li class="li-1" 
                    v-for="(item, i) in menu" 
                    :key="i" 
                    @click.stop="$emit('select', item)">
                    {{item.name}}
                    <ul class="ul-2" v-if="item.children && item.children.length">
                        <li class="li-2"
                            v-for="(sub, j) in item.children" 
                            :key="j" 
                            @click.stop="toggle(i, j);$emit('select', sub)">
                            {{sub.name}}
                            <ul class="ul-3"
                                v-if="sub.children && sub.children.length && openIdx[i] === j">
                                <li class="li-3" 
                                    v-for="(leaf, k) in sub.children" 
                                    :key="k" 
                                    @click.stop="$emit('select', leaf)">
                                    {{leaf.name}}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
</template>

<script>
export default {
    name: 'aside-menu',
    props: {
        menu: {
            type: Array,
            default: () => [],
        }
    },
    data() {
        return {
            openIdx: [],
        }
    },
    created() {
        this.reset();
    },
    watch: {
        menu(nv) {
            this.reset()
        }
    },
    methods: {
        reset() {
            this.menu.forEach(i => {
                this.openIdx.push(null)
            });
        },
        toggle(i, j) {
            if (this.openIdx[i] === j) {
                this.openIdx[i] = null;
            } else {
                this.openIdx[i] = j;
            }
            this.$forceUpdate(); // FIXME: ugly
        },
    }
}
</script>

<style lang="less" scoped>
@import url(../../asset/style/atom.less);

@pad: 20px;
@line-h: 30px;

ul {
    padding: 0;
    padding-bottom: 10px;
    font-size: 14px;
    li {
        list-style: none;
        padding-left: @pad;
        padding-right: @pad;
        cursor: pointer;
        line-height: @line-h;
        font-weight: 800;
        letter-spacing: .1em;
    }
}

.li-1 {
    color: #777;
    font-size: 14px;
}

.li-2 {
    color: #aaa;
    font-size: 12px;
}

.li-3 {
    color: #aaa;
    font-size: 12px;
}


    .label {
        font-weight: 800;
        color: #aaa; 
        margin-left: 10%;
        margin-bottom: 20px;
        input {
            line-height: 20px;
            font-size: 16px;
            width: 80%;
        }
    }
    .menu-list {
        display: inline-block;
        padding-left: 30px;
        padding-bottom: 100px;
    }


</style>
