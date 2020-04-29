let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [''],
    cardUrl: API.cvs_img + '/20200427/fc732e50c8952077a2df437bdc8b4581.png',
    activitiesList: [],
    beTotal: '',
    total: '',
    api: API.img_host,
    pageNum: 1,
    pageSize: 10
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  conceCach: function () {
    wx.navigateTo({
      url: '../cachIn/cachIn',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryAccount();
  },
  queryAccount: function () {
    let self = this;
    let {pageNum,pageSize} = this.data;
    http.get('/activities/queryAccount', {pageNum,pageSize}).then(function (res) {
      console.log(res)
      if (res.status == 200) {
        self.setData({
          activitiesList: res.message.activitiesList,
          beTotal: res.message.beTotal,
          total: res.message.total
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})