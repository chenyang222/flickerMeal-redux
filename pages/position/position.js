import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getPosition } from '../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata
    },
    async onLoad(options) { },
    async onShow() {
        // 获取定位信息以及机器列表
        getPosition();
    },
    getPosition: function () {
        wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (tip) {
                if (tip.confirm) {
                    wx.openSetting({
                        success: function (data) {
                            if (data.authSetting["scope.userLocation"] === true) {
                                wx.showToast({
                                    title: '授权成功',
                                    icon: 'success',
                                    duration: 1000
                                })
                                getPosition()
                            } else {
                                wx.showToast({
                                    title: '授权失败',
                                    icon: 'success',
                                    duration: 1000
                                })
                            }
                        }
                    })
                }
            }
        })
    }
}

const mapStateToPage = state => ({
    positionInfo: state.positionInfo
})

Page(connect(mapStateToPage)(pageConfig))