import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getSearchMachine, setMachine } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        searchName: ''
    },
    async onLoad(options) {
        const searchName = options.name;
        this.setData({
          searchName: searchName
        })
        getSearchMachine(searchName);
    },
    async onShow() {

    },
    // 选中机器
    setMachine: function (e) {
        const item = e.currentTarget.dataset.item;
        item.id = item.macId;
        setMachine(item)
        wx.switchTab({
            url: '../index',
            success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();
            }
        })
    }
}

const mapStateToPage = state => ({
    searchMachineList: state.searchMachineList
})

Page(connect(mapStateToPage)(pageConfig))
