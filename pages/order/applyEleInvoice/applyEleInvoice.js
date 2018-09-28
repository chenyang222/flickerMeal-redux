import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { applyEleInvoice } from '../../../redux/index';
const app = getApp();


const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata,
    invoiceType: 1,
    rise: '',
    duty: '',
    email: ''
  },
  async onLoad(options) {

  },
  async onShow() { },
  // 选择类型
  selectType: function (e) {
    const sType = e.target.dataset.stype;
    this.setData({
      invoiceType: sType
    })
  },
  // 输入抬头
  inputRise: function (e) {
    this.setData({
      rise: e.detail.value
    })
  },
  // 输入税号
  inputDuty: function (e) {
    this.setData({
      duty: e.detail.value
    })
  },
  // 输入邮箱
  inputEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  saveEleInvoice: function () {
    const flag = this.data.invoiceType;
    const rise = this.data.rise;
    const email = this.data.email;
    let data = {};
    data.flag = flag;
    data.title = rise;
    data.email = email;
    if (flag == 1) {
      data.ird = this.data.duty;
      // form拦截
      if (!data.flag || !data.title || !data.email || !data.ird) {
        wx.showToast({
          title: '请您将发票信息填写完整',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    } else {
      // form拦截
      if (!data.flag || !data.title || !data.email) {
        wx.showToast({
          title: '请您将发票信息填写完整',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    }
    applyEleInvoice(data)
  },
}

const mapStateToPage = state => ({})

Page(connect(mapStateToPage)(pageConfig))
