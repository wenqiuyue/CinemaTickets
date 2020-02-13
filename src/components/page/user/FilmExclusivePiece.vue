<template>
    <div>
        <return-h :title="film?film.mname:''"></return-h>
        <div class="head" v-if="film">
            <van-image
                width="100%"
                height="13rem"
                fit="fill"
                :src="film?film.mpicture:''"
                style="filter: blur(3px);opacity:0.8;"
            />
            <div class="cont" @click="filmIntroduce">
                <img class="cont-img" :src="film?film.mpicture:''" />
                <div class="text">
                    <div class="item">{{film?film.mname:''}}</div>
                    <div class="score">
                        <span class="score-film">{{film?film.score:" "}}分</span>
                    </div>
                    <div class="mtype">{{film?film.mtype:''}}</div>
                    <div class="mtype">{{film?film.mcountry:''}} / {{film?film.mduration:''}}分钟</div>
                    <div class="mtype">{{film?film.releasetime:'' | dateFormat}}大陆上映</div>
                </div>
                <el-button type="info" icon="el-icon-arrow-right" circle class="arrowbuton"></el-button>
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
        <van-notice-bar
            :text="text"
            :speed="50"
            left-icon="//img.yzcdn.cn/public_files/2017/8/10/6af5b7168eed548100d9041f07b7c616.png"
        />
        <div class="time" v-if="exclusivepieceData">
            <div class="time-card" v-for="item of exclusivepieceData">
                <div class="begin-time">
                    <span class="begin-time-span">{{item.timebegin | timeFormat}}</span>
                    <span class="end-time">{{item.timeend | timeFormat}}散场</span>
                </div>
                <div class="hall">
                    <span>{{item.mlanguage}}{{item.meffect}}</span>
                    <span>{{item.pid}}号厅</span>
                </div>
                <div class="price">
                    <span>￥{{item.mprice}}</span>
                    <span class="tag">折扣卡首单</span>
                    <span class="tag-price">￥{{item.mprice-4}}</span>
                </div>
                <div class="buy" @click="seat(item.eid)">
                    <span class="tag-buy">购买</span>
                </div>
            </div>
        </div>
        <div v-if="exclusivepieceData.length ===0" class="noexclusivepiece">暂无排片信息</div>
    </div>
</template>
<script>
import returnH from '../../common/return.vue';
import { GetFilmById, GetExclusivePieceById, GetFilmReviewByMid, AddWantSeeFilm, IsAddWantSeeFilm } from '../../../api/index';
import Vue from 'vue';
import { Image, NoticeBar, Toast } from 'vant';
import { log } from 'util';
Vue.use(Image)
    .use(NoticeBar)
    .use(Toast);
export default {
    name: 'filmexclusivepiece',
    components: {
        returnH
    },
    data() {
        return {
            text: '新视界，新天地，心享受! 高保真优质视听效果，给你身临其境的感觉。',
            film: null, //选择的电影数据
            exclusivepieceData: [], //排片数据
            mid: this.$route.query.filmId, // 选择的影片id
            userinfo: null
        };
    },
    watch: {},
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
        Promise.all([GetFilmById({ mid: this.mid }), IsAddWantSeeFilm(data)]).then(res => {
            if (res[0].code === 0) {
                if (res[1] === true) {
                    res[0].body.isWant = true;
                } else {
                    res[0].body.isWant = false;
                }
                this.film = res[0].body;
            }
        });
        this.getExclusivepieceData();
    },
    mounted() {},
    methods: {
        //获取排片数据
        getExclusivepieceData() {
            GetExclusivePieceById({ mid: this.mid }).then(res => {
                if (res.code === 0) {
                    this.exclusivepieceData = res.body.filter(m => new Date(m.timebegin).valueOf() > new Date().valueOf());
                } else {
                    return;
                }
            });
        },
        //获取电影详情介绍
        filmIntroduce() {
            this.$router.push({ path: '/filmIntroduce', query: { filmId: this.mid } });
        },
        //想看
        wantToSee() {
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
         * 获取影片分数
         */
        // getFilmScore() {
        //     GetFilmReviewByMid({ mid: this.mid }).then(res => {
        //         if (res.code === 0) {
        //             let sum = 0;
        //             res.body.forEach(element => {
        //                 sum += element;
        //             });
        //             this.film.score = (sum / res.body.length).toFixed(1);
        //         } else {
        //             this.film.score = 1;
        //         }
        //         console.log(this.film);
        //     });
        // }
        /**
         * 在线选座
         */
        seat(eid) {
            this.$router.push({ path: '/seatselection', query: { eid: eid } });
            console.log(eid);
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
.time {
    background: #f4f4f4;
    .time-card {
        background: white;
        width: 100%;
        height: 55px;
        display: flex;
        flex-direction: row;
        margin-top: 2px;
        .begin-time {
            width: 25%;
            height: 39px;
            text-align: center;
            padding: 8px 0;
            .begin-time-span {
                display: block;
                font-size: 20px;
            }
            .end-time {
                font-size: 12px;
                color: #b1b1b1;
            }
        }
        .hall {
            width: 25%;
            height: 35px;
            padding: 10px 0;
            span:first-child {
                display: block;
                font-size: 14px;
                color: black;
                margin-bottom: 2px;
            }
            span {
                font-size: 12px;
                color: #b1b1b1;
            }
        }
        .price {
            width: 30%;
            height: 39px;
            padding: 8px 0;
            text-align: center;
            span:first-child {
                display: block;
                color: #f04c43;
                margin-bottom: 2px;
            }
            .tag {
                background: #ff9001;
                font-size: 11px;
                color: white;
                padding: 1px 5px;
                border-radius: 1px;
            }
            .tag-price {
                border: 1px solid #ff9001;
                color: #ff9001;
                font-size: 11px;
                border-radius: 1px;
            }
        }
        .buy {
            width: 20%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            .tag-buy {
                border: 1px solid #f04c43;
                color: #f04c43;
                font-size: 13px;
                border-radius: 1px;
                padding: 5px 10px;
            }
        }
    }
}
.noexclusivepiece {
    margin: 10px 25%;
    text-align: center;
}
</style>