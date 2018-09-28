import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { bMapTransQQMap } from '../../../utils/util';
const bmap = require('../../../utils/bmap-wx.min');


let wxMarkerData = [];

const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        longitude: '',
        latitude: '',
        markers: [],
        rgcData: {}
    },
    async onLoad(options) {
        this.setData({
            longitude: options.lng,
            latitude: options.lat
        })
        const location = bMapTransQQMap(options.lng, options.lat);

        const markers = [{
            longitude: location.lng,
            latitude: location.lat,
            iconPath: '/images/machineMapIcon.png'
        }]

        this.setData({
            markers: markers
        })

        var that = this; 
        // 新建百度地图对象 
        var BMap = new bmap.BMapWX({ 
            ak: 'SXloT6qpxpozRkGG7XcUu6104fzus5X9'
        });
        var fail = function(data) { 
            console.log(data)
        }; 
        var success = function(data) { 
            wxMarkerData = data.wxMarkerData; 
            that.setData({
                rgcData: { 
                    address: '地址：' + wxMarkerData[0].address + '\n',
                    desc: '描述：' + wxMarkerData[0].desc + '\n',
                    business: '商圈：' + wxMarkerData[0].business
                } 
            });
        } 
        // 发起regeocoding检索请求
        BMap.regeocoding({
            location: that.data.latitude + ',' + that.data.longitude,
            fail: fail, 
            success: success
        })
    }
}

const mapStateToPage = state => ({})

Page(connect(mapStateToPage)(pageConfig))
