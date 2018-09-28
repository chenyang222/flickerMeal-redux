import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getUserInfo, getOrderInfo, getOrderCoupon, getOrderActivitys, getPayByBalance, getPayByWechat } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        couponSelectId: 'nouse', // 选择的优惠券的id
        payType: 2, // 0=积分兑换 1=微信支付 2=余额支付
        reduceType: 'coupon',
        feeMoney: 0,
        countAmountNum: 0,
        orderNo: ''
    },
    async onLoad(options) {
        getUserInfo(); // 获取余额
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
        }, this.data.orderInfo.orderAmount);

        let couponSelectId = 'nouse';
        let reduceType = 'coupon';
        let feeMoney = 0;
        let countAmountNum = this.data.orderInfo.orderAmount;
        if (this.data.orderInfo.activityType) {
            reduceType = this.data.orderInfo.activityType;
            feeMoney = this.data.orderInfo.activityFee;
            countAmountNum = this.data.orderInfo.payAmount;
        }
        this.setData({
            reduceType: reduceType,
            feeMoney: feeMoney,
            couponSelectId: couponSelectId,
            countAmountNum: countAmountNum > 0 ? countAmountNum : 0,
            orderNo: orderNo
        })
    },
    async onShow() {
        if (this.data.couponSelectId == 'nouse') {
            let reduceType = 'coupon';
            let feeMoney = 0;
            let countAmountNum = this.data.orderInfo.orderAmount;
            if (this.data.orderInfo.activityType) {
                reduceType = this.data.orderInfo.activityType;
                feeMoney = this.data.orderInfo.activityFee;
                countAmountNum = this.data.orderInfo.payAmount;
            }
            this.setData({
                reduceType: reduceType,
                feeMoney: feeMoney,
                countAmountNum: countAmountNum > 0 ? countAmountNum : 0
            })
        } else {
            let amount = '';
            let countAmountNum = this.data.orderInfo.orderAmount;
            for (let i = 0; i < this.data.orderCouponList.length; i++) {
                if (this.data.couponSelectId == this.data.orderCouponList[i].id) {
                    amount = this.data.orderCouponList[i].amount;
                }
            }
            let reduceType = 'coupon';
            let feeMoney = amount;
            countAmountNum = (this.data.orderInfo.orderAmount * 100 - feeMoney * 100) / 100;
            this.setData({
                reduceType: reduceType,
                feeMoney: feeMoney,
                countAmountNum: countAmountNum > 0 ? countAmountNum : 0
            })
        }
    },
    // 切换支付方式
    selectPaytype: function (e) {
        this.setData({
            payType: e.currentTarget.dataset.paytype
        })
    },
    // 去选择优惠券
    toSelectCoupon: function () {
        wx.navigateTo({
            url: '/pages/order/selectCoupon/selectCoupon?couponSelectId=' + this.data.couponSelectId,
        })
    },
    // 去支付
    toPay: function () {
        const orderNo = this.data.orderNo;
        const couponId = this.data.couponSelectId;
        const data = {
            orderNo: orderNo,
            couponId: couponId == 'nouse' ? '' : couponId
        }
        if (this.data.payType == 2 || this.data.countAmountNum == 0) {
            // 余额支付
            getPayByBalance(data)
        } else if (this.data.payType == 1) {
            // 微信支付
            getPayByWechat(data)
        }
    }
}

const mapStateToPage = state => ({
    machineInfo: state.machineInfo,
    userInfo: state.userInfo,
    orderInfo: state.orderInfo,
    orderCouponList: state.orderCouponList,

})

Page(connect(mapStateToPage)(pageConfig))
