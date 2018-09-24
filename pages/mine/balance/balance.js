import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { payByWechat } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        payitem: 20,
        inputValue: '',
        tabArr: {
            curHdIndex: 0,
            curBdIndex: 0
        }
    },
    async onLoad(options) { },
    async onShow() {},
    tabFun: function (e) {
        //获取触发事件组件的dataset属性  
        var _datasetId = e.target.dataset.id;
        this.setData({
            inputValue: ''
        })
        if (_datasetId == 0) {
            this.setData({
                payitem: '20'
            });
        } else if (_datasetId == 1) {
            this.setData({
                payitem: '30'
            });
        } else if (_datasetId == 2) {
            this.setData({
                payitem: '50'
            });
        } else if (_datasetId == 3) {
            this.setData({
                payitem: '100'
            });
        } else if (_datasetId == 4) {
            this.setData({
                payitem: '150'
            });
        } else {
            this.setData({
                payitem: '200'
            });
        }
        var _obj = {};
        _obj.curHdIndex = _datasetId;
        _obj.curBdIndex = _datasetId;
        this.setData({
            tabArr: _obj
        });
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    pay: function () {
        const price = this.data.inputValue ? this.data.inputValue : this.data.payitem;
        const data = {
            totalFee: price
        }
        payByWechat(data)
    }
}

const mapStateToPage = state => ({})

Page(connect(mapStateToPage)(pageConfig))
