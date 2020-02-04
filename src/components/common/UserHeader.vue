<template>
    <div>
        <van-tabbar v-model="active">
            <van-tabbar-item replace to="/filmIndex" icon="home-o" name="home">首页</van-tabbar-item>
            <van-tabbar-item replace to="/my" icon="user-circle-o" name="my">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar).use(TabbarItem);
export default {
    name: 'userheader',
    data() {
        return {
            active: 'home'
        };
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
</style>