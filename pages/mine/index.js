import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getUserInfo } from '../../redux/index';
const app = getApp();

const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata
  },
  async onLoad(options) { },
  async onShow() {
    // 获取用户信息
    getUserInfo();
  }
}

const mapStateToPage = state => ({
    userInfo: state.userInfo
})

Page(connect(mapStateToPage)(pageConfig))
