// pages/signupList/signupList.js
let http = require('../../utils/request');
let API = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signupList: [],
    self: true,
    activityId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      activityId: options.activityId,
      self:options.self,
      signupLength:options.signupLength
    })
    this.initData();
  },
  initData: function () {
    let self = this;
    http.get('/activities/applied', {
      activityId: self.data.activityId
    }).then(function (res) {
      if(res.data.status != 200){
        return;
      }
      if(res.data.message != null){
        self.setData({
          signupList:res.data.message
        })
      }
    })
  },
  makeCall: function (e) {
    let self = this;
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

})