<template>
    <div>
        <return-h title="订单详情"></return-h>
        <div class="body" v-if="orderInfo">
            <div class="order-info">
                <div>{{orderInfo.film.mname}}</div>
                <div>{{orderInfo.exclusivePiece.pid}}号厅 {{orderInfo.exclusivePiece.mlanguage}}/{{orderInfo.exclusivePiece.meffect}}</div>
                <div>开场时间：{{orderInfo.exclusivePiece.timebegin | dateFormat}}</div>
                <div>
                    <van-tag
                        v-for="(item,index) in orderInfo.seatSelectionList"
                        :key="index"
                        plain
                        class="seat"
                    >{{`${item.rowsel}排${item.columnsel}座`}}</van-tag>
                </div>
            </div>
            <van-divider />
            <div class="order-num">
                <label>订单编号：</label>
                {{ oid }}
            </div>
            <van-divider />
            <div class="qrcode-body">
                <div class="qrcode-tips">*凭订单编号或二维码前去电影院取票</div>
                <div class="qrcode" ref="qrCodeUrl"></div>
            </div>
        </div>
    </div>
</template>
<script>
import returnH from '../../common/return.vue';
import Vue from 'vue';
import { Card, Toast, Tag, Divider } from 'vant';
Vue.use(Card)
    .use(Toast)
    .use(Tag)
    .use(Divider);
import * as api from '../../../api/index';
import QRCode from 'qrcodejs2';
export default {
    name: 'order',
    components: {
        returnH
    },
    data() {
        return {
            oid: this.$route.query.oid, //订单编号
            orderInfo: null //订单信息
        };
    },
    mounted() {
        setTimeout(() => {
            this.creatQrCode();
        }, 1000);
    },
    created() {
        this.getOrderInfo();
    },
    methods: {
        /**
         * 根据订单编号生成二维码
         */
        creatQrCode() {
            var qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: this.oid,
                width: 220,
                height: 220,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        },
        /**
         * 根据订单编号获取订单详情
         */
        getOrderInfo() {
            api.GetOrderInfo({ oid: this.oid }).then(res => {
                console.log(res);
                if (res.code === 0) {
                    this.orderInfo = res.body;
                } else {
                    Toast(res.message);
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.body {
    padding: 10px 0;
    .order-info {
        background: #fff;
        padding: 5px 10px;
        text-align: center;
        div {
            margin-top: 5px;
        }
        div:first-child {
            font-size: 15px;
            color: #827d83;
            font-weight: bold;
        }
        div:nth-child(2) {
            color: #b2adb3;
            font-size: 14px;
        }
        div:nth-child(3) {
            color: #8fbbb6;
            font-size: 14px;
        }
        div:last-child {
            .seat {
                padding: 8px 8px;
                margin-right: 5px;
                font-size: 13px;
            }
        }
    }
    .order-num {
        background: #fff;
        padding: 15px 10px;
        margin-top: 5px;
        label {
            color: #a4a4a4;
        }
    }
    .qrcode-body {
        background: #fff;
        padding: 15px 10px 50px 10px;
        margin-top: 5px;
        text-align: center;
        .qrcode-tips {
            font-size: 13px;
            color: #d28855;
        }
        .qrcode {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
    }
}
</style>
