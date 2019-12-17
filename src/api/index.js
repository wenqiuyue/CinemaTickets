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
    })
  };
//添加影片
export function addFilm(data) {
  return request({
    url: '/manager/addMovie',
    method: 'post',
    data
  })
} ;
//获取所有影片
export function getAllMovie(){
  return request({
      url: '/manager/getAllMovie',
      method: 'get'
  });
};
//分页查询
export function getMoviePagination(data){
  return request({
      url: '/manager/getMoviePagination',
      method: 'post',
      data
  });
};
//查询影片库数量
export function getAllMovieCount(){
  return request({
    url: '/manager/getAllMovieCount',
    method: 'get'
  })
};
//修改影片库的影片信息
export function updateMovieById(data){
  return request({
    url: '/manager/updateMovieById',
    method: 'post',
    data
  })
};
//根据影片id删除影片库的影片
export function delMovieByid(data){
  return request({
    url: '/manager/delMovieByid',
    method: 'get',
    params:data
  })
};
//根据电影名字影片库模糊查询
export function getMovieByName(data){
  return request({
    url: '/manager/getMovieByName',
    method: 'post',
    data
  })
};
//根据电影名字影片库模糊查询的数据个数
export function getMovieByNameCount(data){
  return request({
    url: '/manager/getMovieByNameCount',
    method: 'get',
    params:data
  })
};
//添加近期影片
export function addRecentFilms(data){
  return request({
    url: '/manager/addRecentFilms',
    method: 'get',
    params:data
  })
};
//根据影片id删除近期影片
export function delRecentFilmsById(data){
  return request({
    url: '/manager/delRecentFilmsById',
    method: 'get',
    params:data
  })
};
//获取近期影片
export function getAllRecentFilms(){
  return request({
    url: '/manager/getAllRecentFilms',
    method: 'get'
  })
};
// 添加放映厅
export function addProjectionHall(data){
  return request({
    url: '/manager/addProjectionHall',
    method: 'post',
    data
  })
};
//获取所有放映厅
export function getAllProjectionHall(){
  return request({
    url: '/manager/getAllProjectionHall',
    method: 'get'
  })
};
 //添加放映厅
 export function updateProjectionHallById(data){
   return request({
    url: '/manager/updateProjectionHallById',
    method: 'post',
    data
   })
 };
 //删除放映厅
 export function delProjectionHallById(data){
   return request({
      url: '/manager/delProjectionHallById',
      method: 'get',
      params:data
   })
 };
  //单表查询场次
 export function getExclusivepiece(){
   return request({
    url: '/manager/getExclusivepiece',
    method: 'get'
   })
 };
//添加场次安排
export function addExclusivePiece(data){
  return request({
    url: '/manager/addExclusivePiece',
    method: 'post',
    data
  })
};
//多表获取排片信息
export function getExclusivepieceInfo(){
  return request({
    url: '/manager/getExclusivepieceInfo',
    method: 'get'
  })
}

