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
                <el-table-column prop="name" label="影片名" align="center"></el-table-column>
                <el-table-column prop="address" label="开场时间" align="center"></el-table-column>
                <el-table-column prop="date" label="放映厅" align="center"  width="120"></el-table-column>
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
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                            v-for="item in filmsData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.mname"
                            :disabled="item.disabled"
                            @change="filmsSel(item)">
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
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                            v-for="item in filmsData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { fetchData,getAllRecentFilms } from '../../../api/index';
export default {
    name: "scenearrange",
    data(){
        return{
             query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            isAdd: true,               //点击添加或编辑的标识
            editVisible: false,        //编辑、添加弹窗
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            filmsData: null,          //近期影片
            pickerTimeBegin: null,    //开场时间
            pickerTimeEnd: null,      //结束时间
            value: '',
            filmsSelValue: null       //选择的电影数据
        }
    },
     created() {
        this.getData();
        this.filmsSels()
    },
    methods:{
        //电影选择
        filmsSels(item){
            console.log(item)
            this.filmsSelValue = item
        },
        //开场时间选定
        handleTimeBegin(){
            console.log(this.value)
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
        //添加场次
        addScene(){
            this.editVisible = true;
            this.isAdd = true;
            this.getFilms();
        },
         // 获取数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 50;
            });
        },      
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            this.isAdd = false;
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            this.getFilms();
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }, 
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