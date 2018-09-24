//index.js
//获取应用实例
import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { editAddress } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        items: [
            { name: 'sir', value: '先生' },
            { name: 'ms', value: '女士', },
        ],
        editid: '', // 地址id
        editConsignee: '', // 收货人
        sex: '', // 性别
        editphone: '', // 电话编辑
        editAddress: '', // 编辑详细地址
        areaCode: ['选择收货地址'],
        isDefault: '', // 是否是默认地址
        itemdef: [
            { name: 'sir', value: '设为默认地址' }
        ]
    },
    async onLoad(options) {
        const item = JSON.parse(options.item);
        const addlist = item.areaCode.split(',')
        this.setData({
            editid: item.id,
            editConsignee: item.consignee,//回显联系人姓名
            sex: item.sex,
            editphone: item.mobile,//回显联系人手机号
            areaCode: [addlist[0], addlist[1], addlist[2]],
            editAddress: item.address,
            isdefault: item.defaultFlag
        })

        if (item.sex == 1) {
            this.setData({
                items: [
                    { name: 'sir', value: '先生', checked: 'true' },
                    { name: 'ms', value: '女士', },
                ]
            })
        } else {
            this.setData({
                items: [
                    { name: 'sir', value: '先生', },
                    { name: 'ms', value: '女士', checked: 'true' },
                ]
            })
        }

        if (item.defaultFlag == 0) {
            this.setData({
                itemdef: [
                    { name: 'sir', value: '设为默认地址', checked: 'true' }
                ]
            })
        }
    },
    //姓名
    bindReplaceInput: function (e) {
        this.setData({
            editname: e.detail.value,
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
            editphone: e.detail.value,
        })
    },
    //省市联动
    bindRegionChange: function (e) {
        this.setData({
            areaCode: e.detail.value
        })
    },
    //门牌号
    addressChange: function (e) {
        this.setData({
            editAddress: e.detail.value,
        })
    },
    //选择默认地址
    radioDefault: function (e) {
        this.setData({
            isdefault: e.detail.value,
        })
    },    
    submitbtn: function () {
        // 验证姓名
        if (this.data.editConsignee == '') {
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
        if (this.data.editphone == '') {
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
        if (this.data.editAddress == '') {
            wx.showToast({
                title: '详细地址不能为空',
                icon: 'none',
                mask: true,
                duration: 1500
            })
            return;
        }
        const data = {
            id: this.data.editid,
            consignee: this.data.editConsignee,
            sex: this.data.sex,
            mobile: this.data.editphone,
            areaCode: this.data.areaCode.join(','),
            address: this.data.editAddress,
            name: this.data.editAddress,
            defaultFlag: this.data.isdefault == '' ? 1 : 0,
            pos: ''
        }
        editAddress(data)
    }
}

const mapStateToPage = state => ({})

Page(connect(mapStateToPage)(pageConfig))
