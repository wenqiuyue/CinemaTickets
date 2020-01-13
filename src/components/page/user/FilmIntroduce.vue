<template>
    <div v-if="film">
        <return-h :title="film.mname"></return-h>
        <div class="head">
            <van-image
                width="100%"
                height="13rem"
                fit="fill"
                :src="film.mpicture"
                style="filter: blur(3px);opacity:0.8;"
            />
            <div class="cont">
                <img class="cont-img" :src="film.mpicture" />
                <div class="text">
                    <div class="item">{{film.mname}}</div>
                    <div class="score">
                        <span class="score-film">{{film.score}}分</span>
                    </div>
                    <div class="mtype">{{film.mtype}}</div>
                    <div class="mtype">{{film.mcountry}} / {{film.mduration}}分钟</div>
                    <div class="mtype">{{film.releasetime | dateFormat}}大陆上映</div>
                </div>
                <div class="cont-button">
                    <el-button
                        type="info"
                        class="button"
                        :icon="film.isWant?'el-icon-success':'el-icon-lx-likefill'"
                        @click.stop="wantToSee"
                    >{{film.isWant?'已想看':'想看'}}</el-button>
                    <el-button
                        type="info"
                        class="button"
                        icon="el-icon-lx-favorfill"
                        @click.stop="score"
                    >评分</el-button>
                </div>
            </div>
        </div>
        <van-collapse v-model="activeNames">
            <van-collapse-item :title="film.mname">{{film.mintroduction}}</van-collapse-item>
        </van-collapse>
        <div class="comment">
            <div class="comment-header">
                <div>评论区</div>
                <van-tag round type="danger" @click.stop="score">参与讨论</van-tag>
            </div>
            <van-divider />
            <div v-for="item of filmReview">
                <div class="comment-footer">
                    <div>
                        <template>
                            <el-row class="demo-avatar demo-basic">
                                <el-col :span="12">
                                    <div class="demo-basic--circle">
                                        <div class="block">
                                            <el-avatar
                                                :size="30"
                                                :src="item.upicture?item.upicture:circleUrl"
                                            ></el-avatar>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </template>
                    </div>
                    <div class="comment-footer-container">
                        <div class="name">{{item.username}}</div>
                        <div class="score">给这部电影打了{{item.score}}分</div>
                        <div class="text">{{item.evaluate}}</div>
                        <div class="time">{{item.evaluatetime | dateFormat}}</div>
                    </div>
                </div>
                <van-divider />
            </div>
            <div v-if="filmReview.length===0" class="no-comment">暂无评论</div>
        </div>
    </div>
</template>
<script>
import returnH from '../../common/return.vue';
import { GetFilmById, GetFilmReviewInfoById, IsAddWantSeeFilm, AddWantSeeFilm } from '../../../api/index';
import Vue from 'vue';
import { Image, Collapse, CollapseItem, Panel, Tag, Divider, Toast } from 'vant';
Vue.use(Image)
    .use(Collapse)
    .use(CollapseItem)
    .use(Tag)
    .use(Divider)
    .use(Panel)
    .use(Toast);
export default {
    name: 'filmintroduce',
    components: {
        returnH
    },
    data() {
        return {
            mid: this.$route.query.filmId, // 选择的影片id
            film: null, //选择的电影数据
            activeNames: ['1'],
            circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            filmReview: null, //电影评论
            userinfo: null
        };
    },
    created() {
        this.userinfo = localStorage.getItem('USER_INFO');
        if (this.userinfo) {
            this.userinfo = JSON.parse(this.userinfo);
        }
        //获取点击的电影的信息
        const data = {
            mid: this.mid,
            uid: this.userinfo.uid
        };
        Promise.all([GetFilmById({ mid: this.mid }), GetFilmReviewInfoById({ mid: this.mid }), IsAddWantSeeFilm(data)]).then(res => {
            console.log(res);
            if (res[0].code === 0 && res[1].code === 0) {
                if (res[2] === true) {
                    res[0].body.isWant = true;
                } else {
                    res[0].body.isWant = false;
                }
                this.film = res[0].body;

                this.filmReview = res[1].body;
                console.log(this.filmReview.length);
            }
        });
    },
    methods: {
        //想看
        wantToSee() {
            console.log('想看');
            const data = {
                mid: this.mid,
                uid: this.userinfo.uid
            };
            AddWantSeeFilm(data).then(res => {
                if (res.code === 1001) {
                    Toast(res.message);
                } else if (res.code === 1002) {
                    this.film.isWant = true;
                } else {
                    Toast(res.message);
                }
            });
        },
        //评分
        score() {
            console.log('评分');
            this.$router.push({ path: '/filmscore', query: { filmId: this.mid } });
        },
        /**
         * 获取影片评价
         */
        getFilmReview() {
            GetFilmReviewById();
        }
    }
};
</script>
<style lang="scss" scoped>
.head {
    position: relative;
    .cont {
        height: 13rem;
        position: absolute;
        top: 0;
        padding: 13px 0 0 13px;
        .cont-img {
            width: 110px;
            height: 140px;
            float: left;
            display: block;
        }
        .text {
            width: 200px;
            margin-left: 120px;
            .item {
                color: white;
                font-size: 16px;
                margin-top: 5px;
                font-weight: bold;
            }
            .score {
                margin-top: 8px;
                color: #ebebeb;
                font-size: 13px;
                .score-film {
                    font-size: 20px;
                    color: #fec601;
                }
            }
            .mtype {
                color: white;
                font-size: 13px;
                margin-top: 7px;
                opacity: 0.8;
            }
        }
        .arrowbuton {
            float: right;
            margin-top: -80px;
            left: 20px;
        }
        .cont-button {
            height: 20%;
            width: 100%;
            margin: 15px 0 0 5%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .button {
                width: 50%;
                height: 82%;
                background-color: gray;
                opacity: 0.6;
                font-size: 13px;
            }
        }
    }
}
.comment {
    .comment-header {
        display: flex;
        flex-direction: row;
        padding: 20px 15px;
        justify-content: space-between;
    }
    .comment-footer {
        padding: 10px 15px;
        display: flex;
        flex-direction: row;
        .comment-footer-container {
            padding: 0 10px;
            width: 100%;
            .name {
                font-size: 12px;
            }
            .score {
                font-size: 10px;
                color: gray;
                margin-top: 3px;
            }
            .text {
                margin-top: 10px;
                font-size: 13px;
            }
            .time {
                font-size: 10px;
                float: right;
                color: #c0c4cc;
                margin-top: 10px;
            }
        }
    }
    .van-divider {
        margin: 9px 0;
    }
    .no-comment {
        padding: 10px;
        color: #606266;
    }
}
</style>