import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getCoupon } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata
    },
    async onLoad(options) { },
    async onShow() {
        // 获取我的优惠券列表
        getCoupon();
    }
}

const mapStateToPage = state => ({
    couponList: state.couponList
})

Page(connect(mapStateToPage)(pageConfig))
