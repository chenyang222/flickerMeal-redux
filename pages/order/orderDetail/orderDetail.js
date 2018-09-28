import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getOrderInfo } from '../../../redux/index';
import { formatTime } from '../../../utils/util';
const app = getApp();

const timeFormat = ['-', '-', ' ', ':', ':', ' '];

const pageConfig = {
    data: {
      imgdata: app.globalData.imgdata,
      orderNoText: '',
    },
    async onLoad(options) {
      const orderNo = options.orderNo;
      // 获取订单信息
      await getOrderInfo({
          orderNo: orderNo
      });

      const orderInfo = this.data.orderInfo;
      const createTimeText = formatTime(orderInfo.createTime, timeFormat);

      

      if (orderInfo.orderStatus == 1 || orderInfo.orderStatus == 2 || orderInfo.orderStatus == 3) {

      }

      let date = new Date().getTime();
      let takeFoodText = false;
      if (orderInfo.takeFoodTime > date) {
        takeFoodText = formatTime(orderInfo.takeFoodTime, timeFormat);
      }
      this.setData({
        orderNoText: orderNo.substr(0,10),
        createTimeText: createTimeText,
        // payType: payType ? payType : '',
        // total: response.payAmount,
        // takeFoodCode: response.takeFoodCode ? response.takeFoodCode : '',
        // qrCode: response.qrCode ? response.qrCode : '',
        // couponFee: couponFee,
        takeFoodText: takeFoodText
      })
    },
    async onShow() {},
}

const mapStateToPage = state => ({
    orderInfo: state.orderInfo,

})

Page(connect(mapStateToPage)(pageConfig))
