<template>
    <div class="menu">
        <label class="label" for="">
            <input type="text">
        </label>
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
                            @click.stop="toggle(sub);$emit('select', sub)">
                            {{sub.name}}
                            <ul class="ul-3"
                                v-if="sub.children && sub.children.length && isOpen[sub.anchor]">
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
            isOpen: {},
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
                i.children.forEach(j => {
                    this.isOpen[j.anchor] = false;
                });
            });
        },
        toggle(item) {
            const { anchor } = item;
            this.isOpen[anchor] = !this.isOpen[anchor];
            this.$forceUpdate();
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
    font-size: 14px;
    li {
        list-style: none;
        padding-left: @pad;
        padding-right: @pad;
        cursor: pointer;
        line-height: @line-h;
        font-weight: 800;
        color: #aaa;
    }
}

.li-1 {
    color: #666;
}


.menu {
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
    }
}

</style>
