<template>
    <div class="myorder">
        <return-h title="订单列表"></return-h>
        <div class="body" v-if="orderList">
            <van-panel
                :title="item.film.mname"
                status="状态"
                class="order"
                v-for="(item,index) in orderList"
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
                            src="https://img.yzcdn.cn/vant/cat.jpeg"
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
import { Panel, Image, Toast } from 'vant';

Vue.use(Panel)
    .use(Image)
    .use(Toast);
export default {
    name: 'myorder',
    data() {
        return {
            orderList: null
        };
    },
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
        height: calc(100% - 56px);
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