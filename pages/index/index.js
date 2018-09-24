//index.js
//获取应用实例
import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getBanner, getMachine, getIndexCoupon, haveIndexCoupon } from '../../redux/index';
const app = getApp();

const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata,
    isShouAllList: false
  },
  async onLoad(options) {
    // 获取轮播
    getBanner();
  },
  async onShow() {
    await getMachine(this.data.positionInfo.areaCode);
    getIndexCoupon(this.data.machineList[0].id);
    
  },
  // 是否展示所有优惠券切换
  showAllCoupon: function () {
    this.setData({
      isShouAllList: !this.data.isShouAllList
    })
  },
  // 领取优惠券
  haveIndexCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id;
    const macId = this.data.machineList[0].id;
    const data = {
      macId: macId,
      couponId: couponId
    }
    haveIndexCoupon(data)
  }
}

const mapStateToPage = state => ({
  positionInfo: state.positionInfo,
  bannerList: state.bannerList,
  machineList: state.machineList,
  indexAllCouponList: state.indexAllCouponList,
  indexCouponList: state.indexCouponList
})

Page(connect(mapStateToPage)(pageConfig))
