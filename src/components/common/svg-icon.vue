<template>
    <div>
        <van-icon :name="name" :color="color" :size="size" />
    </div>
</template>
<script>
import Vue from 'vue';
import { Icon } from 'vant';
Vue.use(Icon);
export default {
    name: 'svg-icon',
    props: {
        name: String,
        color: String,
        size: String
    }
};
</script>
<style lang="scss" scoped>
</style>