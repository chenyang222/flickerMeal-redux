import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { submitJoinInfo } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        name: '',
        position: '',
        phone: '',
        company: '',
        address: ''
    },
    async onLoad(options) { },
    inputName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    inputPhone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    inputPosition: function (e) {
        this.setData({
            position: e.detail.value
        })
    },
    inputCompany: function (e) {
        this.setData({
            company: e.detail.value
        })
    },
    inputAddress: function (e) {
        this.setData({
            address: e.detail.value
        })
    },
    joinBtn: function () {
        const data = {};
        data.position = this.data.position;
        data.name = this.data.name;
        data.phone = this.data.phone;
        data.company = this.data.company;
        data.address = this.data.address;
        // form拦截
        if (!data.position || !data.name || !data.phone || !data.company || !data.address) {
          wx.showToast({
            title: '请您将加盟信息填写完整',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        submitJoinInfo(data)
    }
}

const mapStateToPage = state => ({})

Page(connect(mapStateToPage)(pageConfig))
