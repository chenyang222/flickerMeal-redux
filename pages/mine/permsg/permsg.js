import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { getUserInfo, fixUserInfo } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        tempFilePaths: '',
        flag: true,//昵称遮罩
        searchinput: '',
        actionSheetHidden: true,
        nickname:'',//昵称框
        actionSheetItems: [
          { bindtap: 'Menu1', txt: '男' },
          { bindtap: 'Menu2', txt: '女' }
        ],
        menu: '',
        productInfo: {}
    },
    async onLoad(options) { },
    async onShow() {
        // 获取用户信息
        getUserInfo();
    },
    chooseimage: function () {
      var that = this;
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              that.chooseWxImage('album')
            } else if (res.tapIndex == 1) {
              that.chooseWxImage('camera')
            }
          }
        }
      })
    },
    chooseWxImage: function (type) {
      var that = this;
      const token = wx.getStorageSync("token");
      wx.chooseImage({
        count: 1,  //最多可以选择的图片总数
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          var tempFilePaths = res.tempFilePaths;
          wx.showToast({
            icon: "loading",
            title: "正在上传"
          })
          console.log(tempFilePaths[0])
          wx.uploadFile({
            url: 'https://api.i-shancan.com/account/user/upload/headimgurl',
            filePath: tempFilePaths[0],
            name: 'file',
            header: { 
              "Content-Type": "multipart/form-data",
              "Authorization": token
            },
            success: function (res) {
              var data = res.data;
              console.info(JSON.parse(data))
              if (JSON.parse(data).errcode == 0) {
                wx.showToast({
                  title: '头像上传成功',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
                setTimeout(() => {
                    getUserInfo();
                    wx.hideToast();
                }, 1500)
              } else {
                wx.showToast({
                  title: JSON.parse(data).errmsg,
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
            },
            fail: function () {
              wx.hideToast();
            }
          })
        }
      });  
    },
    bindReplaceInput: function (e) {
      var that = this;
      that.setData({
        nickname: e.detail.value,
      })
    },
    nichshow:function(){
      this.setData({ flag: false }) 
    },
    nichhide: function () {
      this.setData({ flag: true })
    },
    async nickconfirm () {
      var that = this;
      if (that.data.nickname) {
        const data = {
          nickname: that.data.nickname
        }
        await fixUserInfo(data);
        getUserInfo();
        that.setData({ 
          flag: true,
          nickname:'',
          searchinput: ''
        })
      }else{
        wx.showToast({
          title: '昵称不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  async bindMenu1 (e) {
    var that = this;
    that.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    const data = {
      sex: 1
    }
    await fixUserInfo(data);
    getUserInfo();
  },
  async bindMenu2 (e) {
    var that = this;
    that.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    const data = {
      sex: 2
    }
    await fixUserInfo(data);
    getUserInfo();
  },  
}

const mapStateToPage = state => ({
    userInfo: state.userInfo
})

Page(connect(mapStateToPage)(pageConfig))
