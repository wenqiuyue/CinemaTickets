<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 影片库
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="success"
                    icon="el-icon-document-add"
                    class="handle-del mr10"
                    @click="AddFilm"
                >添加影片</el-button>
                <el-input v-model="query.name" placeholder="请输入影片" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="mid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="影片图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="mname" label="影片名" align="center"></el-table-column>
                <el-table-column prop="mtype" label="影片类型" align="center"></el-table-column>
                <el-table-column prop="mcountry" label="拍摄国家" align="center"></el-table-column>
                <el-table-column prop="releasetime" label="上映时间" align="center"></el-table-column>
                <el-table-column prop="mduration" label="影片时长" align="center"></el-table-column>
                <el-table-column prop="mintroduction" label="影片简介" align="center"></el-table-column>
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
        <el-dialog :title="isAdd?'添加影片':'编辑影片'" :visible.sync="editVisible" width="40%">
            <el-form  :model="form" label-width="80px" :rules="rules" ref="formRules">
                <el-form-item label="影片图片" prop="mpicture">
                    <div class="crop-demo">
                        <img :src="form.mpicture" class="pre-img" />
                        <div class="crop-demo-btn">
                            选择图片
                            <input
                                class="crop-input"
                                type="file"
                                name="image"
                                accept="image/*"
                                @change="setImage"
                            />
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="影片名" prop="mname">
                    <el-input v-model="form.mname"></el-input>
                </el-form-item>
                <el-form-item label="影片类型" prop="mtype">
                    <el-input v-model="form.mtype"></el-input>
                </el-form-item>
                <el-form-item label="拍摄国家" prop="mcountry">
                    <el-input v-model="form.mcountry"></el-input>
                </el-form-item>
                <el-form-item label="上映时间" prop="releasetime">
                    <el-input v-model="form.releasetime"></el-input>
                </el-form-item>
                <el-form-item label="影片时长" prop="mduration">
                    <el-input v-model="form.mduration"></el-input>
                </el-form-item>
                <el-form-item label="影片简介" prop="mintroduction">
                    <el-input type="textarea" v-model="form.mintroduction"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('formRules')">确 定</el-button>
            </span>
            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="40%" style>
                <vue-cropper
                    ref="cropper"
                    :src="imgSrc"
                    :ready="cropImage"
                    :zoom="cropImage"
                    :cropmove="cropImage"
                    style="width:100%;height:300px;"
                ></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../../api/index';
import VueCropper from 'vue-cropperjs';
export default {
    name: 'filmlibrary',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10
            },
            isAdd: false, //是否点击添加按钮
            defaultSrc: require('../../../assets/img/addPic.png'),
            imgSrc: '',
            dialogVisible: false,

            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                mpicture: '', //添加图片的展示图片
                mname: null, //影片名
                mtype: null, //影片类型
                mcountry: null, //拍摄国家
                releasetime: null, //上映时间
                mduration: null, //影片时长
                mintroduction: null //影片简介
            },
            idx: -1,
            id: -1,
            rules: {
                mname: [{ required: true, message: '请输入影片名', trigger: 'blur' }],
                mtype: [{ required: true, message: '请输入影片类型', trigger: 'blur' }],
                mcountry: [{ required: true, message: '请输入拍摄国家', trigger: 'blur' }],
                releasetime: [{ required: true, message: '请输入上映时间', trigger: 'blur' }],
                mduration: [{ required: true, message: '请输入影片时长', trigger: 'blur' }],
                mintroduction: [{ required: true, message: '请输入影片简介', trigger: 'blur' }]
            }
        };
    },
    components: {
        VueCropper
    },
    created() {
        this.getData();
        this.form.mpicture = this.defaultSrc;
    },
    methods: {
        //添加影片
        AddFilm() {
            this.isAdd = true;
            this.form.mpicture = this.defaultSrc;
            this.editVisible = true;
        },
        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = event => {
                this.dialogVisible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        cropImage() {
            this.form.mpicture = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop() {
            this.dialogVisible = false;
            this.form.mpicture = this.defaultSrc;
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
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
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.isAdd = false;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(formName) {
            this.$refs[formName].validate((vail) => {
                if(vail){
                    this.editVisible = false;
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    this.$set(this.tableData, this.idx, this.form);
                    console.log(this.form);
                }else{
                    return
                }
            })   
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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
.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
