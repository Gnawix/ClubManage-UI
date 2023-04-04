import request from '@/utils/request'

// 查询活动申请表列表
export function listActivityapplication(query) {
  return request({
    url: '/system/activityapplication/list',
    method: 'get',
    params: query
  })
}

// 查询活动申请表详细
export function getActivityapplication(id) {
  return request({
    url: '/system/activityapplication/' + id,
    method: 'get'
  })
}

// 新增活动申请表
export function addActivityapplication(actId, userId) {
  return request({
    url: '/system/activityapplication',
    method: 'post',
    data: {
      actId,
      userId
    }
  })
}

// 修改活动申请表
export function updateActivityapplication(data) {
  return request({
    url: '/system/activityapplication',
    method: 'put',
    data: data
  })
}

// 删除活动申请表
export function delActivityapplication(id) {
  return request({
    url: '/system/activityapplication/' + id,
    method: 'delete'
  })
}
