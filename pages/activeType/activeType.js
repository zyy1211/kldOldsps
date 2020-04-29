let http = require('../../utils/request');
let API = require('../../utils/config.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    img_host: API.img_host,
    allBtn:{id:'-1',sportName:'全部'},
    isIndex: '',
  },
  chooseType: function (e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // console.log(this.data.isIndex)
    if (this.data.isIndex == 'index') {
      prevPage.setData({
        slt_type: e.currentTarget.dataset.id,
      })
      prevPage.choiseType();
    }else if (this.data.isIndex == 'game') {
      prevPage.setData({
        competitionTypeObj: e.currentTarget.dataset.id,
      })
      console.log(e.currentTarget.dataset.id)
      console.log('game')
    }else {
     
      prevPage.setData({
        type: e.currentTarget.dataset.id,
      })
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  init: function () {
    let self = this;
    http.get('/sports/types').then(function (res) {
      console.log(res);
      if (res.data.message != null) {
        self.setData({
          typeList: res.data.message.types
        })
        wx.setStorageSync('activityType',JSON.stringify(res.data.message.types));
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    if (options.type ) {
      this.setData({
        isIndex: options.type
      })
    }
    let typeList = wx.getStorageSync('activityType');
    if(typeList){
      self.setData({
        typeList: JSON.parse(typeList)
      })
      return;
    }
    this.init();
  },


})