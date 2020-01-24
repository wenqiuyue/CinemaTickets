import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
//登录
export function login(data) {
    return request({
        url: '/manager/getUserByNameAndPassword',
        method: 'post',
        data
    });
}
//添加影片
export function addFilm(data) {
    return request({
        url: '/manager/addMovie',
        method: 'post',
        data
    });
}
//获取所有影片
export function getAllMovie() {
    return request({
        url: '/manager/getAllMovie',
        method: 'get'
    });
}
//分页查询
export function getMoviePagination(data) {
    return request({
        url: '/manager/getMoviePagination',
        method: 'post',
        data
    });
}
//查询影片库数量
export function getAllMovieCount() {
    return request({
        url: '/manager/getAllMovieCount',
        method: 'get'
    });
}
//修改影片库的影片信息
export function updateMovieById(data) {
    return request({
        url: '/manager/updateMovieById',
        method: 'post',
        data
    });
}
//根据影片id删除影片库的影片
export function delMovieByid(data) {
    return request({
        url: '/manager/delMovieByid',
        method: 'get',
        params: data
    });
}
//根据电影名字影片库模糊查询
export function getMovieByName(data) {
    return request({
        url: '/manager/getMovieByName',
        method: 'post',
        data
    });
}
//根据电影名字影片库模糊查询的数据个数
export function getMovieByNameCount(data) {
    return request({
        url: '/manager/getMovieByNameCount',
        method: 'get',
        params: data
    });
}
//添加近期影片
export function addRecentFilms(data) {
    return request({
        url: '/manager/addRecentFilms',
        method: 'get',
        params: data
    });
}
//根据影片id删除近期影片
export function delRecentFilmsById(data) {
    return request({
        url: '/manager/delRecentFilmsById',
        method: 'get',
        params: data
    });
}
//获取近期影片
export function getAllRecentFilms() {
    return request({
        url: '/manager/getAllRecentFilms',
        method: 'get'
    });
}
// 添加放映厅
export function addProjectionHall(data) {
    return request({
        url: '/manager/addProjectionHall',
        method: 'post',
        data
    });
}
//获取所有放映厅
export function getAllProjectionHall() {
    return request({
        url: '/manager/getAllProjectionHall',
        method: 'get'
    });
}
//添加放映厅
export function updateProjectionHallById(data) {
    return request({
        url: '/manager/updateProjectionHallById',
        method: 'post',
        data
    });
}
//删除放映厅
export function delProjectionHallById(data) {
    return request({
        url: '/manager/delProjectionHallById',
        method: 'get',
        params: data
    });
}
//单表查询场次
export function getExclusivepiece() {
    return request({
        url: '/manager/getExclusivepiece',
        method: 'get'
    });
}
//添加场次安排
export function addExclusivePiece(data) {
    return request({
        url: '/manager/addExclusivePiece',
        method: 'post',
        data
    });
}
//多表获取排片信息
export function getExclusivepieceInfo(data) {
    return request({
        url: '/manager/getExclusivepieceInfo',
        method: 'post',
        data
    });
}
//获取场次数量
export function getExclusivepieceCount() {
    return request({
        url: '/manager/getExclusivepieceCount',
        method: 'get'
    });
}
//根据电影名字对场次安排模糊查询
export function gettExclusivepieceByName(data) {
    return request({
        url: '/manager/gettExclusivepieceByName',
        method: 'post',
        data
    });
}
//获取电影名模糊查询场次的数量
export function getExclusivepieceByNameCount(data) {
    return request({
        url: '/manager/getExclusivepieceByNameCount',
        method: 'get',
        params: data
    });
}
//删除场次
export function delExclusivepieceById(data) {
    return request({
        url: '/manager/delExclusivepieceById',
        method: 'get',
        params: data
    });
}
//编辑场次
export function UpdateExclusivepieceById(data) {
    return request({
        url: '/manager/UpdateExclusivepieceById',
        method: 'post',
        data
    });
}
//获取近期热门电影
export function GetAllPopularRecentFilms() {
    return request({
        url: '/manager/GetAllPopularRecentFilms',
        method: 'get'
    });
}
//根据电影id查询电影信息
export function GetFilmById(data) {
    return request({
        url: '/manager/GetFilmById',
        method: 'get',
        params: data
    });
}
//根据电影id查询电影排片
export function GetExclusivePieceById(data) {
    return request({
        url: '/manager/GetExclusivePieceById',
        method: 'get',
        params: data
    });
}
//删除不是当日的排片数据
export function DelExclusivepieceNotTody() {
    return request({
        url: '/manager/DelExclusivepieceNotTody',
        method: 'get'
    });
}
//添加影评
export function AddFilmReview(data) {
    return request({
        url: '/manager/AddFilmReview',
        method: 'post',
        data
    });
}
//根据影片id获取该影片影评
export function GetFilmReviewByMid(data) {
    return request({
        url: '/manager/GetFilmReviewByMid',
        method: 'get',
        params: data
    });
}
//获取所有影片分数
export function GetFilmScore() {
    return request({
        url: '/manager/GetFilmScore',
        method: 'get'
    });
}
//改变影片分数
export function UpdateFilmScore(data) {
    return request({
        url: '/manager/UpdateFilmScore',
        method: 'post',
        data
    });
}
//根据影片id获取该影片所有评价
export function GetFilmReviewInfoById(data) {
    return request({
        url: '/manager/GetFilmReviewInfoById',
        method: 'get',
        params: data
    });
}
//添加想看的影片
export function AddWantSeeFilm(data) {
    return request({
        url: '/manager/AddWantSeeFilm',
        method: 'post',
        data
    });
}
//查询添加想看的影片是否已添加
export function IsAddWantSeeFilm(data) {
    return request({
        url: '/manager/IsAddWantSeeFilm',
        method: 'post',
        data
    });
}
//根据排片id多表获取排片信息
export function GetExclusivepieceInfoByEid(data) {
    return request({
        url: '/manager/GetExclusivepieceInfoByEid',
        method: 'get',
        params: data
    });
}
//插入订单
export function AddOrder(data) {
    return request({
        url: '/manager/AddOrder',
        method: 'post',
        data
    });
}
//获取某场次已被选的座位
export function GetSeatselectionByEid(data) {
    return request({
        url: '/manager/GetSeatselectionByEid',
        method: 'get',
        params: data
    });
}
//根据订单编号获取订单信息
export function GetOrderInfo(data) {
    return request({
        url: '/manager/GetOrderInfo',
        method: 'get',
        params: data
    });
}
