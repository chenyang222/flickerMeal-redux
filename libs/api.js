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
        // 获取活动列表
        getActivitys () {
            return fetch({
                url: '/operate/activitys/list'
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
        // 获取推荐套餐
        getRecomtc ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodmachine/findProductByMacIdAndProductCatId',
                data: data
            })
        },
        // 获取机器餐品大类侧边栏
        getMachineLeftNav ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodmachine/findProductCatByMacId',
                data: data
            })
        },
        // 获取今日购
        getTodayBuy ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodmachine/findProductByMacIdAndProductCatId',
                data: data
            })
        },
        // 获取预定餐品列表
        getWeekBuy ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodmachine/findProductByMacIdAndAdTime',
                data: data
            })
        },
        // 获取当前机器评价
        getMachineEva ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodordercomment/findByMacId',
                data: data
            })
        },
        // 获取热门搜索
        getHotSearch () {
            return fetch({
                url: '/fastfood/foodmachine/keyword/rank/top/10'
            })
        },
        // 获取搜索结果
        getSearchMachine ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodmachine/keyword/search',
                data: data
            })
        },
        // 添加到购物车
        addBuyCar ({ data = {} }) {
            return fetch({
                url: '/fastfood/shoppingcart/add',
                data: data
            })
        },
        // 创建预定订单
        indexCreateOrder ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodorder/createOrder',
                data: data,
                method: 'post',
                requestBody: true
            })
        }
    },
    // 获取我的信息
    getUserInfo () { 
        return fetch({
            url: '/account/user/info'
        })
    },
    shopCar: {
        // 购物车列表
        getShopCar ({ data = {} }) {
            return fetch({
                url: '/fastfood/shoppingcart/list',
                data: data
            })
        },
        // 设置购物车餐品数量
        setProductNumber ({ data = {} }) {
            return fetch({
                url: '/fastfood/shoppingcart/set',
                data: data
            })
        },
        // 删除购物车餐品
        deleteProduct ({ data = {} }) {
            return fetch({
                url: '/fastfood/shoppingcart/remove',
                data: data
            })
        },
        // 清空购物车餐品
        clearProduct () {
            return fetch({
                url: '/fastfood/shoppingcart/clear'
            })
        },
        // 购物车生成订单
        createOrderByShopCar ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodorder/createOrderByShoppingCart',
                data: data,
                method: 'post',
                requestBody: true
            })
        },
    },
    order: {
        // 根据订单号获取订单信息
        getOrderInfo ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodorder/findOrderInfoByUser',
                data: data
            })
        },
        // 获取订单可用优惠券
        getOrderCoupon ({ data = {} }) {
            return fetch({
                url: '/operate/coupon/findByUserId',
                method: 'post',
                data: data
            })
        },
        // 获取订单可用活动
        getOrderActivitys ({ data = {} }) {
            return fetch({
                url: '/fastfood/foodorder/calCheckTotalFeeByOrderNo',
                data: data
            })
        },
        // 获取订单列表
        getOrders () {
            return fetch({
                url: '/fastfood/foodorder/findOrderByUser'
            })
        },
        // 订单余额支付
        getPayByBalance (data) {
            return fetch({
                url: '/fastfood/foodorder/balancePayForOrder',
                data: data
            })
        },
        // 订单余额支付
        getPayByWechat (data) {
            return fetch({
                url: '/fastfood/foodorder/wxAppPayForOrder',
                data: data
            })
        },
        // 取冷餐还是热餐
        getHotOrCold (data) {
            return fetch({
                url: '/fastfood/foodorder/modifyWarmFlag',
                data: data
            })
        },
        // 添加发票
        applyEleInvoice (data) {
            return fetch({
                url: '/account/userinvoice/save',
                data: data
            })
        },
        // 获取发票列表
        getInvoiceList () {
            return fetch({
                url: '/account/userinvoice/findByUserId'
            })
        },
        // 申请发票信息
        selectInvoice (data) {
            return fetch({
                url: '/fastfood/foodorder/addInvoice',
                data: data
            })
        },
        // 删除发票
        deleteInvoice (data) {
            console.info(data)
            return fetch({
                url: '/account/userinvoice/delete',
                data: data
            })
        }
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