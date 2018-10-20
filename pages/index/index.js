//index.js
//获取应用实例
import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getBanner, getActivitys, getMachine, setMachine, getIndexCoupon, haveIndexCoupon, getRecomtc, getMachineLeftNav, getTodayBuy, getWeekBuy, getMachineEva, addBuyCar, indexCreateOrder, getHotSearch } from '../../redux/index';
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
    getWeekList: [],
    activitysText: '暂无活动'
  },
  async onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 获取轮播
    getBanner();
    // 获取活动
    await getActivitys();
    if (JSON.stringify(this.data.activitysList) != '{}') {
      let activitysText = '';
      for (let key in this.data.activitysList) {
        if (this.data.activitysList[key]) {
          if (key == 1) {
            activitysText += '首次下单减免' + this.data.activitysList[key].amount + ','
          }
          if (key == 2) {
            activitysText += this.data.activitysList[key].remark + '订单金额满' + this.data.activitysList[key].joinRestrict + '享受累计折扣，初始' + this.data.activitysList[key].initDis + '折，每新增一单则折扣将增加' + this.data.activitysList[key].proIncr + '折' 
          }
        }
      }
      this.setData({
        activitysText: activitysText
      })
    }
    wx.hideLoading()
  },
  async onShow() {
    const data = {
      areaCode: this.data.positionInfo.areaCode,
      // lat: this.data.positionInfo.location.lat,
      // lng: this.data.positionInfo.location.lng
      fulladdress: this.data.positionInfo.currentCity
    }
    await getMachine(data);
    if (this.data.machineList.length == 0) {
      return
    }
    if (JSON.stringify(this.data.machineInfo) == '{}') {
      await setMachine(this.data.machineList[0])
    }
    const macid = this.data.machineInfo.id;
    // 获取热门搜索
    getHotSearch();
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
    setMachine(item);
    this.setData({
      isShouAllList: false,
      isShouAllMachine: false
    })
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
      let day = date.getDate();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
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
  },
  // 点击今日购---餐品类型
  todaymealType: function (e) {
    this.setData({
      todaymealId: e.currentTarget.dataset.id
    })
  },
  // 点击预定---餐品类型
  prevOrdermealType: function (e) {
    this.setData({
      prevOrdermealId: e.currentTarget.dataset.id
    });
  },
  editShoppingNum: function (id, num) {
    const weekBuyList = this.data.weekBuyList; // 预定餐品
    for (let i = 0; i < weekBuyList.length; i++) {
      if (id == weekBuyList[i].productId) {
        weekBuyList[i].buyNumber = num;
      }
    }
    this.setData({
      weekBuyList: weekBuyList
    })
  },  
  //减
  reduce: function (e) {
    if (e.currentTarget.dataset.buynumber <= 0) {
      return;
    }
    let num = e.currentTarget.dataset.buynumber - 1;
    this.editShoppingNum(e.currentTarget.dataset.productid, num);
  },
  //加
  plus: function (e) {
    let num = e.currentTarget.dataset.buynumber + 1;
    this.editShoppingNum(e.currentTarget.dataset.productid, num)
  },
  // 生成预定订单
  async makeOrder () {
    const nowSelectTime = this.data.nowSelectTime; // 预定时间
    const weekBuyList = this.data.weekBuyList; // 预定餐品
    const macId = this.data.machineInfo.id;
    let childs = [];
    for (let i = 0; i < weekBuyList.length; i++) {
      if (weekBuyList[i].buyNumber > 0) {
        let obj = {};
        obj.macId = macId;
        obj.productId = weekBuyList[i].productId;
        obj.aisleId = weekBuyList[i].aisleId;
        obj.buyNumber = weekBuyList[i].buyNumber;
        childs.push(obj)
      }
    }
    if (childs.length <= 0) {
      return
    }
    let data = {};
    let body = {};
    body.childs = childs;
    body.takeFoodTime = nowSelectTime;
    body.macId = macId;
    data.body = JSON.stringify(body);
    console.info(data)
    const response = await indexCreateOrder(data);
    const orderNo = response.orderNo;
    for (let i = 0; i < weekBuyList.length; i++) {
      weekBuyList[i].buyNumber = 0;
    }
    this.setData({
      weekBuyList: weekBuyList
    })
    wx.navigateTo({
      url: "/pages/order/payment/payment?orderNo=" + orderNo,
    })
  },
  toMachineBaiduMap: function (e) {
    const lat = e.currentTarget.dataset.lat;
    const lng = e.currentTarget.dataset.lng;
    wx.navigateTo({
      url: "/pages/index/machineBaiduMap/machineBaiduMap?lat=" + lat + "&lng=" + lng,
    })
  },
  toSearch: function (e) {
    const searchVal = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/index/searchInfo/searchInfo?from=searchpage&name=' + searchVal,
    })
  }
}

const mapStateToPage = state => ({
  positionInfo: state.positionInfo,
  bannerList: state.bannerList,
  activitysList: state.activitysList,
  machineList: state.machineList,
  machineInfo: state.machineInfo,
  indexAllCouponList: state.indexAllCouponList,
  indexCouponList: state.indexCouponList,
  recomtcList: state.recomtcList.slice(0,3),
  machineLeftNavList: state.machineLeftNavList,
  todayBuyList: state.todayBuyList,
  weekBuyList: state.weekBuyList,
  evaList: state.evaList,
  hotSearchList: state.hotSearchList.slice(0,5)
})

Page(connect(mapStateToPage)(pageConfig))
