<template>
    <div v-if="filmData">
        <return-h :title="filmData.film.mname"></return-h>
        <div class="seat-title">
            {{filmData.film.mname}}
            <span
                class="seat-title-time"
            >{{filmData.timebegin | dateFormat}} {{filmData.mlanguage}}{{filmData.meffect}}</span>
        </div>
        <div class="seat">
            <div class="seat-title">
                <span class="pid">{{filmData.pid}}号厅</span>
            </div>
            <div class="seat-table">
                <table class="scoreTable">
                    <tr v-for="(itemr,index) in filmData.projectionHall.mrow" class="seat-tr">
                        <span class="index">{{index+1}}</span>
                        <td
                            v-for="(itemc,index1) in filmData.projectionHall.mcolumn"
                            class="seat-td"
                        >
                            <span
                                :class="`icon-el-icon-zuowei zuowei${itemr}${itemc}`"
                                @click="seatSelect(itemr,itemc)"
                            ></span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import returnH from '../../common/return.vue';
import { GetExclusivepieceInfoByEid } from '../../../api/index';
export default {
    name: 'seatselection',
    components: {
        returnH
    },
    data() {
        return {
            eid: this.$route.query.eid,
            filmData: null //影片数据
        };
    },
    created() {
        GetExclusivepieceInfoByEid({ eid: this.eid }).then(res => {
            console.log(res);
            if (res.code === 0) {
                this.filmData = res.body;
            }
        });
    },
    methods: {
        seatSelect(row, column) {
            console.log(row, column);
        }
    }
};
</script>
<style lang="scss" scoped>
.seat-title {
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #ebeef5;
    .seat-title-time {
        display: block;
        font-size: 12px;
        margin-top: 8px;
        color: #909399;
    }
}
.seat {
    background: rgba($color: #f0f0f0, $alpha: 0.4);
    padding: 0px 5px;
    text-align: center;
    .seat-title {
        width: 80px;
        height: 0;
        border-top: 25px solid #dbdcdc;
        border-right: 25px solid transparent;
        border-left: 25px solid transparent;
        margin-left: 30%;
        font-size: 13px;
        color: #909399;
        position: relative;
        font-weight: bold;
        .pid {
            position: absolute;
            top: -20px;
            left: 37px;
        }
    }
    .seat-table {
        width: 100%;
        overflow: scroll;
        .scoreTable {
            tr {
                height: 30px;
            }
            td {
                .icon-el-icon-zuowei {
                    margin-left: 3px;
                }
            }
            .index {
                font-size: 14px;
            }
        }
    }
}
</style>