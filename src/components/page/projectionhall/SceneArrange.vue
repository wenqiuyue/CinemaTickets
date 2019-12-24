<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 场次安排
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-lx-add"
                    class="handle-del mr10"
                    @click="addScene"
                >添加场次</el-button>
                <el-input v-model="query.name" placeholder="请输入影片" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="film.mname" label="影片名" align="center"></el-table-column>
                <el-table-column prop="timebegin" label="开场时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.timebegin | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop="timeend" label="散场时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.timeend }}
                    </template>
                </el-table-column>
                <el-table-column prop="pid" label="放映厅" align="center"  width="120">
                    <template slot-scope="scope">
                        {{ scope.row.pid }}号厅
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="isAdd?'添加':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="影片">
                    <el-select v-model="value" value-key="mid" placeholder="请选择" @change="changeFilm">
                        <el-option
                            v-for="item in filmsData"
                            :key="item.mid"
                            :label="item.mname"
                            :value="item"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <div class="picker-time">
                        <el-time-picker
                            v-model="pickerTimeBegin"
                            :picker-options="{
                            selectableRange: '00:00:00 - 23:00:00'
                            }"
                            placeholder="开场时间"
                            @change="handleTimeBegin">
                        </el-time-picker>
                        至
                        <el-time-picker
                            arrow-control
                            v-model="pickerTimeEnd"
                            readonly
                            placeholder="结束时间">
                        </el-time-picker>
                    </div>                 
                </el-form-item>
                <el-form-item label="放映厅">
                    <el-select v-model="valueProjectionHall" value-key="pid" placeholder="请选择">
                        <el-option
                            v-for="item in projectionHallData"
                            :key="item.pid"
                            :label="item.pid"
                            :value="item.pid"
                            :disabled="item.disabled">
                            {{item.pid}}号厅
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="isAdd?addEdit():saveEdit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { fetchData,getAllRecentFilms,getAllProjectionHall,getExclusivepiece,addExclusivePiece,getExclusivepieceInfo,gettExclusivepieceByName,getExclusivepieceCount,getExclusivepieceByNameCount,UpdateExclusivepieceById,delExclusivepieceById } from '../../../api/index';
export default {
    name: "scenearrange",
    data(){
        return{
             query: {
                name: null,    //搜索的电影名字
                pageIndex: 1,  //当前页数
                pageSize: 7   //每页显示条目个数
            },
            tableData: [],
            isSearch: false,  //是否点击搜索按钮 
            multipleSelection: [],
            isAdd: true,               //点击添加或编辑的标识
            editVisible: false,        //编辑、添加弹窗
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            filmsData: null,          //近期影片
            projectionHallData: null, //放映厅数据
            pickerTimeBegin: null,    //开场时间
            pickerTimeEnd: null,      //结束时间
            value: null,                //选择的近期影片
            valueProjectionHall: null,  //选择的放映厅
            mname: null,
            filmInfo: null
        }
    },
     computed:{
        //监听搜索框的影片名是否发生改变
        watchSearchName(){ return this.query.name}
    },
    watch:{
        watchSearchName(_new, _old){
            if(this.isSearch === true){
                this.isSearch = false
                this.getData();
            }          
        }
    },
     created() {
        this.getData();
    },
    methods: {
        //开场时间选定,根据选择的电影自动计算结束时间
        handleTimeBegin(){
            if(!this.mname){
                this.$message.error("请选择影片");
            }else{
                var mdurationHours = parseInt(this.value.mduration/60);
                var mdurationMinutes = this.value.mduration%60;
                var time=this.pickerTimeBegin;
                var d = new Date(time);
                var minutesD = d.getMinutes() + mdurationMinutes;
                if(minutesD>=60){
                    mdurationHours++;
                    minutesD = minutesD - 60;
                }
                var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + (d.getHours()+mdurationHours) + ':' + minutesD + ':' + d.getSeconds();
                this.pickerTimeEnd = times;
                this.getProjectionHall();
                console.log(this.pickerTimeEnd)
            }       
        },
        //获取近期影片
        getFilms(){
            getAllRecentFilms().then(res => {
                console.log(res)
                if(res.code === 0){
                    this.filmsData = res.body
                }else{
                    this.filmsData = res.message
                }
            })
        },
        //更改选中的影片
        changeFilm(){
            console.log(this.value)
            this.mname = this.value.mname          
            if(this.pickerTimeBegin){
                this.handleTimeBegin();
            }         
        },
        //添加场次
        addScene(){
            this.editVisible = true;
            this.isAdd = true;
            this.getFilms();
            this.getProjectionHall();
            this.value=null;
            this.mname = null;
            this.pickerTimeBegin = null;
            this.pickerTimeEnd = null;
            this.valueProjectionHall = null;
        },
        //获取所有放映厅
        getProjectionHall(){
            Promise.all([
                getAllProjectionHall(),
                getExclusivepiece()
            ]).then(res => {
                if(res[0].code === 0 && res[1].body && this.pickerTimeBegin){   
                    for(let item of res[0].body){
                        for(let item1 of res[1].body){
                            // 转换场次的起始和结束时间
                            var timeBegin = new Date(item1.timebegin);
                            var timeEnd = new Date(item1.timeend);
                            var pickerTime = new Date(this.pickerTimeBegin);
                            var timeBeginTotal = timeBegin.getHours()*3600 + timeBegin.getMinutes()*60 + timeBegin.getSeconds();
                            var timeEndTotal = timeEnd.getHours()*3600 + timeEnd.getMinutes()*60 + timeEnd.getSeconds()+900;
                            var pickerTimeTotal = pickerTime.getHours()*3600 + pickerTime.getMinutes()*60 + pickerTime.getSeconds();
                            //过滤在选择的时间中已被安排的放映厅
                            if(pickerTimeTotal>=timeBeginTotal && pickerTimeTotal<=timeEndTotal){
                                if(item.pid === item1.pid){
                                    this.$set(item,'disabled',true)
                                }
                            }
                        }
                    }             
                    this.projectionHallData = res[0].body
                }else if(res[0].code === 0){
                     this.projectionHallData = res[0].body
                }else{
                    this.projectionHallData = res[0].message
                }
            })
        },
         // 获取数据
        getData() {
             let data={
                pageIndex: this.query.pageSize*(this.query.pageIndex-1),
                pageSize: this.query.pageSize  
            }
            Promise.all([
                getExclusivepieceCount(),
                getExclusivepieceInfo(data)
            ]).then(res => {
                this.pageTotal = res[0]
                this.tableData = res[1].body;
            })
        },      
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    delExclusivepieceById({eid:row.eid}).then(res => {
                        if(res === true){
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        }else{
                            this.$message.success('删除失败');
                        }
                    })
                    
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            this.editVisible = true;
            this.getFilms();
            this.getProjectionHall();
            this.isAdd = false;
            this.$nextTick(() => {
                this.value = row.film,
                this.pickerTimeBegin = row.timebegin,
                this.pickerTimeEnd = row.timeend,
                // this.value.mduration = row.film.mduration,
                this.valueProjectionHall = row.pid
            })  
            this.filmInfo = row  
            this.idx = index;
            this.value = row
            
            
        },
        // 编辑确定
        saveEdit() {
            let data={
                mid: this.value.mid,
                pid: this.valueProjectionHall,
                timebegin: this.pickerTimeBegin,
                timeend: this.pickerTimeEnd,
                eid: this.filmInfo.eid
            }
            UpdateExclusivepieceById(data).then(res => {
                if(res === true){
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.getData();
                }else{
                    this.$message.success("修改失败请重试");
                }
            })
            this.editVisible = false;        
        },
        //添加确定
        addEdit(){
            console.log(this.value.mid+" "+this.valueProjectionHall+" "+this.pickerTimeBegin+" "+this.pickerTimeEnd)
            let data={
                mid: this.value.mid,
                pid: this.valueProjectionHall,
                timebegin: this.pickerTimeBegin,
                timeend: this.pickerTimeEnd
            }
            addExclusivePiece(data).then(res => {
                if(res === true){
                    this.getData();
                }
            })
            this.editVisible = false;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            if(this.isSearch === true){
                this.handleSearch()
            }else{
                this.getData();
            }    
        }, 
        //搜索
        handleSearch(){
            this.isSearch = true
            let data={
                pageIndex: this.query.pageSize*(this.query.pageIndex-1),
                pageSize: this.query.pageSize,
                name: this.query.name  
            }
            Promise.all([
                getExclusivepieceByNameCount({name:this.query.name}),
                gettExclusivepieceByName(data),
            ]).then(res => {
                console.log(res)
                this.pageTotal = res[0]
                this.tableData = res[1].body;
            })
        }
    }
}
</script>
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    .picker-time{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>