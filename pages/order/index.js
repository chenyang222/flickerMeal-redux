import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getOrders, indexCreateOrder } from '../../redux/index';
import { sToMinutes } from '../../utils/util';
const app = getApp();

// 倒计时
const payTime = function (that) {
  var date = new Date().getTime();
  var data = that.data.orderList;
  for (var i = 0; i < data.length; i++) {
      if (data[i].orderStatus == 0) {
          const time = 20 * 60 - (date - data[i].createTime) / 1000;
          if (time > 0) {
              data[i].countDown = '剩余支付时间' + sToMinutes(time);
          } else {
              data[i].countDown = '订单已取消';
              data[i].orderStatus = -1;
          }
      }
  }
  that.setData({
    orderList: data
  })
  setTimeout(function () {
    payTime(that);
  }, 1000);
};

const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata,
    currentTab: 0, // tab切换
    winWidth: 0,
    winHeight: 0
  },
  async onLoad() {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
  },
  async onShow() {
    // 获取订单列表
    await getOrders();
    payTime(this)
  },
  // 点击tab切换
  swichNav: function (e) {
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 滑动切换tab
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current 
    })
  },
  // 查看订单
  toOrderDetail: function (e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: "/pages/order/orderDetail/orderDetail?orderNo=" + orderNo,
    })
  },
  // 去付款
  toPay: function (e) {
    const orderNo = e.target.dataset.orderno;
    wx.navigateTo({
      url: "/pages/order/payment/payment?orderNo=" + orderNo,
    })
  },
  // 再来一单
  async makeOther (e) {
    const item = e.currentTarget.dataset.item;
    const macId = this.data.machineInfo.id;
    const weekProductList = item.childs; // 预定餐品
    let childs = [];
    for (let i = 0; i < weekProductList.length; i++) {
      if (weekProductList[i].buyNumber > 0) {
        let obj = {};
        obj.macId = macId;
        obj.productId = weekProductList[i].productId;
        obj.aisleId = weekProductList[i].aisleId;
        obj.buyNumber = weekProductList[i].buyNumber;
        childs.push(obj)
      }
    }

    let data = {};
    let body = {};
    body.childs = childs;
    body.macId = macId;
    data.body = JSON.stringify(body);

    const response = await indexCreateOrder(data);
    const orderNo = response.orderNo;
    wx.navigateTo({
      url: "/pages/order/payment/payment?orderNo=" + orderNo,
    })
  },
  // 评价
  toEvaluate: function (e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: "/pages/order/evaluate/evaluate?orderNo=" + orderNo,
    })    
  },
  // 申请电子发票
  applyEleInvoice: function (e) {
    const orderNo = e.target.dataset.orderno;
    wx.navigateTo({
      url: "/pages/order/selectEleInvoice/selectEleInvoice?orderNo=" + orderNo,
    })
  }
}

const mapStateToPage = state => ({
  orderList: state.orderList,
  machineInfo: state.machineInfo
})


Page(connect(mapStateToPage)(pageConfig))
