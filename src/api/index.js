import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
export function login(data) {
    return request({
      url: '/manager/getUserByNameAndPassword',
      method: 'post',
      data
    })
  }
