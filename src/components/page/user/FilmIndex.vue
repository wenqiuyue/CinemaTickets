<template>
    <div class="film-index">
        <return-h title="Hello World 电影城" :left="false"></return-h>
        <div class="body">
            <div class="block">
                <el-carousel trigger="click" height="160px">
                    <el-carousel-item v-for="item in bigImgData" :key="item">
                        <!-- <h3 class="small">{{ item }}</h3> -->
                        <img :src="item" class="small" />
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="film">
                <div class="recommand-wrap">
                    <div class="title">
                        <img
                            class="title-img"
                            src="https://imgs.qunarzz.com/piao/fusion/1711/16/bfbb9874e8f11402.png"
                            alt="近期热门电影"
                        />
                        <span class="title-hotrec">近期热门电影</span>
                    </div>
                    <div ref="wrapper">
                        <ul class="cont" ref="cont">
                            <li
                                class="cont-item"
                                v-for="(item,index) of popularFilmList"
                                :key="index"
                                @click="filmHandle(item)"
                            >
                                <div class="cont-img">
                                    <img class="img" :src="item.mpicture" />
                                </div>
                                <div class="mname">{{item.mname}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="more">
                    <el-card
                        class="box-card"
                        v-for="(item,index) of recentFilmsList"
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
        </div>
        <userHeader></userHeader>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import { getAllRecentFilms, GetAllPopularRecentFilms, DelExclusivepieceNotTody, GetFilmScore } from '../../../api/index';
import userHeader from '../../common/UserHeader.vue';
import returnH from '../../common/return.vue';
export default {
    name: 'filmIndex',
    components: {
        userHeader,
        returnH
    },
    data() {
        return {
            bigImgData: [
                require('../../../assets/bigimg/timg(2).jpg'),
                require('../../../assets/bigimg/timg(5).jpg'),
                require('../../../assets/bigimg/timg(6).jpg'),
                require('../../../assets/bigimg/timg.jpg')
            ],
            activeIndex: '1',
            recentFilmsList: null, //近期影片
            popularFilmList: null //热门影片
        };
    },
    created() {
        this.getAllRecentFilmsData();
        this.getAllPopularRecentFilmsData();
    },
    mounted() {
        DelExclusivepieceNotTody().then(res => {
            console.log('删除了' + res + '条记录');
        });
    },
    methods: {
        //导航条
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        //获取近期上映影片
        getAllRecentFilmsData() {
            getAllRecentFilms().then(res => {
                if (res.code === 0) {
                    this.recentFilmsList = res.body;
                    // this.getFilmScore();
                    console.log(this.recentFilmsList);
                }
            });
        },
        //获取近期上映热门影片
        getAllPopularRecentFilmsData() {
            GetAllPopularRecentFilms().then(res => {
                if (res.code === 0) {
                    this.popularFilmList = res.body;
                    this.verScroll();
                }
            });
        },
        verScroll() {
            let width = this.popularFilmList.length * 110; // 动态计算出滚动区域的大小,产生滚动的原因是滚动区域宽度大于父盒子宽度
            this.$refs.cont.style.width = width + 'px'; // 修改滚动区域的宽度
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.wrapper, {
                        startX: 0,
                        click: true,
                        scrollX: true,
                        scrollY: false,
                        eventPassthrough: 'vertical'
                    });
                } else {
                    this.scroll.refresh(); //如果dom结构发生改变调用该方法
                }
            });
        },
        //点击某个电影
        filmHandle(item) {
            this.$router.push({ path: '/filmexclusivepiece', query: { filmId: item.mid } });
        }
        //获取影片分数
        // getFilmScore() {
        //     console.log(this.recentFilmsList);
        //     GetFilmScore().then(res => {
        //         console.log(res);
        //         if (res.code === 0) {
        //             this.recentFilmsList.forEach((element, index) => {
        //                 let sum = 0;
        //                 let num = 0;
        //                 res.body.forEach(scoreres => {
        //                     if (element.mid === scoreres.mid) {
        //                         sum += scoreres.score;
        //                         num++;
        //                     }
        //                 });
        //                 this.recentFilmsList[index].score = sum / num;
        //             });
        //             console.log(this.recentFilmsList);
        //         } else {
        //             Toast.success(res.message);
        //         }
        //     });
        // }
    }
};
</script>
<style lang="scss" scoped>
.film-index {
    height: 100%;
    .body {
        height: calc(100% - 100px);
        overflow-x: hidden;
        overflow-y: scroll;
        //滚动图片
        .small {
            width: 100%;
            height: 100%;
        }

        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n + 1) {
            background-color: #d3dce6;
        }
        .filmIndex {
            padding: 7px 10px;
        }
        //正在上映的电影
        .film {
            background: #f9f9f9;
            .recommand-wrap {
                height: 0;
                padding-bottom: 55%;
                margin-top: 0.2rem;
                background: #fff;
                padding-left: 0.24rem;
                width: 100%;
                .title {
                    position: relative;
                    height: 40px;
                    display: flex;
                    padding: 12px 0;
                    box-sizing: border-box;
                    .title-img {
                        width: 15px;
                        height: 15px;
                    }
                    .title-hotrec {
                        font-size: 14px;
                        margin-left: 4px;
                        font-weight: bold;
                    }
                    .title-allrec {
                        position: absolute;
                        padding-top: 2px;
                        font-size: 12px;
                        right: 20px;
                        color: gray;
                    }
                }
                .cont {
                    list-style: none;
                    // overflow-x: scroll;
                    white-space: nowrap;
                    font-size: 12px;
                    text-align: center;
                    padding-right: 0.24rem;
                    .cont-item {
                        position: relative;
                        display: inline-block;
                        margin: 5px 7px;
                        text-align: left;
                        width: 90px;
                        .cont-img {
                            overflow: hidden;
                            height: 120px;
                            .img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .mname {
                            font-size: 12px;
                            margin-top: 8px;
                            color: gray;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
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
        }
    }
}
</style>