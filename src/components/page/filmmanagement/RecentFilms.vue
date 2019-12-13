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
                <el-col :span="5" v-for="(o, index) in recentFilmsData" :offset="1" style="margin: 15px;">
                    <el-card :body-style="{ padding: '8px' }">
                    <img :src="o.mpicture" class="image">
                    <div style="padding: 14px;">
                        <span>{{o.mname}}</span>
                        <div class="bottom clearfix">
                        <time class="time">上映时间{{ o.releasetime | dateFormat }}</time>
                        <el-button type="text" class="button">操作按钮</el-button>
                        </div>
                    </div>
                    </el-card>
                </el-col>
                </el-row>
        </div>
    </div>
</template>

<script>
import { getAllRecentFilms } from '../../../api/index';
export default {
    name: 'recentfilms',
    data() {
        return {
            currentDate: new Date(),
            recentFilmsData: null  //近期所有电影
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            getAllRecentFilms().then(res => {
                if(res.code === 0){         
                    this.recentFilmsData = res.body
                    console.log(this.recentFilmsData)
                }
            });
        },     
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
  }

  .image {
    width: 100%;
    display: block;
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
