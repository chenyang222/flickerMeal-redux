import regeneratorRuntime from '../libs/runtime';
import { api } from '../libs/api';
import { createStore } from '../libs/redux';
import { formatTime } from '../utils/util';
import { city } from '../utils/cityCode';
const bmap = require('../utils/bmap-wx.min.js')


const timeFormat = ['-', '-', ' ', ':', ':', ' ']; // 时间转变格式

const GET_POSITIONINFO = 'GET_POSITIONINFO'; // 获取定位信息
const GET_MACHINE = 'GET_MACHINE'; // 获取机器列表
const BANNER_INDEX = 'BANNER_INDEX'; // 首页轮播banner
const GET_INDEXCOUPON = 'GET_INDEXCOUPON'; // 获取首页优惠券
const GET_USETIFO = 'GET_USETIFO'; // 获取用户信息
const GET_ADDRESS = 'GET_ADDRESS'; // 获取地址
const GET_NOTIFY = 'GET_NOTIFY'; // 获取消息通知
const GET_COUPON = 'GET_COUPON'; // 获取我的优惠券列表
const GET_RECOMMEND = 'GET_RECOMMEND'; // 获取推荐信息
const GET_LOTTERY = 'GET_LOTTERY'; // 获取所有奖品列表
const GET_RECORD = 'GET_RECORD'; // 获取中奖纪录

const initState = {
    bannerList: [],
    userInfo: {},
    addressList: [],
    notifyList: [],
    couponList: [],
    recommendInfo: {},
    lotteryList: [],
    recordList: [],
    positionInfo: {},
    machineList: [],
    indexAllCouponList: [],
    indexCouponList: [],

}

export const reducers = (state = initState, action) => {
    switch (action.type) {
        case BANNER_INDEX:
            return Object.assign({}, state, { bannerList: action.data });
        case GET_USETIFO:
            return Object.assign({}, state, { userInfo: action.data });
        case GET_ADDRESS:
            return Object.assign({}, state, { addressList: action.data.list });
        case GET_NOTIFY:
            return Object.assign({}, state, { notifyList: action.data });
        case GET_COUPON:
            return Object.assign({}, state, { couponList: action.data });
        case GET_RECOMMEND:
            return Object.assign({}, state, { recommendInfo: action.data });
        case GET_LOTTERY:
            return Object.assign({}, state, { lotteryList: action.data });
        case GET_RECORD:
            return Object.assign({}, state, { recordList: action.data });
        case GET_POSITIONINFO:
            return Object.assign({}, state, { positionInfo: action.data });
        case GET_MACHINE:
            return Object.assign({}, state, { machineList: action.data });
        case GET_INDEXCOUPON:
            return Object.assign({}, state, { indexCouponList: action.data.indexCouponList, indexAllCouponList: action.data.indexAllCouponList });
        default:
            return state;
    }
}

export const store = createStore(
    reducers
)

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() =>
    console.log(store.getState())
)
// 获取当前定位信息
export const getPosition = async () => {
    // 新建百度地图对象 
    const BMap = new bmap.BMapWX({
      ak: 'NPfvQSlaxLvtuBWm4YDVwecQNoTACuUY'
    });
    const fail = function () {
        store.dispatch({
            type: GET_POSITIONINFO,
            data: false
        })
    };
    const success = function (data) {
        let positionInfo = {};
        const posData = data.originalData.result;
        const location = posData.location;
        const currentCity = posData.formatted_address;
        let cityStrArr = [];
        cityStrArr.push(posData.addressComponent.province);
        cityStrArr.push(posData.addressComponent.city);
        cityStrArr.push(posData.addressComponent.district);
        const cityCodeJson = city;
        let areaCode = [];
        for (let i = 0; i < cityCodeJson.length; i++) {
          if (cityStrArr[0] == cityCodeJson[i].name) {
            areaCode.push(i);
            if (cityStrArr[0] == '北京市') {
              for (let j = 0; j < cityCodeJson[i].sub.length; j++) {
                if (cityStrArr[2] == cityCodeJson[i].sub[j].name) {
                  areaCode.push(j);
                }
              }
              areaCode.push(0);
            } else {
              for (let j = 0; j < cityCodeJson[i].sub.length; j++) {
                if (cityStrArr[1] == cityCodeJson[i].sub[j].name) {
                  areaCode.push(j);
                  for (let a = 0; a < cityCodeJson[i].sub[j].sub.length; a++) {
                    if (cityStrArr[2] == cityCodeJson[i].sub[j].sub[a].name) {
                      areaCode.push(a);
                    }
                  }
                }
              }
            }
          }
        }
        positionInfo.location = location;
        positionInfo.currentCity = currentCity;
        positionInfo.areaCode = areaCode.join(',');
        store.dispatch({
            type: GET_POSITIONINFO,
            data: positionInfo
        })
        wx.switchTab({
            url: '../index/index'
        });
    };
    // 发起POI检索请求 
    BMap.regeocoding({
        fail: fail,
        success: success
    });
}
// 获取可用机器
export const getMachine = async (areaCode) => {
    const response = await api.getMachine({
        data: {
            // areaCode: areaCode
            areaCode: '0,4,0'
        }
    })
    store.dispatch({
        type: GET_MACHINE,
        data: response
    })
}
// 获取banner
export const getBanner = async () => {
    const response = await api.index.getBanner({
      data: {
        advertCode: 20000001,
        advertType: 2
      }
    })
    store.dispatch({
      type: BANNER_INDEX,
      data: response
    })
}
// 获取首页优惠券
export const getIndexCoupon = async (macId) => {
    const response = await api.index.getIndexCoupon({
      data: {
        macId: macId
      }
    })
    const data = {
        indexCouponList: response.slice(0,3),
        indexAllCouponList: response
    }
    store.dispatch({
      type: GET_INDEXCOUPON,
      data: data
    })
}
// 领取首页优惠券
export const haveIndexCoupon = async (data) => {
    try {
        await api.index.haveIndexCoupon({
            data: data
        })
        wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1000
        })
    } catch (res) {
        console.info(res)
    }
}
// 获取userInfo
export const getUserInfo = async () => {
    const response = await api.getUserInfo()
    store.dispatch({
      type: GET_USETIFO,
      data: response
    })
}
// 获取用户地址列表
export const getAddress = async () => {
    const response = await api.mine.getAddress()
    store.dispatch({
      type: GET_ADDRESS,
      data: response
    })
}
// 获取消息通知
export const getNotify = async () => {
    const response = await api.mine.getNotify()
    store.dispatch({
      type: GET_NOTIFY,
      data: response
    })
}
// 删除地址
export const deleteAddress = async (id) => {
    try{
        await api.mine.deleteAddress({
            data: {
                id : id
            }
        })
        wx.showToast({
            title: '删除地址成功',
            mask: true,
            duration: 500
        });
        setTimeout(() => {
            getAddress()
        }, 500)
    } catch (res) {
        console.info(res)
    }
}
// 设置默认地址
export const setDefaultAddress = async (data) => {
    try{
        await api.mine.setDefaultAddress({
            data: data
        })
        wx.showToast({
            title: '设置默认地址成功',
            mask: true,
            duration: 500
        });
        setTimeout(() => {
            getAddress()
        }, 500)
    } catch (res) {
        console.info(res)
    }
}
// 添加地址
export const addAddress = async (data) => {
    try{
        await api.mine.addAddress({
            data: data
        })
        wx.showToast({
            title: '添加地址成功',
            mask: true,
            duration: 500
        });
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 500)
    } catch (res) {
        console.info(res)
    }
}
// 添加地址
export const editAddress = async (data) => {
    try{
        await api.mine.editAddress({
            data: data
        })
        wx.showToast({
            title: '修改地址成功',
            mask: true,
            duration: 500
        });
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 500)
    } catch (res) {
        console.info(res)
    }
}
// 微信充值
export const payByWechat = async (data) => {
    try{
        const response = await api.mine.payByWechat({
            data: data
        })
        wx.requestPayment({
            'timeStamp': response.timeStamp,
            'nonceStr': response.nonceStr,
            'package': response.package,
            'signType': response.signType,
            'paySign': response.paySign,
            'success': function (res) {
                wx.showToast({
                    title: '充值成功',
                    icon: 'none',
                    duration: 1000,
                    mask: true
                })
                setTimeout( ()=> {
                    wx.navigateBack({
                        delta: 1
                    })
                },1000)
            },
            'fail': function (res) {
                wx.showToast({
                    title: '充值失败',
                    icon: 'none',
                    duration: 1000,
                    mask: true
                })
            }
        })
    } catch (res) {
        console.info(res)
    }
}
// 获取我的优惠券列表
export const getCoupon = async () => {
    const response = await api.mine.getCoupon();
    let couponArr = response;
    for (let i = 0; i < couponArr.length; i++) {
        couponArr[i].startTime = formatTime(couponArr[i].createTime, timeFormat);
        const endTime = Number(couponArr[i].createTime) + (couponArr[i].period * 86400000);
        couponArr[i].endTime = formatTime(endTime, timeFormat);
    }
    store.dispatch({
      type: GET_COUPON,
      data: couponArr
    })
}
// 获取推荐信息
export const getRecommend = async () => {
    const response = await api.mine.getRecommend();
    store.dispatch({
      type: GET_RECOMMEND,
      data: response
    })
}
// 提交反馈
export const submitRecommend = async (data) => {
    try{
        await api.mine.submitRecommend({
            data: data
        })
        wx.showToast({
            title: '提交反馈成功',
            mask: true,
            duration: 1000
        });
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1000)
    } catch (res) {
        console.info(res)
    }
}
// 提交加盟信息
export const submitJoinInfo = async (data) => {
    try{
        await api.mine.submitJoinInfo({
            data: data
        })
        wx.showToast({
            title: '提交加盟信息成功',
            mask: true,
            duration: 1000
        });
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1000)
    } catch (res) {
        console.info(res)
    }
}
// 获取奖品列表
export const getLottery = async () => {
    const response = await api.mine.getLottery();
    store.dispatch({
      type: GET_LOTTERY,
      data: response
    })
}
// 获取中奖纪录
export const getRecord = async () => {
    const response = await api.mine.getRecord();
    let recordList = response;
    for (let i = 0; i < recordList.length; i++) {
      recordList[i].createTime = formatTime(recordList[i].createTime, timeFormat);
    }    
    store.dispatch({
      type: GET_RECORD,
      data: recordList
    })
}
// 点击抽奖
export const lotteryDraw = () => {
    return api.mine.lotteryDraw();
}
