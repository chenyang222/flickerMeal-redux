import regeneratorRuntime from '../../../libs/runtime';
import { connect } from '../../../libs/wechat-weapp-redux';
import { addBuyCar } from '../../../redux/index';
const app = getApp();

const pageConfig = {
    data: {
        imgdata: app.globalData.imgdata,
        foodInfo: {}
    },
    async onLoad(options) {
        this.setData({ 
            foodInfo: JSON.parse(options.item),
            cpType: options.type
        })
    },
    //添加到购物车
    addBuyCar: function (e) {
        const aisleId = e.currentTarget.dataset.aisleid;
        const productId = e.currentTarget.dataset.productid;
        const macId = this.data.machineInfo.id;
        const data = {
            aisleId: aisleId,
            productId: productId,
            macId: macId
        }
        addBuyCar(data)
    }
}

const mapStateToPage = state => ({
    recomtcList: state.recomtcList,
    machineInfo: state.machineInfo
})

Page(connect(mapStateToPage)(pageConfig))
