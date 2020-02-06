<template>
    <div>
        <van-tabbar v-model="active" @change="change">
            <van-tabbar-item icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item icon="user-circle-o">我的</van-tabbar-item>
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
            active: 0
        };
    },
    methods: {
        change(active) {
            this.active = active;
            if (this.active === 0) {
                this.$router.push('/filmIndex');
            } else {
                this.$router.push('/my');
            }
            console.log(active);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>