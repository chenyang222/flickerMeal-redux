//index.js
//获取应用实例
import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { addAddress } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        items: [
            { name: 'sir', value: '先生' },
            { name: 'ms', value: '女士', },
        ],
        consignee: '', // 收货人
        sex: '', // 性别
        mobile: '', // 手机号
        areaCode: ['选择收货地址'],
        address: '', // 详细地址
        isDefault: '', // 是否是默认地址
        itemdef: [
            { name: 'sir', value: '设为默认地址' }
        ]
    },
    async onLoad(options) {},
    //姓名
    bindReplaceInput: function (e) {
        this.setData({
            consignee: e.detail.value,
        })
    },
    //选择性别
    radioChange: function (e) {
        this.setData({
            sex: e.detail.value,
        })
    },
    //手机号
    bindPhoneInput: function (e) {
        this.setData({
            mobile: e.detail.value,
        })
    },
    //省市联动
    bindRegionChange: function (e) {
        this.setData({
            areaCode: e.detail.value
        })
    },
    //详细地址
    houseNumber: function (e) {
        this.setData({
            address: e.detail.value,
        })
    },
    //选择默认地址
    radioDefault: function (e) {
        this.setData({
            isDefault: e.detail.value,
        })
    },
    submitbtn: function () {
        // 验证姓名
        if (this.data.consignee == '') {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'none',
                mask: true,
                duration: 1500
            })
            return;
        }
        // 验证是否选择性别
        if (this.data.sex == '') {
            wx.showToast({
                title: '请选择性别',
                icon: 'none',
                mask: true,
                duration: 1500
            })
            return
        }
        // 验证是否填写手机号
        if (this.data.mobile == '') {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none',
                mask: true,
                duration: 1500
            })
            return;
        }
        // 验证是否选择地址
        if (this.data.areaCode[0] == '' || this.data.areaCode[0] == undefined || this.data.areaCode[1] == '' || this.data.areaCode[1] == undefined || this.data.areaCode[2] == '' || this.data.areaCode[2] == undefined) {
            wx.showToast({
                title: '收货地址不能为空',
                icon: 'none',
                mask: true,
                duration: 1500
            })
            return;
        }
        // 验证是否填写详细地址
        if (this.data.address == '') {
            wx.showToast({
                title: '详细地址不能为空',
                icon: 'none',
                mask: true,
                duration: 1500
            })
            return;
        }
        const data = {
            consignee: this.data.consignee,
            sex: this.data.sex,
            mobile: this.data.mobile,
            areaCode: this.data.areaCode.join(','),
            address: this.data.address,
            name: this.data.address,
            defaultFlag: this.data.isDefault == '' ? 1 : 0,
            fulladdress: this.data.areaCode + this.data.address,
            pos: ''
        }
        addAddress(data)
    }
}

const mapStateToPage = state => ({})

Page(connect(mapStateToPage)(pageConfig))
