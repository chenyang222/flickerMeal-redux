import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getRecommend } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata
    },
    async onLoad(options) { },
    async onShow() {
        // 获取推荐信息
        getRecommend(); 
    },
    // 小程序分享设置
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            const userId = this.data.userInfo.userId;
            return {
                title: '闪餐',
                path: '/pages/login/login?inviter=' + userId,
                imageUrl: '/images/share.jpg',
                success: function (res) {
                    if (res.errMsg == 'shareAppMessage:ok') {
                        // 转发成功
                        app.fetch({
                            url: '/account/user/share'
                        })
                            .then((response) => { })
                    }
                },
                fail: function (res) {
                    if (res.errMsg == 'shareAppMessage:fail cancel') {
                        // 用户取消
                    } else if (res.errMsg == 'shareAppMessage:fail') {
                        // 转发失败
                    }
                },
                complete: function () {

                }
            }
        } else {
            return {
                title: '闪餐',
                path: '/pages/login/login',
                imageUrl: '/images/share.jpg'
            }
        }
    }
}

const mapStateToPage = state => ({
    userInfo: state.userInfo,
    recommendInfo: state.recommendInfo
})

Page(connect(mapStateToPage)(pageConfig))
