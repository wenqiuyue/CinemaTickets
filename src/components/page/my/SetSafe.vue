<template>
    <div>
        <return-h title="安全设置"></return-h>
        <div class="body">
            <van-field v-model="password" type="password" label="新密码" />
            <van-field v-model="pass" type="password" label="确认密码" />
            <van-button type="primary" size="large" @click="setSafe">修改密码</van-button>
        </div>
    </div>
</template>
<script>
import * as api from '../../../api/index';
import Vue from 'vue';
import { Field, Button, Dialog, Toast } from 'vant';

Vue.use(Field)
    .use(Button)
    .use(Toast);
export default {
    name: 'setsafe',
    data() {
        return {
            password: null,
            pass: null
        };
    },
    methods: {
        setSafe() {
            let userinfo = localStorage.getItem('USER_INFO');
            if (userinfo) {
                userinfo = JSON.parse(userinfo);
            }
            const data = {
                password: this.password,
                uid: userinfo.uid
            };
            if (this.password === this.pass) {
                api.UpdatePassword(data).then(res => {
                    if (res === true) {
                        Dialog({ message: '密码修改成功，请重新登录' }).then(() => {
                            localStorage.removeItem('USER_INFO');
                            this.$router.push('/login');
                        });
                    } else {
                        Toast('修改密码失败');
                    }
                });
            } else {
                Dialog({ message: '请确认两次输入的密码是否一致' });
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>