<template>
    <div>
        <return-h title="想看的电影"></return-h>
        <div class="more">
            <el-card
                class="box-card"
                v-for="(item,index) of myFilm"
                :key="index"
                :body-style="{ padding: '6px' }"
            >
                <div class="more-card" @click="filmHandle(item)">
                    <div>
                        <img :src="item.mpicture" class="image" />
                    </div>
                    <div>
                        <div class="item">{{item.mname}}</div>
                        <div class="mtype">{{item.mtype}}</div>
                        <div class="mtype">{{item.mcountry}} / {{item.mduration}}分钟</div>
                        <div class="mtype">{{item.releasetime | dateFormat}}大陆上映</div>
                    </div>
                    <div class="score">{{item.score === 0 ?`暂无评`:item.score}}分</div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import * as api from '../../../api/index';
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
    name: 'myfile',
    data() {
        return {
            myFilm: null
        };
    },
    created() {
        this.getMyFilm();
    },
    methods: {
        getMyFilm() {
            let userinfo = localStorage.getItem('USER_INFO');
            if (userinfo) {
                userinfo = JSON.parse(userinfo);
            }
            api.GetMyLikeFilm({ uid: userinfo.uid }).then(res => {
                if (res.code === 0) {
                    this.myFilm = res.body;
                } else {
                    Toast(res.message);
                }
            });
        },
        //点击某个电影
        filmHandle(item) {
            this.$router.push({ path: '/filmexclusivepiece', query: { filmId: item.mid } });
        }
    }
};
</script>
<style lang="scss" scoped>
.more {
    margin-top: 5px;
    .item {
        font-size: 14px;
        font-weight: 600;
        margin: 5px 10px;
    }
    .mtype {
        font-size: 13px;
        margin: 5px 10px;
    }
    .score {
        margin-left: 40px;
        font-size: 17px;
        color: #f9cc9d;
        font-weight: bold;
    }
    .box-card {
        width: 480px;
        .image {
            width: 78px;
            height: 100px;
        }
        .more-card {
            display: flex;
            align-items: center;
        }
    }
}
</style>