// gamePages/pages/test/test.js

let util = require('../../utils/util');
let http = require('../../utils/request');
let API = require('../../utils/config.js');
let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomIdArr: [],
    roomId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let roomId = [1] // 房间号
    let customParams = {
      path: 'pages/index/index',
      pid: 1
    }
    this.setData({
      roomId,
      customParams: encodeURIComponent(JSON.stringify(customParams))
    })
    let token = wx.getStorageSync('token');
    // wx.request({
    //   // 开发者服务器, 解密报文的接口
    //   url: `http://api.weixin.qq.com/wxa/business/getliveinfo?access_token=` + token,
    //   method: 'POST',
    //   header: {
    //     'Content-type': 'application/x-www-form-urlencoded',
    //     'token': token,
    //   },
    //   data: {
    //     start: 0,
    //     limit: 10
    //   },
    //   success: function (data) {
    //     console.log(data)
    //   },
    //   fail: function (fail) {
    //     console.log(fail)
    //   }
    // })

  },
  todetail: function (res) {

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