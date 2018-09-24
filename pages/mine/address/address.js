import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getAddress, deleteAddress, setDefaultAddress } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        startX: 0, //开始坐标
        startY: 0
    },
    async onLoad(options) { },
    async onShow() {
        // 获取用户地址列表
        getAddress();
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.addressList.forEach(function (v, i) {
            if (v.isTouchMove)//只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            addressList: this.data.addressList
        })
    },
    //滑动事件处理
    touchmove: function (e) {
        var that = this,
            index = e.currentTarget.dataset.index,//当前索引
            startX = that.data.startX,//开始X坐标
            startY = that.data.startY,//开始Y坐标
            touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
            //获取滑动角度
            angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
        that.data.addressList.forEach(function (v, i) {
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
        //更新数据
        that.setData({
            addressList: that.data.addressList
        })
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function (start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    // 删除地址
    deleteAddress: function (e) {
        const id = e.target.id;
        deleteAddress(id)
    },
    // 设置默认地址
    setDefaultAddress: function (e) {
        let data = e.target.dataset.item;
        data.defaultFlag = 0;
        setDefaultAddress(data)
    },
    // 编辑地址
    editAddress: function (e) {
        const item = JSON.stringify(e.target.dataset.item);
        wx.navigateTo({
            url: '/pages/mine/editAddress/editAddress?item=' + item
        })
    }
}

const mapStateToPage = state => ({
    addressList: state.addressList
})

Page(connect(mapStateToPage)(pageConfig))
