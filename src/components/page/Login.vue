<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">世界电影城</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">{{isRegister?'注册':'登录'}}</el-button>
                </div>
                <div class="register">
                    <span @click="register">{{isRegister?'已有账户？请登录':'没有账户？请注册'}}</span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import * as api from '../../api/index';
import { login } from '@/api/index';
import Vue from 'vue';
import { Notify } from 'vant';

Vue.use(Notify);
export default {
    data: function() {
        return {
            param: {
                username: null,
                password: null
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            isRegister: false //是否注册
        };
    },
    created() {
        let userLocal = localStorage.getItem('USER_INFO');
        if (userLocal) {
            this.$router.push({ path: '/' });
        }
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    //注册
                    if (this.isRegister) {
                        api.AddUser(this.param).then(res => {
                            if (res === true) {
                                Notify({ type: 'success', message: '注册成功' });
                                this.isRegister = false;
                            }
                        });
                    } else {
                        //登录
                        login(this.param).then(res => {
                            console.log(res);
                            if (res.code === 0) {
                                this.$delete(res.body, 'password');
                                localStorage.setItem('USER_INFO', JSON.stringify(res.body));
                                //如果当用户类型为0时，走后台管理员界面，等于1时，走会员界面
                                if (res.body.utype === 0) {
                                    this.$message.success('登录成功');
                                    this.$router.push({ path: '/dashboard' });
                                } else if (res.body.utype === 1) {
                                    this.$router.push({ path: '/filmIndex' });
                                }
                            } else if (res.code === 1000) {
                                this.$message.warning(res.message);
                            }
                        });
                    }
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
        /**
         * 注册
         */
        register() {
            this.isRegister = !this.isRegister;
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-image: url(../../assets/img/login-bg.jpg); */
    background: #115771;
    /* background-size: 100%; */
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.register {
    font-size: 12px;
    color: #cd5e3c;
    font-weight: bold;
    margin-top: 10px;
}
</style>