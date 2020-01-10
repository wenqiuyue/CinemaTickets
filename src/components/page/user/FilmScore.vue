<template>
    <div>
        <return-h :title="film?film.mname:''"></return-h>
        <div class="filmscore">
            <img class="score-img" :src="film?film.mpicture:''" />
            <div class="score">
                <span class="score-tips-init" v-if="value === 0">期待您的打分</span>
                <span class="score-tips" v-else>
                    <label>{{value*2}}</label>
                    分 {{scoreTips}}
                </span>
                <div class="score-rate">
                    <van-rate
                        v-model="value"
                        size="25"
                        allow-half
                        color="#F9AE00"
                        void-color="#B2B2B2"
                        void-icon="star"
                        bind:change="onChange"
                        gutter="10px"
                    />
                </div>
            </div>
            <van-divider :hairline="false" />
            <van-field
                v-model="message"
                rows="13"
                autosize
                type="textarea"
                placeholder="好看吗，快来写下你的感受吧~"
                show-word-limit
            />
            <van-button type="primary" size="large" class="release-button" @click="release">发布</van-button>
        </div>
    </div>
</template>
<script>
import returnH from '../../common/return.vue';
import { GetFilmById, AddFilmReview, UpdateFilmScore, GetFilmReviewByMid } from '../../../api/index';
import Vue from 'vue';
import { Rate, Divider, Field, Button, Toast } from 'vant';
Vue.use(Rate);
Vue.use(Divider);
Vue.use(Field);
Vue.use(Button);
Vue.use(Toast);
export default {
    name: 'filmscore',
    components: {
        returnH
    },
    data() {
        return {
            mid: this.$route.query.filmId, // 选择的影片id
            film: null, //选择的电影数据
            value: 0, //星星评分
            scoreTips: null, //评分提示
            message: null //留言
        };
    },
    watch: {
        value() {
            if (this.value === 0.5 || this.value === 1) {
                this.scoreTips = '超烂啊';
            } else if (this.value === 1.5 || this.value === 2) {
                this.scoreTips = '比较差';
            } else if (this.value === 2.5 || this.value === 3) {
                this.scoreTips = '一般般';
            } else if (this.value === 3.5 || this.value === 4) {
                this.scoreTips = '比较好';
            } else if (this.value === 4.5 || this.value === 5) {
                this.scoreTips = '完美';
            }
        }
    },
    created() {
        //获取点击的电影的信息
        GetFilmById({ mid: this.mid }).then(res => {
            if (res.code === 0) {
                this.film = res.body;
            }
        });
    },
    methods: {
        onChange(event) {
            this.setData({
                value: event.detail
            });
        },
        /**
         * 发布评论
         */
        release() {
            let userinfo = localStorage.getItem('USER_INFO');
            if (userinfo) {
                userinfo = JSON.parse(userinfo);
            }
            const data = {
                mid: Number.parseInt(this.mid),
                uid: userinfo.uid,
                score: this.value * 2,
                evaluate: this.message
            };
            AddFilmReview(data).then(res => {
                if (res) {
                    Toast.success('发布成功');
                    this.getFilmScore();
                } else {
                    Toast.success('发布失败');
                }
            });
        },
        /**
         * 获取影片分数
         */
        getFilmScore() {
            GetFilmReviewByMid({ mid: this.mid }).then(res => {
                if (res.code === 0) {
                    let sum = 0;
                    res.body.forEach(element => {
                        sum += element;
                    });
                    //修改评论分数
                    let data = {
                        mid: Number.parseInt(this.mid),
                        score: Number.parseFloat((sum / res.body.length).toFixed(1))
                    };
                    UpdateFilmScore(data);
                } else {
                    return;
                }
                console.log(this.film);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.filmscore {
    text-align: center;
    .score-img {
        width: 90px;
        height: 120px;
        margin-top: 15px;
    }
    .score {
        margin-top: 10px;
        .score-tips-init {
            font-size: 13px;
            color: #acacab;
        }
        .score-tips {
            font-size: 13px;
            color: rgba(#f9ae00, 0.8);
            label {
                font-size: 20px;
            }
        }
        .score-rate {
            margin-top: 5px;
        }
    }
    .release-button {
        width: 95%;
        height: 45px;
        line-height: 45px;
        background-color: #f9ae00;
        border: #f9ae00;
    }
}
</style>