import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
// import { getHotSearch } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        inputVal: '',
        searchListArr: [],//搜索历史
        isSearch: false
    },
    async onLoad(options) {},
    async onShow() {
        // 设置历史搜索
        this.getSearchHistoryLatest();
        // // 获取热门搜索
        // getHotSearch();
    },
    //输入搜索内容
    bindKeyInput: function (e) {
        if (e.detail.value.trim().length > 0) {
            this.setData({
                inputVal: e.detail.value,
                isSearch: true
            });
        } else {
            this.setData({
                isSearch: false
            });
        }
    },
    //跳转首页
    goIndex: function (e) {
        wx.switchTab({
            url: '../index',
        })
    },
    //点击搜索时
    searchGoods: function () {
        const searchVal = this.data.inputVal.trim();
        let HistorySearchList = wx.getStorageSync('HistorySearchList') ? wx.getStorageSync('HistorySearchList') : [];
        if (searchVal) {
            let isSetin = true;
            for (let i = 0; i < HistorySearchList.length; i++) {
                if (searchVal == HistorySearchList[i]) {
                    isSetin = false;
                }
            }
            if (isSetin) {
                HistorySearchList.unshift(searchVal);
                HistorySearchList = HistorySearchList.slice(0, 9);
                wx.setStorageSync('HistorySearchList', HistorySearchList);
            }
            wx.navigateTo({
                url: '../searchInfo/searchInfo?from=searchpage&name=' + searchVal,
            })
        } else {
            wx.showToast({
                title: '搜索内容为空',
                icon: 'none',
                duration: 1000,
                mask: true
            })
        }
    },
    //获取最近10条搜索记录
    getSearchHistoryLatest: function () {
        let HistorySearchList = wx.getStorageSync('HistorySearchList') ? wx.getStorageSync('HistorySearchList') : [];
        this.setData({
            searchListArr: HistorySearchList
        });
    },
    //清空历史搜索
    clearHistory: function () {
        let HistorySearchList = [];
        wx.setStorageSync('HistorySearchList', HistorySearchList);
        this.setData({ searchListArr: [] });
    },
    //点击搜索历史
    clickSearchHistory: function (e) {
        this.setData({
            inputVal: e.currentTarget.dataset.name,
            isSearch: true
        });
    },
    //点击热门历史
    clickHotSearch: function (e) {
        this.setData({
            inputVal: e.currentTarget.dataset.name,
            isSearch: true
        });
    }
}

const mapStateToPage = state => ({
    hotSearchList: state.hotSearchList
})

Page(connect(mapStateToPage)(pageConfig))
