import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getUserInfo, getLottery, getRecord, lotteryDraw } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        animationData: {},
        clickBtnRotate: 0,
        start: false
    },
    async onLoad(options) {
        var animationRotate = wx.createAnimation({
            transformOrigin: "50% 61%",
            duration: 7000,
            timingFunction: "ease",
            delay: 0
        })
        this.animationRotate = animationRotate;
    },
    async onShow() {
        // 获取用户积分
        getUserInfo();
        // 获取所有奖品列表
        getLottery();
        // 获取中奖纪录
        getRecord();
    },
    btnAnimate: function () {
        if (this.data.start) {
            return
        }
        this.setData({
            start: true
        })
        getUserInfo();
        let that = this;
        const lotteryList = this.data.lotteryList;
        lotteryDraw()
            .then((response) => {
                let num;
                for (let i = 0; i < lotteryList.length; i++) {
                    if (response.prizeId == lotteryList[i].id) {
                        num = i;
                    }
                }
                const newRotate = Math.ceil(that.data.clickBtnRotate / 360) * 360 + 3600 + 60 + (num + 1) * 60;
                that.animationRotate.rotate(newRotate).step();
                that.setData({
                    clickBtnRotate: newRotate,
                    animationData: that.animationRotate.export()
                })
                setTimeout(function () {
                    wx.showToast({
                        title: '恭喜您获得了' + response.name,
                        icon: 'none',
                        duration: 2000,
                        mask: true
                    })
                    setTimeout(function () {
                        getRecord();
                        that.setData({
                            start: false
                        })
                    }, 1500)
                }, 7000)
            })
    }
}

const mapStateToPage = state => ({
    userInfo: state.userInfo,
    lotteryList: state.lotteryList,
    recordList: state.recordList
})

Page(connect(mapStateToPage)(pageConfig))
