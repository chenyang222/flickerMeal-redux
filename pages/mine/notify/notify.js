import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getNotify } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata
    },
    async onLoad(options) { },
    async onShow() {
        // 获取消息通知
        getNotify();
    }
}

const mapStateToPage = state => ({
    notifyList: state.notifyList
})

Page(connect(mapStateToPage)(pageConfig))
