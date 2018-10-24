import regeneratorRuntime from '../../libs/runtime';
import { connect } from '../../libs/wechat-weapp-redux';
import { getShopCar, setProductNumber, deleteProduct, clearProduct, createOrderByShopCar } from '../../redux/index';
const app = getApp();

const pageConfig = {
  data: {
    imgdata: app.globalData.imgdata
  },
  async onLoad() {},
  async onShow() {
    const macId = this.data.machineInfo.id;
    // 购物车列表
    getShopCar(macId)
  },
  async reduce (e) {
    if (e.currentTarget.dataset.buynumber <= 1){
      return;
    }
    let num = e.currentTarget.dataset.buynumber - 1;
    const data = {
      cartId: e.currentTarget.dataset.cartid,
      checkStatus: 1,
      buyNumber: num
    }
    await setProductNumber(data);
    const macId = this.data.machineInfo.id;
    // 购物车列表
    getShopCar(macId)
  },
  async plus (e) {
    let num = e.currentTarget.dataset.buynumber + 1;
    const data = {
      cartId: e.currentTarget.dataset.cartid,
      checkStatus: 1,
      buyNumber: num
    }
    await setProductNumber(data);
    const macId = this.data.machineInfo.id;
    // 购物车列表
    getShopCar(macId)
  },
  touchstart: function (e) {
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    })
  },
  touchmove: function (e) {
    let index = e.currentTarget.dataset.index,//当前索引
      startX = this.data.startX,//开始X坐标
      startY = this.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    this.data.shopCarList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    // //更新数据
    this.setData({
      shopCarList: this.data.shopCarList
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },
  // 单个删除
  del (e) {
    const data = {
      cartId: e.target.dataset.cartid
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: async (res) => {
        if (res.confirm) {
          await deleteProduct(data);
          const macId = this.data.machineInfo.id;
          // 购物车列表
          getShopCar(macId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除所所有
  delAll:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: async (res) => {
        if (res.confirm) {
          await clearProduct();
          const macId = this.data.machineInfo.id;
          // 购物车列表
          getShopCar(macId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 生成订单
  async toPay () {
    const macId = this.data.machineInfo.id;
    let childs = [];
    for (let i = 0; i < this.data.shopCarList.length; i++) {
      let obj = {};
      obj.cartId = this.data.shopCarList[i].cartId;
      obj.macId = macId;
      obj.buyNumber = this.data.shopCarList[i].buyNumber;
      childs.push(obj);
    }
    const data = {
      macId: macId,
      body: JSON.stringify(childs)
    }
    const response = await createOrderByShopCar(data);
    const orderNo = response.orderNo;
    wx.navigateTo({
      url: "/pages/order/payment/payment?orderNo=" + orderNo,
    })
  }
}

const mapStateToPage = state => ({
  shopCarList: state.shopCarList,
  machineInfo: state.machineInfo,
  computeShopcar: state.computeShopcar,
  shopCarNumber: state.shopCarNumber
})


Page(connect(mapStateToPage)(pageConfig))
