import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { submitRecommend } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        value: ''
    },
    async onLoad(options) { },
    bindValue: function (e) {
        this.setData({
            value: e.detail.value
        })
    },
    submitbtn: function () {
        if (this.data.value == '' || this.data.value == undefined) {
            wx.showToast({
                title: '反馈内容不能为空',
                icon: 'none',
                mask: true,
                duration: 2000
            });
            return;
        }
        const data = {
            content: this.data.value
        }
        submitRecommend(data)
    }
}

const mapStateToPage = state => ({})

Page(connect(mapStateToPage)(pageConfig))
