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
                                :style="selData.indexOf(`${itemr}排${itemc}座`)!==-1 ? 'color:#6BBD01' : ''"
                                @click="seatSelect(itemr,itemc)"
                            ></span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="seat-icon-tips">
                <span class="icon-el-icon-zuowei">
                    <label>可选</label>
                </span>
                <span class="icon-el-icon-zuowei" style="color:#F04C41">
                    <label>不可选</label>
                </span>
                <span class="icon-el-icon-zuowei" style="color:#6BBD01">
                    <label>已选</label>
                </span>
            </div>
        </div>
        <div class="confirm-seat">
            <div class="already-seat" v-if="selData.length">
                <span class="already-seat-title">已选座位</span>
                <van-tag
                    closeable
                    size="medium"
                    color="#999999"
                    plain
                    @close="closeSeat(item)"
                    v-for="(item,index) in selData"
                    key="index"
                >
                    <span>
                        {{item}}
                        <br />
                        <label>￥{{filmData.mprice}}</label>
                    </span>
                </van-tag>
            </div>
            <van-button
                size="large"
                :disabled="selData.length?false:true"
                color="#FE9709"
                @click="confirmSeat"
            >{{selData.length?`￥${filmData.mprice*selData.length} 确认选座`:`请先选座`}}</van-button>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import returnH from '../../common/return.vue';
import * as api from '../../../api/index';
import { Toast, Button, Tag } from 'vant';
Vue.use(Toast)
    .use(Button)
    .use(Tag);
export default {
    name: 'seatselection',
    components: {
        returnH
    },
    data() {
        return {
            eid: this.$route.query.eid,
            row: null, //选择的座位行
            column: null, //选择的座位列
            selData: [],
            filmData: null //影片数据
        };
    },
    created() {
        api.GetExclusivepieceInfoByEid({ eid: this.eid }).then(res => {
            console.log(res);
            if (res.code === 0) {
                this.filmData = res.body;
            }
        });
    },
    methods: {
        seatSelect(row, column) {
            console.log(row, column);
            // this.row = row;
            // this.column = column;
            const isSel = this.selData.indexOf(`${row}排${column}座`);
            if (isSel === -1) {
                if (this.selData.length < 4) {
                    this.selData.push(`${row}排${column}座`);
                } else {
                    Toast('一次最多选择4个座位');
                }
            } else {
                this.selData.forEach((ele, index) => {
                    if (ele === `${row}排${column}座`) {
                        this.selData.splice(index, 1);
                    }
                });
            }
        },
        /**
         * 取消选择的座位
         */
        closeSeat(seat) {
            this.selData.forEach((ele, index) => {
                if (ele === seat) {
                    this.selData.splice(index, 1);
                }
            });
        },
        /**
         * 确认选座
         */
        confirmSeat() {
            let userinfo = localStorage.getItem('USER_INFO');
            if (userinfo) {
                userinfo = JSON.parse(userinfo);
            }
            let mySeat = [];

            this.selData.forEach(ele => {
                const seat = ele.split('排').map(s => {
                    return Number.parseInt(s);
                });
                mySeat.push({ rowsel: seat[0], columnsel: seat[1] });
            });
            const data = {
                eid: Number.parseInt(this.eid),
                uid: userinfo.uid,
                oprice: JSON.stringify(this.filmData.mprice * this.selData.length),
                seatSelectionList: mySeat
            };
            api.AddOrder(data).then(res => {
                console.log(res);
            });
            console.log(data);
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
    padding: 0px 5px 10px 5px;
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
        height: 280px;
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
    .seat-icon-tips {
        margin-top: 30px;
        span {
            font-size: 12px;
            margin: 0 40px;
            label {
                color: #909399;
                margin-left: 3px;
            }
        }
    }
}
.confirm-seat {
    padding: 8px 15px;
    .already-seat {
        padding-bottom: 20px;
        .already-seat-title {
            display: block;
            font-size: 13px;
            padding-bottom: 15px;
        }
        .van-tag {
            margin: 0 3px;
            span {
                font-size: 14px;
                color: #333;
                label {
                    color: #fa6447;
                    font-size: 13px;
                }
            }
        }
    }
}
</style>