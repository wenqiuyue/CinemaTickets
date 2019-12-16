<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 放映厅管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-lx-add"
                    class="mr10"
                    @click="addProjectionHall"
                >添加放映厅</el-button>
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
                <el-table-column label="影厅编号" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.pid}}号厅
                    </template>
                </el-table-column>
                <el-table-column label="座位排数" align="center">
                    <template slot-scope="scope">{{scope.row.mrow}}排</template>
                </el-table-column>
                <el-table-column label="座位列数" align="center">
                    <template slot-scope="scope">{{scope.row.mcolumn}}列</template>
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
        </div>
        <!-- 添加弹窗、编辑弹窗 -->
        <el-dialog :title="isAdd?'添加':'编辑'" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="影厅座位排数" :label-width="formLabelWidth">
                <el-input v-model="form.row" autocomplete="off">
                    <template slot="append">排</template>
                </el-input>
                </el-form-item>
                <el-form-item label="影厅座位行数" :label-width="formLabelWidth">
                <el-input v-model="form.column" autocomplete="off">
                    <template slot="append">列</template>
                </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="isAdd?saveAddEdit():updateAddEdit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { addProjectionHall,getAllProjectionHall,updateProjectionHallById,delProjectionHallById } from '../../../api/index';
export default {
    name: "projectionhallmanager",
    data(){
        return {
            dialogFormVisible: false,  //添加编辑弹窗是否显示
            formLabelWidth: '120px',   //表单宽度
            isAdd: true,               //点击添加或编辑的标识
            tableData: [],             //显示的表格数据
            form: {                    //添加编辑弹窗表单
                row: null,
                column: null,
                id: null
            },
            idx: -1,                 
        };
    },
    created(){
        this.getData();
    },
    methods:{
        //添加放映厅
        addProjectionHall(){
            this.isAdd = true;
            this.form = {};
            this.dialogFormVisible = true;
        },
         // 获取放映厅数据
        getData() {
            getAllProjectionHall().then(res => {
                console.log(res);
                this.tableData = res.body;
            });
        },
        // 编辑操作
        handleEdit(index, row) {  
            this.idx = index;         
            this.form.row = row.mrow;
            this.form.column = row.mcolumn;
            this.form.id = row.pid;
            this.isAdd = false;
            this.dialogFormVisible = true;
        },
        // 添加保存编辑
        saveAddEdit() {
            let data={
                mrow: this.form.row,
                mcolumn: this.form.column
            }
            addProjectionHall(data).then(res => {
                console.log(res)
                if(res === true){
                    this.$message.success("添加成功");
                    this.getData();                  
                }else{
                    this.$message.success("添加失败");
                }
                this.dialogFormVisible = false;
            })
            
            // this.$set(this.tableData, this.idx, this.form);
        },
        // 编辑保存编辑
        updateAddEdit() {
            let data={
                mrow: this.form.row,
                mcolumn: this.form.column,
                pid: this.form.id
            }
            updateProjectionHallById(data).then(res => {
                if(res === true){
                    this.$message.success("修改成功");
                    this.$set(this.tableData, this.idx, data);
                }else{
                    this.$message.success("修改失败");
                }
            })
            this.dialogFormVisible = false;
            // this.$set(this.tableData, this.idx, this.form);
        },
        //删除放映厅
        handleDelete(index,row){
            delProjectionHallById({pid:row.pid}).then(res => {
                if(res === true){
                    this.$message.success("删除成功");
                    this.tableData.splice(index,1);
                }else{
                    this.$message.success("删除失败");
                }
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
</style>