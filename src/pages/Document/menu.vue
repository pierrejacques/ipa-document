<template>
    <div>
        <ul>
            <li v-for="(item, i) in menuList" :key="i" @click.stop="$emit('select', item)">
                {{item.name}}
                <ul v-if="item.children && item.children.length">
                    <li v-for="(sub, j) in item.children" :key="j" @click.stop="open(sub);$emit('select', sub)">
                        {{sub.isOpen}}
                        <ul v-if="sub.children && sub.children.length && sub.isOpen">
                            <li v-for="(leaf, k) in sub.children" :key="k" @click.stop="$emit('select', leaf)">
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
    computed: {
        menuList() {
            const temp = this.menu;
            temp.forEach(i => {
                i.children.forEach(j => {
                    j.isOpen = false;
                });
            });
            return temp;
        }
    },
    methods: {
        open(item) {
            item.isOpen = !item.isOPen;
        }
    }
}
</script>

<style>

</style>
