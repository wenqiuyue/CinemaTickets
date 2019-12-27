<template>
    <div>
        <return-h :title="film?film.mname:''"></return-h>
        <div class="filmscore">
             <img
                class="score-img"
                :src="film?film.mpicture:''"
            />
            <div class="score">
                <span>期待您的打分</span>
                <div>
                    <van-rate
                    :value="value"
                    size="25"
                    allow-half
                    color="#ee0a24"
                    void-color="#eee"
                    void-icon="star"
                    bind:change="onChange"
                    />

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import returnH from '../../common/return.vue';
import { GetFilmById} from '../../../api/index';
import Vue from 'vue';
import { Rate } from 'vant';
Vue.use(Rate);
export default {
    name: "filmscore",
    components: {
        returnH
    },
    data(){
        return{
            mid: this.$route.query.filmId,  // 选择的影片id
            film: null,                     //选择的电影数据
            value: 3
        }
    },
    created(){
        //获取点击的电影的信息
        GetFilmById({mid:this.mid}).then(res => {
            if(res.code === 0){
                this.film = res.body
            }
        })
    },
    methods:{
        onChange(event) {
            this.setData({
                value: event.detail
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .filmscore{
        text-align: center;
        .score-img{
            width: 90px;
            height: 120px;
            margin-top: 15px;
        }
        .score{
            
        }
    }
</style>