<template>
    <div>
        <van-tabbar route>
            <van-tabbar-item replace to="/filmIndex" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item replace to="/my" icon="user-circle-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar).use(TabbarItem);
export default {
    name: 'userheader'
};
</script>
<style lang="scss" scoped>
</style>