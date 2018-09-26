import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getOrderInfo, getOrderCoupon, getOrderActivitys } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        couponSelect: '', // 优惠券选择
        couponList: [], // 优惠券List
        couponSelectId: '' // 选择的优惠券的id
    },
    async onLoad(options) {
        const orderNo = options.orderNo;
        // 获取订单信息
        // await getOrderInfo({
        //     // orderNo: orderNo
        //     orderNo: 'FD2018092603566'
        // });
        await getOrderActivitys({
            orderNo: orderNo
        })
        // 获取当前订单机器可用优惠券
        await getOrderCoupon({
            use: 0,
            flag: 0,
            macId: this.data.machineInfo.id
        });
        let length = 0;
        let list = [];
        for (let i = 0; i < this.data.orderCouponList.length; i++) {
          if (this.data.orderInfo.orderAmount >= this.data.orderCouponList[i].useRestrict && this.data.orderCouponList[i].use == 0) {
            length++;
            list.push(this.data.orderCouponList[i])
          }
        }
        this.setData({
          couponSelect: length + '个可用',
          couponList: list,
          couponSelectId: 'nouse'
        })
    },

}

const mapStateToPage = state => ({
    machineInfo: state.machineInfo,
    userInfo: state.userInfo,
    orderInfo: state.orderInfo,
    orderCouponList: state.orderCouponList,

})

Page(connect(mapStateToPage)(pageConfig))
