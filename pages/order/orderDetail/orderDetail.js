import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getOrderInfo, getHotOrCold } from '../../../redux/index';
import { formatTime, sToMinutes } from '../../../utils/util';
const app = getApp();

const timeFormat = ['-', '-', ' ', ':', ':', ' '];

const payTime = function (createTime, that) {
  var date = new Date().getTime();
  var overTimeText = '';
  const time = 20 * 60 - (date - createTime) / 1000;
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
      let takeFoodText = false;
      if (orderInfo.orderStatus == 1 || orderInfo.orderStatus == 2 || orderInfo.orderStatus == 3) {
        couponFee = orderInfo.couponFee ? orderInfo.couponFee : 0; // 优惠券
        activityFee = orderInfo.activityFee ? orderInfo.activityFee : 0; // 活动
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
        if (orderInfo.takeFoodTime > date) {
          takeFoodText = formatTime(orderInfo.takeFoodTime, timeFormat);
        }
      }
      this.setData({
        orderNoText: orderNo.substr(0,10),
        createTimeText: createTimeText,
        payType: payType ? payType : '',
        takeFoodCode: orderInfo.takeFoodCode ? orderInfo.takeFoodCode : '',
        qrCode: orderInfo.qrCode ? orderInfo.qrCode : '',
        couponFee: couponFee ? couponFee : '',
        activityFee: activityFee ? activityFee : '',
        activityType: activityType ? activityType : '',
        takeFoodText: takeFoodText,
        orderStatus: orderInfo.orderStatus
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
    getCold: function () {
      const orderNo = this.data.orderInfo.orderNo;
      const data = {
        orderNo: orderNo,
        warmFlag: 0
      }
      getHotOrCold(data)
    },
    getHot: function () {
      const orderNo = this.data.orderInfo.orderNo;
      const data = {
        orderNo: orderNo,
        warmFlag: 1
      }
      getHotOrCold(data)
    }
}

const mapStateToPage = state => ({
  orderInfo: state.orderInfo
})

Page(connect(mapStateToPage)(pageConfig))
