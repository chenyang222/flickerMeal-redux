import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getUserInfo } from '../../redux/index';
const app = getApp();

const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata
  },
  async onLoad(options) { },
  async onShow() {
    // 获取用户信息
    getUserInfo();
  },
  toCall: function () {
    wx.makePhoneCall({
      phoneNumber: '400-6677-112'
    })
  },
  goPermsg: function () {
    wx.navigateTo({
      url: "/pages/mine/permsg/permsg"
    })
  }
}

const mapStateToPage = state => ({
  userInfo: state.userInfo,
  shopCarNumber: state.shopCarNumber
})

Page(connect(mapStateToPage)(pageConfig))
