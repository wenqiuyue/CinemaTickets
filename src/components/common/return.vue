<template>
    <van-nav-bar :title="title" :left-arrow="left" @click-left="onClickLeft" class="title" />
</template>
<script>
import Vue from 'vue';
import { NavBar } from 'vant';

Vue.use(NavBar);
export default {
    nama: 'returnH',
    props: {
        title: String,
        left: { type: Boolean, default: true }
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    background: #545c64;
    .van-nav-bar__title,
    .van-nav-bar__text {
        color: white;
    }
}
.van-nav-bar .van-icon {
    color: white;
}
</style>