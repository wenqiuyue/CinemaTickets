<template>
    <div class="myorder">
        <return-h title="订单列表"></return-h>
        <van-tabs v-model="active">
            <van-tab title="全部"></van-tab>
            <van-tab title="待使用"></van-tab>
            <van-tab title="已完成"></van-tab>
        </van-tabs>
        <div class="body" v-if="orderList">
            <van-panel
                :title="item.film.mname"
                :status="item.state"
                class="order"
                v-for="(item,index) in orderListData"
                :key="index"
                @click="orderInfo(item)"
            >
                <div class="order_container">
                    <div>
                        <van-image
                            width="5rem"
                            height="5rem"
                            radius="5px"
                            fit="cover"
                            :src="item.film.mpicture"
                        />
                    </div>
                    <div class="order_info">
                        <span>放映厅：{{item.exclusivePiece.pid}}号厅</span>
                        <span>场次：{{item.exclusivePiece.timebegin | dateFormat}}</span>
                        <span>数量：{{item.oprice/item.exclusivePiece.mprice}} 张</span>
                        <span>总价：￥{{item.oprice}}</span>
                    </div>
                </div>
            </van-panel>
        </div>
    </div>
</template>
<script>
import * as api from '../../../api/index';
import Vue from 'vue';
import { Panel, Image, Toast, Tab, Tabs } from 'vant';

Vue.use(Panel)
    .use(Image)
    .use(Toast)
    .use(Tab)
    .use(Tabs);
export default {
    name: 'myorder',
    data() {
        return {
            orderList: null,
            active: 0,
            toBeUsed: false, //待使用
            completed: false //已完成
        };
    },
    computed: {
        /**
         * 订单筛选
         */
        orderListData() {
            return this.orderList
                .filter(m => {
                    return this.active === 1 ? new Date(m.exclusivePiece.timebegin).valueOf() > new Date().valueOf() : true;
                })
                .filter(m => {
                    return this.active === 2 ? new Date(m.exclusivePiece.timebegin).valueOf() < new Date().valueOf() : true;
                });
        }
    },
    watch: {},
    created() {
        this.getOrder();
    },
    methods: {
        getOrder() {
            let userinfo = localStorage.getItem('USER_INFO');
            if (userinfo) {
                userinfo = JSON.parse(userinfo);
            }
            api.GetUserOrderList({ uid: userinfo.uid }).then(res => {
                if (res.code === 0) {
                    res.body.forEach(element => {
                        if (new Date(element.exclusivePiece.timebegin).valueOf() > new Date().valueOf()) {
                            element.state = '待使用';
                        } else {
                            element.state = '已完成';
                        }
                    });
                    this.orderList = res.body;
                } else {
                    Toast(res.message);
                }
            });
        },
        orderInfo(order) {
            this.$router.push({ path: '/order', query: { oid: order.oid } });
        }
    }
};
</script>
<style lang="scss" scoped>
.myorder {
    height: 100%;
    .body {
        height: calc(100% - 100px);
        overflow-x: hidden;
        overflow-y: scroll;
        background: #f0f0f0;
        padding: 5px 8px;
        .order {
            margin-bottom: 5px;
        }
        .order,
        .van-panel__header {
            border-radius: 10px;
        }
        .order_container {
            padding: 10px 16px;
            display: flex;
            flex-direction: row;
            .order_info {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                margin-left: 18px;
                font-size: 13px;
                color: #666666;
            }
        }
    }
}
</style>