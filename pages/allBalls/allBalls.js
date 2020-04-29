// pages/allBalls/index.js
// pages/venuesList/venuesList.js
let util = require('../../utils/util');
let Api = require('../../utils/config');
let http = require('../../utils/request.js');
let App = getApp();

Page({
  data: {
    apiImg:Api.img_host,
    typeList: []
  },

  //跳转到预约中心, 选择运动项目
  toReserveCenter: function (e) {
    let key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../venuesList/venuesList?sportType='+key,
    })
  },

  onLoad: function (options) {
    this.getTypeList();
  },
    // 获取下拉框数据
    getTypeList: function () {
      let self = this;
      http.get('/stadium/index/sportType').then(function (res) {
        // console.log(res);
        if (res.data.message != null) {
          let datas = res.data.message;
          self.setData({
            typeList: datas,
          });
        }
      })
    },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})