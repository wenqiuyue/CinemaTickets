<template>
    <div>
        <return-h title="档单详情"></return-h>
        <div class="body">
            <div class="state"></div>
            <div class="order-num"><label>订单编号：</label>{{ oid }}</div>
            <div class="qrcode-body">
                <div class="qrcode-tips">*凭订单编号或二维码前去电影院取票</div>
                <div class="qrcode" ref="qrCodeUrl"></div>
            </div>
            <div class="order-info">
                <van-card num="2" price="2.00" desc="描述信息" title="商品标题" thumb="https://img.yzcdn.cn/vant/t-thirt.jpg">
                    <div slot="tags">
                        <van-tag plain type="danger">标签</van-tag>
                        <van-tag plain type="danger">标签</van-tag>
                    </div>
                    <div slot="footer">
                        <van-button size="mini">按钮</van-button>
                        <van-button size="mini">按钮</van-button>
                    </div>
                </van-card>
            </div>
        </div>
    </div>
</template>
<script>
import returnH from '../../common/return.vue';
import QRCode from 'qrcodejs2';
import Vue from 'vue';
import { Card } from 'vant';
Vue.use(Card);
export default {
    name: 'order',
    components: {
        returnH
    },
    data() {
        return {
            oid: this.$route.query.oid
        };
    },
    mounted() {
        this.creatQrCode();
    },
    methods: {
        creatQrCode() {
            var qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: this.oid,
                width: 220,
                height: 220,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.body {
    padding: 10px 0;
    background: #f8f8f8;
    .order-num {
        background: #fff;
        padding: 15px 10px;
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
    .order-info {
        background: #fff;
        margin-top: 5px;
        .van-card {
            background: #fff;
        }
    }
}
</style>
