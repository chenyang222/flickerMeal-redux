//app.js
import regeneratorRuntime from './libs/runtime'
import { createStore } from './libs/redux'
import { Provider } from './libs/wechat-weapp-redux';
//Reducer
import reducers from './redux/reducer/index'
const store = createStore(
  reducers
)

App(Provider(store)({
  globalData: {
    imgdata: 'https://shanchan.jergavin.com/wxapp/images',//正常图片展示的地址
    api: 'https://shanchan.jergavin.com', // 接口请求api
    ak: 'NPfvQSlaxLvtuBWm4YDVwecQNoTACuUY', // 填写申请到的ak
    openid: ''
  },
  async onLaunch () {
    // 每次 state 更新时，打印日志
    // 注意 subscribe() 返回一个函数用来注销监听器
    const unsubscribe = store.subscribe(() =>
      console.log(store.getState())
    )
  },
  // 登陆
  login: function () {
    // 本地存储获取token
    const token = wx.getStorageSync("token");
    const oldDate = wx.getStorageSync("oldDate");
    if (token && !this.verifyToken(oldDate)) {
      wx.reLaunch({
        url: '/pages/index/machine/machine'
      })
    } else {
      const that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: "https://shanchan.jergavin.com/oauth2/token/wechatApp?js_code=" + res.code,
              data: {
                code: res.code
              },
              success: function (res) {
                console.info(res)
                if (res.data.errcode == 0) {
                  // 正常进入
                  that.handleToken(res.data)
                  wx.reLaunch({
                    url: '/pages/index/machine/machine'
                  })
                } else if (res.data.errcode == 40004) {
                  // 此账号当前尚未注册
                  that.globalData.openid = res.data.data;
                } else if (res.data.errcode == 40001) {
                  // 需要重新授权
                } else {
                  wx.showToast({
                    title: res.data.errmsg,
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    }
  },
  /**
   *  token data处理
   */
  handleToken: function (data) {
    const token = data.data.access_token;
    const expires_in = data.data.expires_in;
    let timeStamp = new Date().getTime() + Number(expires_in * 1000);
    const oldDate = new Date(timeStamp);
    wx.setStorageSync('token', token);
    wx.setStorageSync('oldDate', oldDate);
  },
  /**
   * Token验证
   * return true  未过期
   * return false 已过期
  */
  verifyToken: function (oldDate) {
    const nowDate = new Date();
    if (oldDate > nowDate) {
      return false;
    }
    return true;
  }
}))