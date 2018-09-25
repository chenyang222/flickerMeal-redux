//index.js
//获取应用实例
import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getBanner, getMachine, setMachine, getIndexCoupon, haveIndexCoupon, getRecomtc, getMachineLeftNav, getTodayBuy, getWeekBuy, getMachineEva, addBuyCar } from '../../redux/index';
const app = getApp();

const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata,
    isShouAllList: false,
    isShouAllMachine: false,
    currentTab: 0,
    fixedFlag: false,
    boxTop: 0,
    todaymealId: '',
    prevOrdermealId: '',
    nowSelectTime: '',
    getWeekList: []
  },
  async onLoad(options) {
    // 获取轮播
    getBanner();
  },
  async onShow() {
    await getMachine(this.data.positionInfo.areaCode);
    if (this.data.machineList.length == 0) {
      return
    }
    if (JSON.stringify(this.data.machineInfo) == '{}') {
      await setMachine(this.data.machineList[0])
    }
    const macid = this.data.machineInfo.id;
    // 获取优惠券
    getIndexCoupon(macid);
    // 获取推荐套餐
    getRecomtc(macid);
    // 获取机器餐品大类侧边栏
    await getMachineLeftNav(macid);
    this.setData({
      todaymealId: this.data.machineLeftNavList.length > 0 ?  this.data.machineLeftNavList[0].id : '',
      prevOrdermealId: this.data.machineLeftNavList.length > 0 ?  this.data.machineLeftNavList[0].id : ''
    })
    // 获取今日购
    getTodayBuy(macid);
    // 获取预定时间列表
    this.getWeekMessage();
    // 获取预定餐品列表
    this.getWeek();
    // 获取当前机器评价
    getMachineEva(macid);
  },
  // 是否展示所有优惠券切换
  showAllCoupon: function () {
    this.setData({
      isShouAllList: !this.data.isShouAllList
    })
  },
  // 是否展示所有机器切换
  showAllMachine: function () {
    this.setData({
      isShouAllMachine: !this.data.isShouAllMachine
    })
  },
  // 领取优惠券
  haveIndexCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id;
    const macId = this.data.machineInfo.id;
    const data = {
      macId: macId,
      couponId: couponId
    }
    haveIndexCoupon(data)
  },
  // 选中机器
  setMachine: function (e) {
    const item = e.currentTarget.dataset.item;
    setMachine(item)
    this.onShow();
  },
  // 切换tab
  swichTab: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    });
  },
  // 滑动商品列表swiper
  changeSwiper: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  // 获取预定时间列表
  getWeekMessage: function () {
    const arr_week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const date = new Date();
    const getTime = date.getTime();
    let timeList = [];
    for (let i = 0; i < 5; i++) {
      date.setTime(getTime + 24 * 60 * 60 * 1000 * (i + 1))
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      const day = date.getDate();
      if (month < 10) month = '0' + month;
      const weekDay = date.getDay();
      let week;
      for (let j = 0; j < arr_week.length; j++) {
        if (weekDay == j) {
          week = arr_week[j];
          break;
        }
      }
      let obj = {};
      obj.full = year + '-' + month + '-' + day;
      obj.part = month + '-' + day;
      obj.week = week;
      timeList.push(obj)
    }
    this.setData({
      nowSelectTime: timeList[0].full,
      getWeekList: timeList
    })
  },
  // 获取预定餐品列表
  getWeek: function (e) {
    let nowSelectTime;
    const macId = this.data.machineInfo.id;
    if (e) {
      nowSelectTime = e.currentTarget.dataset.full;
      this.setData({
        nowSelectTime: nowSelectTime
      })
    } else {
      const date = new Date();
      const getTime = date.getTime();
      date.setTime(getTime + 24 * 60 * 60 * 1000);
      let month = date.getMonth() + 1;
      if (month < 10) month = '0' + month;
      nowSelectTime = date.getFullYear() + '-' + month + '-' + date.getDate();
    }
    const data = {
      macId: macId,
      time: nowSelectTime
    }
    getWeekBuy(data);
  },
  // 跳转到餐品详情
  toMealDetail: function (e) {
    const item = JSON.stringify(e.currentTarget.dataset.item);
    const cpType = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : '';
    wx.navigateTo({
      url: '/pages/index/mealDetail/mealDetail?item=' + item + '&type=' + cpType,
    })
  },
  //添加到购物车
  addBuyCar: function (e) {
    const aisleId = e.currentTarget.dataset.aisleid;
    const productId = e.currentTarget.dataset.productid;
    const macId = this.data.machineInfo.id;
    const data = {
        aisleId: aisleId,
        productId: productId,
        macId: macId
    }
    addBuyCar(data)
  }
}

const mapStateToPage = state => ({
  positionInfo: state.positionInfo,
  bannerList: state.bannerList,
  machineList: state.machineList,
  machineInfo: state.machineInfo,
  indexAllCouponList: state.indexAllCouponList,
  indexCouponList: state.indexCouponList,
  recomtcList: state.recomtcList.slice(0,3),
  machineLeftNavList: state.machineLeftNavList,
  todayBuyList: state.todayBuyList,
  weekBuyList: state.weekBuyList,
  evaList: state.evaList
})

Page(connect(mapStateToPage)(pageConfig))
