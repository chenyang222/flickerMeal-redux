import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getOrderInfo, getHotOrCold } from '../../../redux/index';
import { formatTime, sToMinutes } from '../../../utils/util';
const app = getApp();

const timeFormat = ['-', '-', ' ', ':', ':', ' '];

const payTime = function (createTime, that) {
  var date = new Date().getTime();
  var overTimeText = '';
  const time = that.data.orderConfig.timeOut * 60 - (date - createTime) / 1000;
  if (time > 0) {
    overTimeText = '剩余支付时间 : ' + sToMinutes(time);
    that.setData({
      overTimeText: overTimeText
    })
    setTimeout(function () {
      payTime(createTime, that);
    }, 1000);
  } else {
    overTimeText = '订单已取消';
    that.setData({
      overTimeText: overTimeText,
      orderStatus: -1
    })
  }
}

const pageConfig = {
    data: {
      imgdata: app.globalData.imgdata,
      orderNoText: '',
      orderStatus: ''
    },
    async onLoad(options) {
      const orderNo = options.orderNo;
      // 获取订单信息
      await getOrderInfo({
        orderNo: orderNo
      });
      const orderInfo = this.data.orderInfo;
      const createTimeText = formatTime(orderInfo.createTime, timeFormat);
      let couponFee;
      let payType;
      let activityFee;
      let activityType;
      let foodOrCold = false;
      let invoiceText = false;
      let takeFoodText = false;
      if (orderInfo.orderStatus == 1 || orderInfo.orderStatus == 2 || orderInfo.orderStatus == 3) {
        couponFee = orderInfo.couponFee ? orderInfo.couponFee : 0; // 优惠券
        activityFee = orderInfo.activityFee ? orderInfo.activityFee : 0; // 活动
        if (orderInfo.invoiceFlag != 'undefined') {
          if (orderInfo.invoiceFlag == 0) {
            invoiceText = '个人'
          } else if (orderInfo.invoiceFlag == 1) {
            invoiceText = '单位'
          }
        }
        if (orderInfo.activityType == 1) {
          activityType = '首单减免'
        } else if (orderInfo.activityType == 2) {
          activityType = '折扣减免'
        }
        if (orderInfo.payType == 0) {
          payType = '积分兑换'
        } else if (orderInfo.payType == 1){
          payType = '微信支付'
        } else if (orderInfo.payType == 2) {
          payType = '余额支付'
        } else if (orderInfo.payType == 3) {
          payType = '抽奖兑换'
        }
        let date = new Date().getTime();
        if (orderInfo.takeFoodTime < date) {
          takeFoodText = formatTime(orderInfo.takeFoodTime, timeFormat);
        }
        if (orderInfo.warmFlag != 'undefined') {
          if (orderInfo.warmFlag == 0) {
            foodOrCold == '未加热'
          } else if (orderInfo.warmFlag == 1) {
            foodOrCold == '已加热'
          }
        }
      }
      this.setData({
        orderNoText: orderNo.substr(0, orderNo.length - 4),
        orderNoLight: orderNo.substr(orderNo.length - 4, 4),
        createTimeText: createTimeText,
        payType: payType ? payType : '',
        takeFoodCode: orderInfo.takeFoodCode ? orderInfo.takeFoodCode : '',
        qrCode: orderInfo.qrCode ? orderInfo.qrCode : '',
        couponFee: couponFee ? couponFee : '',
        activityFee: activityFee ? activityFee : '',
        activityType: activityType ? activityType : '',
        takeFoodText: takeFoodText,
        orderStatus: orderInfo.orderStatus,
        foodOrCold: foodOrCold,
        invoiceText: invoiceText
      })
      if (orderInfo.orderStatus == 0) {
        payTime(orderInfo.createTime, this)
      }
    },
    async onShow() {},
    onShareAppMessage: function (res) {
      const that = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
        return {
          title: '闪餐',
          path: '/pages/login/login',
          imageUrl: '/images/share.jpg'
        }
      }
    },
    async getCold () {
      const orderNo = this.data.orderInfo.orderNo;
      const data = {
        orderNo: orderNo,
        warmFlag: 0
      }
      await getHotOrCold(data)
      this.setData({
        foodOrCold: '未加热'
      })
    },
    async getHot () {
      const orderNo = this.data.orderInfo.orderNo;
      const data = {
        orderNo: orderNo,
        warmFlag: 1
      }
      await getHotOrCold(data)
      this.setData({
        foodOrCold: '已加热'
      })
    },
    // 申请电子发票
    applyEleInvoice: function (e) {
      if (this.data.orderInfo.payAmount < 100) {
        return
      }
      const orderNo = e.target.dataset.orderno;
      wx.navigateTo({
        url: "/pages/order/selectEleInvoice/selectEleInvoice?orderNo=" + orderNo,
      })
    }
}

const mapStateToPage = state => ({
  orderInfo: state.orderInfo,
  orderConfig: state.orderConfig
})

Page(connect(mapStateToPage)(pageConfig))
