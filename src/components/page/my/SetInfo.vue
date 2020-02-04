<template>
    <div v-if="userInfo" class="setinfo">
        <return-h title="我的信息"></return-h>
        <div class="body">
            <div class="pic">
                <van-uploader :after-read="setPic">
                    <van-image
                        class="img"
                        round
                        width="9rem"
                        height="9rem"
                        :src="userInfo.upicture?userInfo.upicture:circleUrl"
                    />
                </van-uploader>
            </div>
            <div class="name">
                <van-cell-group>
                    <van-field v-model="userInfo.username" right-icon="edit" />
                </van-cell-group>
            </div>
            <van-button type="primary" size="large" class="btn" @click="setInfo">保存</van-button>
        </div>
    </div>
</template>
<script>
import * as api from '../../../api/index';
import returnH from '../../common/return.vue';
import Vue from 'vue';
import { Image, Toast, Uploader, Button, Field, CellGroup } from 'vant';
Vue.use(Image)
    .use(Toast)
    .use(Uploader)
    .use(Button)
    .use(Field)
    .use(CellGroup);
export default {
    name: 'setinfo',
    components: {
        returnH
    },
    data() {
        return {
            circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            userInfo: null,
            uid: this.$route.query.uid
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            api.GetNameAndPicById({ uid: this.uid }).then(res => {
                if (res.code === 0) {
                    this.userInfo = res.body;
                } else {
                    Toast(res.message);
                }
            });
        },
        /**
         * 上传图片
         */
        setPic(file) {
            console.log(file);
            this.userInfo.upicture = file.content;
        },
        /**
         * 保存用户信息
         */
        setInfo() {
            const data = {
                username: this.userInfo.username,
                upicture: this.userInfo.upicture,
                uid: this.uid
            };
            console.log(data);
            api.UpdatePicAndName(data).then(res => {
                if (res === true) {
                    this.$router.push('/my');
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.setinfo {
    .body {
        padding-top: 100px;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .pic {
            text-align: center;
            .img {
                border: 2px solid #fff;
                box-shadow: 0px 1.5px 3px rgba(0, 0, 0, 0.16);
            }
        }
        .name {
            margin-top: 50px;
            .van-cell {
                border: 1px solid #999999;
                padding: 10px 90px;
                font-size: 18px;
            }
        }
        .btn {
            margin-top: 13rem;
        }
    }
}
</style>