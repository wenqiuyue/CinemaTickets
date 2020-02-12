<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                :data="orderData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">{{ scope.$index+1 }}</template>
                </el-table-column>
                <el-table-column prop="oid" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="username" label="用户" align="center">
                    <template slot-scope="scope">{{ scope.row.user.username}}</template>
                </el-table-column>
                <el-table-column label="影片图片" align="center" width="100">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.film.mpicture"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="mname" label="影片名" align="center">
                    <template slot-scope="scope">{{ scope.row.film.mname}}</template>
                </el-table-column>
                <el-table-column prop="releasetime" label="场次" align="center">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.exclusivePiece.timebegin | dateFormat }} / {{scope.row.exclusivePiece.pid}}号厅</template>
                </el-table-column>
                <el-table-column prop="seatSelectionList" label="座位" align="center">
                    <template slot-scope="scope">
                        <span
                            v-for="(seat,index) in scope.row.seatSelectionList"
                        >{{ ` ${seat.rowsel}排${seat.columnsel}座 `}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="oprice" label="价钱" align="center" width="100"></el-table-column>
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
    </div>
</template>
<script>
import * as api from '../../../api/index';
export default {
    name: 'ordermanager',
    data() {
        return {
            orderData: null,
            filmTotal: null,
            query: {
                pageIndex: 1,
                pageSize: 5
            }
        };
    },
    created() {
        this.getOrderData();
    },
    methods: {
        getOrderData() {
            let data = {
                pageIndex: this.query.pageSize * (this.query.pageIndex - 1),
                pageSize: this.query.pageSize
            };
            Promise.all([api.GetAllOrderInfo(data), api.GetAllOrderCount()]).then(result => {
                if (result[0].code === 0) {
                    this.orderData = result[0].body;
                } else {
                    this.$message.success(res.message);
                }
                this.filmTotal = result[1];
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getOrderData();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>