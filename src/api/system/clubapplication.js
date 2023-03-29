import request from '@/utils/request'

// 查询社团申请列表列表
export function listClubapplication(query) {
  return request({
    url: '/system/clubapplication/list',
    method: 'get',
    params: query
  })
}

// 查询社团申请列表详细
export function getClubapplication(id) {
  return request({
    url: '/system/clubapplication/' + id,
    method: 'get'
  })
}

// 新增社团申请列表
export function addClubapplication(data) {
  return request({
    url: '/system/clubapplication',
    method: 'post',
    data: data
  })
}

// 修改社团申请列表
export function updateClubapplication(data) {
  return request({
    url: '/system/clubapplication',
    method: 'put',
    data: data
  })
}

// 删除社团申请列表
export function delClubapplication(id) {
  return request({
    url: '/system/clubapplication/' + id,
    method: 'delete'
  })
}

// 同意申请
export function approvalClubapplication(data) {
  return request({
    url: '/system/clubapplication/approval',
    method: 'post',
    data: data
  })
}

// 拒绝申请
export function rejectClubapplication(data) {
  return request({
    url: '/system/clubapplication/reject',
    method: 'post',
    data: data
  })
}