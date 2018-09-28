import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getInvoiceList, selectInvoice, deleteInvoice } from '../../../redux/index';
const app = getApp();


const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata,
    selectInvoice: 0,
    orderNo: ''
  },
  async onLoad(options) {
    this.setData({
      orderNo: options.orderNo
    })
  },
  async onShow() {
    // 获取发票信息列表
    getInvoiceList();
   },
  // 新增发票
  toAddInvoice: function () {
    wx.navigateTo({
      url: "/pages/order/applyEleInvoice/applyEleInvoice",
    })
  },
  deleteInvoice: function (e) {
    const id = e.currentTarget.dataset.id;
    const data = {
      id: id
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除此发票信息吗？',
      success: async (res) => {
        if (res.confirm) {
          await deleteInvoice(data)
          getInvoiceList();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  selectInvoice: function (e) {
    const item = e.currentTarget.dataset.item;
    let data = {};
    data.orderNo = this.data.orderNo;
    data.invoiceFlag = item.flag;
    data.invoiceEmail = item.email;
    data.invoiceTitle = item.title;
    if (item.flag == 1) {
      data.invoiceIRD = item.ird;
    }
    wx.showModal({
      title: '提示',
      content: '确定要以此发票信息来申请发票吗？',
      success: (res) => {
        if (res.confirm) {
          selectInvoice(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


}

const mapStateToPage = state => ({
  invoiceList: state.invoiceList
})

Page(connect(mapStateToPage)(pageConfig))
