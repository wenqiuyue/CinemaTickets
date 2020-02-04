<template>
    <div class="my" v-if="userInfo">
        <return-h title="我的" :left="false"></return-h>
        <div class="body">
            <div class="head" @click="setInfo">
                <div>
                    <van-image
                        round
                        width="5rem"
                        height="5rem"
                        :src="userInfo.upicture?userInfo.upicture:circleUrl"
                    />
                    <span>{{userInfo.username}}</span>
                </div>
                <svgIcon name="arrow" size="20" class="arrow"></svgIcon>
            </div>
            <div class="order" @click="myOrder">
                <svgIcon name="balance-list-o" size="22" class="balance" color="#09C261"></svgIcon>
                <span>我的订单</span>
            </div>
            <div class="order" @click="myFilm">
                <svgIcon name="shop-collect-o" size="22" class="balance" color="#F7575A"></svgIcon>
                <span>想看的电影</span>
            </div>
            <div class="order" @click="setSafe">
                <svgIcon name="edit" size="22" class="balance" color="#FA9E3C"></svgIcon>
                <span>安全设置</span>
            </div>
        </div>
        <userHeader></userHeader>
    </div>
</template>
<script>
import * as api from '../../../api/index';
import userHeader from '../../common/UserHeader.vue';
import returnH from '../../common/return.vue';
import Vue from 'vue';
import { Image, Toast } from 'vant';
Vue.use(Image).use(Toast);
export default {
    name: 'my',
    components: {
        userHeader,
        returnH
    },
    data() {
        return {
            circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            userInfo: null //用户信息
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        /**
         * 获取用户信息
         */
        getUserInfo() {
            let userinfo = localStorage.getItem('USER_INFO');
            if (userinfo) {
                userinfo = JSON.parse(userinfo);
            }
            api.GetNameAndPicById({ uid: userinfo.uid }).then(res => {
                if (res.code === 0) {
                    this.userInfo = res.body;
                } else {
                    Toast(res.message);
                }
            });
        },
        /**
         * 进入修改信息
         */
        setInfo() {
            this.$router.push({ path: '/setinfo', query: { uid: 1 } });
        },
        myOrder() {
            this.$router.push('/myorder');
        },
        myFilm() {
            this.$router.push('/myfilm');
        },
        setSafe() {
            this.$router.push('/setsafe');
        }
    }
};
</script>
<style lang="scss" scoped>
.my {
    height: 100%;
    background: #f8f8f8;
    .body {
        .head {
            background: #fff;
            padding: 15px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
                margin-left: 20px;
            }
            div {
                display: flex;
                align-items: center;
            }
        }
        .order {
            background: #fff;
            margin-top: 5px;
            padding: 12px 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            span {
                margin-left: 10px;
                font-size: 14px;
            }
        }
    }
}
</style>