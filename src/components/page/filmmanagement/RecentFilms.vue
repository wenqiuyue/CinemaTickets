<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 近期影片
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row>
                <el-col :span="5" v-for="(o, index) in recentFilmsData" :key="index" :offset="1" style="margin: 15px;">
                    <el-card :body-style="{ padding: '8px' }">
                    <img :src="o.mpicture" class="image">
                    <div style="padding: 14px;">
                        <span>{{o.mname}}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ o.mtype }}</time>
                        </div>
                        <div class="bottom clearfix">
                            <time class="time">{{ o.mcountry }} / {{ o.mduration }}分钟</time>
                        </div>
                        <div class="bottom clearfix">
                            <time class="time">{{ o.releasetime | dateFormat }}大陆上映</time>
                        </div>
                        <el-button type="text" class="button" @click="delRecent(o.mid,index)">下架此电影</el-button>
                    </div>
                    </el-card>
                </el-col>
                </el-row>
        </div>
    </div>
</template>

<script>
import { getAllRecentFilms,delRecentFilmsById } from '../../../api/index';
export default {
    name: 'recentfilms',
    data() {
        return {
            currentDate: new Date(),
            recentFilmsData: null  //近期所有电影
        };
    },
    created() {
        // this.getData();
    },
    mounted(){
        this.getData();
    },
    methods: {
        // 获取近期数据
        getData() {
            getAllRecentFilms().then(res => {
                if(res.code === 0){         
                    this.recentFilmsData = res.body
                    console.log(this.recentFilmsData)
                }
            });
        },
        //下架近期电影
        delRecent(mid,index){
            delRecentFilmsById({mid:mid}).then(res => {
                if(res === true){
                    this.$message.success("下架成功");
                    this.recentFilmsData.splice(index,1);
                }else{
                    this.$message.success("下架失败");
                }
            })
        }     
    }
};
</script>

<style scoped>
 .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
    margin: 10px 0;
  }

  .image {
    width: 100%;
    display: block;
    height: 200px;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
