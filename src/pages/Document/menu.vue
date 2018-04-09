<template>
    <div>
        <ul>
            <li v-for="(item, i) in menu" :key="i" @click.stop="$emit('select', item)">
                {{item.name}}
                <ul v-if="item.children && item.children.length">
                    <li v-for="(sub, j) in item.children" :key="j" @click.stop="toggle(sub);$emit('select', sub)">
                        {{sub.name}}
                        <ul v-if="sub.children && sub.children.length && isOpen[sub.anchor]">
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
            console.log(this.isOpen);
        },
        toggle(item) {
            const { anchor } = item;
            this.isOpen[anchor] = !this.isOpen[anchor];
            this.$forceUpdate();
        },
    }
}
</script>

<style>

</style>
