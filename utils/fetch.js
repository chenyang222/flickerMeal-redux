import regeneratorRuntime from '../libs/runtime';
const globalUrl = 'https://shanchan.jergavin.com';
// 接口请求
const fetch = async ({ method = "GET", url, data = {}, requestBody }) => {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // 本地存储获取token
  const token = wx.getStorageSync("token");
  let header = {};
  // header设置token
  if (method == 'post' && requestBody) {
    header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  if (token) {
    header["Authorization"] = token;
  }
  // promise 封装 wx.request
  return await new Promise((resolve, reject) => {
    wx.request({
      method: method,
      url: `${globalUrl}${url}`,
      data: data,
      header: header,
      success: function (response) {
        wx.hideLoading()
        // 接口返回 errcode 统一处理
        if (response.data.errcode == 0) {
          resolve(response.data.data)
        } else if (response.data.errcode == 10003) {
          wx.showToast({
            title: '登陆信息已过期，将自动重新登陆',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          wx.setStorageSync('token', '');
          wx.setStorageSync('oldDate', '');
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          },1000)
        } else {
          wx.showToast({
            title: response.data.errmsg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
          reject(response)
        }
      },
      fail: function (response) {
        wx.hideLoading()
      }
    })
  })
}

module.exports = {
  fetch: fetch
}