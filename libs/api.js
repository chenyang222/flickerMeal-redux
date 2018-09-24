import { fetch } from '../utils/fetch';

const api = {
    // 根据定位信息获取机器列表
    getMachine ({ data = {} }) {
        return fetch({
            url: '/fastfood/foodmachine/findByAreaCode',
            data: data
        })
    },
    index: {
        // 获取banner
        getBanner ({ data = {} }) {
            return fetch({
                url: '/operate/adpos/get_advert_info',
                data: data
            })
        },
        // 获取首页优惠券
        getIndexCoupon ({ data = {} }) {
            return fetch({
                url: '/operate/coupon/findByMacId',
                data: data
            })
        },
        // 领取首页优惠券
        haveIndexCoupon ({ data = {} }) {
            return fetch({
                url: '/operate/coupon/getByCouponId',
                data: data
            })
        },
    },
    // 获取我的信息
    getUserInfo () { 
        return fetch({
            url: '/account/user/info'
        })
    },
    mine: {
        // 获取消息通知列表
        getNotify () { 
            return fetch({
                url: '/account/inform/list'
            })
        },
        // 获取地址信息
        getAddress () { 
            return fetch({
                url: '/account/address/list'
            })
        },
        // 删除地址
        deleteAddress ({ data = {} }) {
            return fetch({
                url: '/account/address/delete',
                data: data
            })
        },
        // 设置默认地址
        setDefaultAddress ({ data = {} }) {
            return fetch({
                url: '/account/address/update',
                method: 'post',
                data: data
            })
        },
        // 添加地址
        addAddress ({ data = {} }) {
            return fetch({
                url: '/account/address/save',
                method: 'post',
                data: data
            })
        },
        // 编辑地址
        editAddress ({ data = {} }) {
            return fetch({
                url: '/account/address/update',
                method: 'post',
                data: data
            })
        },
        // 微信充值
        payByWechat ({ data = {} }) {
            return fetch({
                url: '/recharge/wxpay/wechatapp/payment',
                data: data
            })
        },
        // 获取优惠券列表
        getCoupon () {
            return fetch({
                url: '/operate/coupon/findByUserId',
                method: 'post',
                data: {
                    use: 0,
                    flag: 0
                }
            })
        },
        // 获取推荐信息
        getRecommend () {
            return fetch({
                url: '/account/log/inviteInfo'
            })
        },
        // 提交反馈
        submitRecommend ({ data = {} }) {
            return fetch({
                url: '/account/userfeedback/save',
                data: data
            })
        },
        // 提交加盟信息
        submitJoinInfo ({ data = {} }) {
            return fetch({
                url: '/fastfood/joinpartner/save',
                data: data
            })
        },
        // 获取奖品列表
        getLottery () {
            return fetch({
                url: '/operate/prize/findPrizeByGroup',
                data: {
                    group: 'WX_APP_DZP'
                }
            })
        },
        // 获取中奖纪录
        getRecord () {
            return fetch({
                url: '/operate/prize/findLogByUserId',
                data: {
                    status: '0'
                }
            })
        },
        // 抽奖
        lotteryDraw () {
            return fetch({
                url: '/operate/prize/draw',
                data: {
                    group: 'WX_APP_DZP'
                }
            })
        }
    }
}

module.exports = {
    api: api
}