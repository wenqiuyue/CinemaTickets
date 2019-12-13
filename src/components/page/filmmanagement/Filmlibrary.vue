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
                    icon="el-icon-document-add"
                    class="handle-del mr10"
                    @click="AddFilm"
                >添加影片</el-button>
                <el-input v-model="query.name" placeholder="请输入影片" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                v-loading="loading"
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
                <el-table-column label="影片图片" align="center" width="100">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.mpicture"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="mname" label="影片名" align="center"></el-table-column>
                <el-table-column prop="mtype" label="影片类型" align="center"></el-table-column>
                <el-table-column prop="mcountry" label="拍摄国家" align="center"></el-table-column>
                <el-table-column prop="releasetime" label="上映时间" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.releasetime | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop="mduration" label="影片时长" align="center"></el-table-column>
                <el-table-column prop="mintroduction" label="影片简介" align="center">        
                    <template slot-scope="scope">
                        <el-tooltip  effect="dark"  placement="left-start">
                            <div slot="content" class="item">{{scope.row.mintroduction}}</div>               
                            <div class="mintroduction">{{ scope.row.mintroduction}}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                 <el-table-column label="是否上架" align="center" width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isRecent" @change="recentChange(scope.$index, scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
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
                    :total="filmTotal"
                    :pager-count="11"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="isAdd?'添加影片':'编辑影片'" :visible.sync="editVisible" width="35%">
            <el-form :model="form" label-width="80px" :rules="rules" ref="formRules">
                <el-form-item label="影片图片" prop="mpictureform">
                    <div class="crop-demo">
                        <img :src="form.mpictureform" class="pre-img" />
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
                <el-form-item label="影片名" prop="mnameform">
                    <el-input v-model="form.mnameform"></el-input>
                </el-form-item>
                <el-form-item label="影片类型" prop="mtypeform">
                    <el-input v-model="form.mtypeform"></el-input>
                </el-form-item>
                <el-form-item label="拍摄国家" prop="mcountryform">
                    <el-input v-model="form.mcountryform"></el-input>
                </el-form-item>
                <el-form-item label="上映时间" prop="releasetimeform">
                    <div class="block">
                        <el-date-picker
                            v-model="form.releasetimeform"
                            type="datetime"
                            placeholder="选择日期时间"
                        ></el-date-picker>
                    </div>
                    <!-- <el-input v-model="form.releasetime"></el-input> -->
                </el-form-item>
                <el-form-item label="影片时长" prop="mdurationform">
                    <el-input v-model="form.mdurationform" >
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="影片简介" prop="mintroductionform">
                    <el-input type="textarea" v-model="form.mintroductionform"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="isAdd?addFilms('formRules'):saveEdit('formRules')"
                >确 定</el-button>
            </span>
            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <vue-cropper
                    ref="cropper"
                    :src="cropImg"
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
import { getMoviePagination, addFilm, getAllMovie,getAllMovieCount,updateMovieById,delMovieByid,getMovieByName,getMovieByNameCount,addRecentFilms,delRecentFilmsById, getAllRecentFilms } from '../../../api/index';
import VueCropper from 'vue-cropperjs';
export default {
    name: 'filmlibrary',
    data() {
        return {
            query: {
                pageIndex: 1,  //当前页数
                pageSize: 5,  //每页显示条目个数
                name: null  //搜索的影片名字
            },
            isAdd: true, //是否点击添加按钮
            // imageUrl: '',
            tableData: [],
            multipleSelection: [],   //多选
            delList: [],
            editVisible: false, //添加、编辑弹窗是否显示
            filmTotal: null,   //影片库数量
            defaultSrc: require('../../../assets/img/addPic.png'),
            cropImg: '',  //剪裁的图片
            dialogVisible: false,  //剪裁
            loading:false,  //加载
            isSearch: false,  //是否点击搜索按钮
            isRecent: false,
            form: {
                midform:null, //影片id
                mpictureform: '', //添加图片的展示图片
                mnameform: null, //影片名
                mtypeform: null, //影片类型
                mcountryform: null, //拍摄国家
                releasetimeform: null, //上映时间
                mdurationform: null, //影片时长
                mintroductionform: null //影片简介
            },
            idx: -1,   //影片库第几行
            id: -1,
            rules: {
                mpictureform: [{ required: true, message: '请上传影片图片', trigger: 'blur' }],
                mnameform: [{ required: true, message: '请输入影片名', trigger: 'blur' }],
                mtypeform: [{ required: true, message: '请输入影片类型', trigger: 'blur' }],
                mcountryform: [{ required: true, message: '请输入拍摄国家', trigger: 'blur' }],
                releasetimeform: [{ required: true, message: '请输入上映时间', trigger: 'blur' }],
                mdurationform: [{ required: true, message: '请输入影片时长', trigger: 'blur' }],
                mintroductionform: [{ required: true, message: '请输入影片简介', trigger: 'blur' }]
            }
        };
    },
    components: {
        VueCropper
    },
    computed:{
        //监听搜索框的影片名是否发生改变
        watchSearchName(){ return this.query.name}
    },
    watch:{
        watchSearchName(_new, _old){
            if(this.isSearch === true){
                this.isSearch = false
                this.getFilmCount();
                this.getData();
            }          
        }
    },
    created() {
        this.getFilmCount();
        this.getData();
        this.form.mpictureform = this.defaultSrc;
    },
    methods: {
        //影片是否上架
        recentChange(index, row) {
            //影片上架
            if(row.isRecent){
                addRecentFilms({mid:row.mid}).then(res => {
                    if(res === true){
                        this.$message.success("上架成功");
                    }else{
                        this.$message.success("上架失败");
                        row.isRecent =false;
                    }
                })
            }else{  //影片下架
                delRecentFilmsById({mid:row.mid}).then(res => {
                     if(res === true){
                        this.$message.success("下架成功");
                    }else{
                        this.$message.success("下架失败");
                        row.isRecent =false;
                    }
                })
            }
        },
        //获取上架影片,初始化影片是否上架
        getAllRecent(tableData) {
            //给tableData添加isRecent属性
            for(let item of tableData){
                this.$set(item,'isRecent',false);
            }
            getAllRecentFilms().then(data => {
                for(let resitem of data.body){
                    for(let item of tableData){
                        if(resitem.mid === item.mid)
                            item.isRecent = true
                    }
                }
            })
        },
        //获取影片库数量
        getFilmCount() {
            getAllMovieCount().then(res => {
                this.filmTotal = res;
            })
        },
        // 获取影片库数据
        getData() {
            let data={
                pageIndex: this.query.pageSize*(this.query.pageIndex-1),
                pageSize: this.query.pageSize  
            }
            getMoviePagination(data).then(res => {
                if (res.code === 0) {
                    this.tableData = res.body;
                    if(this.isAdd === true){
                        this.getAllRecent(this.tableData)
                    }                 
                    this.loading = false;
                }
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.isSearch = true
            let data={
                pageIndex: this.query.pageSize*(this.query.pageIndex-1),
                pageSize: this.query.pageSize,
                name: this.query.name  
            }
            Promise.all([
                //获取搜索影片的数量
                getMovieByNameCount({name:this.query.name}),
                getMovieByName(data)
            ]).then(results => {
                this.filmTotal = results[0]
                if(results[1].code === 0){
                    this.tableData = results[1].body;
                    this.getAllRecent(this.tableData)
                    this.loading = false;
                }
            })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    delMovieByid({mid:row.mid}).then(res => {
                        if(res === true){
                            this.$message.success('删除成功');
                            // this.tableData.splice(index, 1);
                            this.filmTotal--;
                            this.getData();                       
                        }
                    })                   
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            console.log(row);
            this.form.mpictureform = row.mpicture;
            this.form.mnameform = row.mname;
            this.form.mcountryform = row.mcountry;
            this.form.mtypeform = row.mtype;
            this.form.mdurationform = row.mduration;
            this.form.mintroductionform = row.mintroduction;
            this.form.releasetimeform = row.releasetime;
            this.form.midform = row.mid
            this.idx = index;
            this.isAdd = false;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(formName) {
            this.$refs[formName].validate(vail => {
                if (vail) {
                    let data = {
                        mpicture: this.form.mpictureform,
                        mname: this.form.mnameform,
                        mtype: this.form.mtypeform,
                        mcountry: this.form.mcountryform,
                        releasetime: this.form.releasetimeform,
                        mduration: this.form.mdurationform,
                        mintroduction: this.form.mintroductionform,
                        mid: this.form.midform
                    };
                    updateMovieById(data).then(res => {
                        if(res === true){
                            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.$set(this.tableData, this.idx, data);
                        }
                        this.editVisible = false;      
                    })                                     
                } else {
                    return;
                }
            });
        },
        //点击添加影片按钮
        AddFilm() {
            //清空表单
            this.form.mpictureform = this.defaultSrc;
            this.form.mnameform = null;
            this.form.mtypeform = null;
            this.form.mcountryform = null;
            this.form.releasetimeform = null;
            this.form.mdurationform = null;
            this.form.mintroductionform = null;
            this.isAdd = true;
            this.editVisible = true;
        },
        //添加影片
        addFilms(formName) {
            this.$refs[formName].validate(vail => {
                if (vail) {
                    let data = {
                        mpicture: this.form.mpictureform,
                        mname: this.form.mnameform,
                        mtype: this.form.mtypeform,
                        mcountry: this.form.mcountryform,
                        releasetime: this.form.releasetimeform,
                        mduration: this.form.mdurationform,
                        mintroduction: this.form.mintroductionform
                    };
                    addFilm(data).then(res => {
                        //当数据库插入数据成功时，界面刷新数据
                        if(res === true){
                            this.filmTotal++;
                            this.getData();
                        }
                        this.editVisible = false;
                    });
                } else {
                    return;
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.loading = true;
            this.$set(this.query, 'pageIndex', val);
            if(this.isSearch === true){
                this.handleSearch()
            }else{
                this.getData();
            }          
        },
        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = event => {
                this.dialogVisible = true;
                this.cropImg = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        cropImage() {
            this.form.mpictureform = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop() {
            this.dialogVisible = false;
            this.form.mpictureform = this.defaultSrc;
        }
    }
};
</script>

<style lang="scss" scoped>
.el-tooltip__popper{
    width: 100px;
}
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
    width: 50px;
    height: 50px;
}
.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.crop-demo {
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
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
.mintroduction{
    display: -webkit-box;
    overflow: hidden; /*超出宽度部分隐藏*/
    text-overflow: ellipsis; /*超出部分以点号代替*/
    -webkit-line-clamp: 3; /*行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1rem;
    font-size: 13px;
}

.item {
    width: 400px;
    text-align: center;
}

</style>
