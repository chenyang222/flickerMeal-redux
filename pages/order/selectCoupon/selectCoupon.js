import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
// import { getUserInfo } from '../../../redux/index';
const app = getApp();

const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata,
    select: 'nouse'
  },
  async onLoad(options) {
    console.info(options)
    this.setData({
      select: options.couponSelectId
    })
  },
  // 选择使用或者不使用
  selectCoupon: function (e) {
    this.setData({
      select: e.target.dataset.select
    })
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      couponSelectId: e.target.dataset.select
    })
    wx.navigateBack({
      delta: 1
    })
  },
}

const mapStateToPage = state => ({
  orderCouponList: state.orderCouponList
})

Page(connect(mapStateToPage)(pageConfig))
