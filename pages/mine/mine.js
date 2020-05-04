// pages/mine/mine.js
let app = getApp();
let http = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */

  data: {
    nickName: "",
    userLogoUrl: 0,
    userInfo: '',
    isLogin: app.globalData.isLogin,
    phoneNumber: '13819129737',
    beTotal:0,
  },

  initPage: function () {
    let self = this;
    if (app.globalData.isLogin) {
      let userInfo = app.getUserInfo();
      // console.log(userInfo)
      self.setData({
        userInfo: userInfo,
        userLogoUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
      })
      self.queryAccount();
    }
  },

  navigate: function (e) {
    let isLogin = this.data.isLogin
    if (!isLogin) {
      wx.navigateTo({
        url: '../userInfo/userInfo'
      })
    } else {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage();
  },

  queryAccount: function () {
    let self = this;
    http.get('/activities/queryAccount', '').then(function (req) {
      let res = req.data;
      console.log(res)
      if (res.status == 200) {
        self.setData({
          beTotal: res.message.beTotal
        })
      }
    })
  },

  onShow: function () {
    let userInfo = this.data.userInfo;
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (app.isNull(userInfo)) {
      this.initPage();
    }

  },
  makeCall: function () {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.phoneNumber
    })
  },
  settledIn: function () {
    app.getAuth(function (res, msg) {
      console.log(res, msg);
      if (res != 1) {
        wx.navigateTo({
          url: '../personalAuthentication/personalAuthentication?status=' + res,
        })
      } else {
        wx.navigateTo({
          url: '../settledIn/settledIn',
        })
      }

    });
  },


  // toSignin:function(){
  //   wx.navigateTo({
  //     url: '../signIn/signIn',
  //   })
  // },
  // toVote:function(){
  //   wx.navigateTo({
  //     url: '../vote/vote',
  //   })
  // }
})