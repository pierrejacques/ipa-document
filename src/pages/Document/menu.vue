<template>
        <div class="scroll menu-wrapper">
            <ul class="menu-list ul-1">
                <li class="li-1"
                    :class="{ active: anchors.has(item.anchor) }"
                    v-for="(item, i) in menu" 
                    :key="i" 
                    @click.stop="$emit('select', item)">
                    {{item.name}}
                    <ul class="ul-2" v-if="item.children && item.children.length">
                        <li class="li-2"
                            :class="{ active: anchors.has(sub.anchor) }"
                            v-for="(sub, j) in item.children" 
                            :key="j" 
                            @click.stop="open(i, j);$emit('select', sub)">
                            {{sub.name}}
                            <ul class="ul-3"
                                v-if="sub.children && sub.children.length && openIdx[i] === j">
                                <li class="li-3"
                                    :class="{ active: anchors.has(leaf.anchor) }"
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
        },
        current: {},
    },
    data() {
        return {
            openIdx: [],
        }
    },
    created() {
        this.reset();
    },
    computed: {
        anchors() {
            const result = new Set();
            if (this.current) {
                const idxs = this.current.anchor.split('-');
                if (idxs.length === 3) {
                    this.open(idxs[0] - 1, idxs[1] - 1);
                }
                let base = idxs[0];
                result.add(base);
                idxs.forEach((i, idx) => {
                    if (idx > 0) {
                        base += `-${i}`;
                        result.add(base);
                    }
                });
            }
            return result;
        }
    },
    watch: {
        menu(nv) {
            this.reset()
        },
    },
    methods: {
        reset() {
            this.menu.forEach(i => {
                this.openIdx.push(null)
            });
        },
        open(i, j) {
            this.openIdx[i] = j;
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
    margin: 0;
    padding-bottom: 10px;
    font-size: 14px;
    li {
        list-style: none;
        padding-left: @pad;
        padding-right: @pad;
        cursor: pointer;
        line-height: @line-h;
        font-weight: 500;
        font-size: 13px;
        letter-spacing: .1em;
        color: #aaa;
        &.active {
            color: #6b392d;
        }
        &.li-1 {
            padding: 0;
        }
    }
}

.menu-wrapper {
    margin-top: 20px;
    .menu-list {
        display: inline-block;
        padding-bottom: 100px;
    }
}
</style>
