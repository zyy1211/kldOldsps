// pages/personal/personal.js
let http = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    userInfo:{}
  },
  editInfo:function(){
  //   wx.navigateTo({
  //     url: '../selfInfo/selfInfo',
  // })
},
getUserInfo: function (id) {
  let self = this;
  http.get('/member/queryOne', {
    uid: id
  }).then(function (res) {
    console.log(res);
    self.setData({
      userInfo: res.data.message,
      MemberInfo:res.data.message.MemberInfo,
      MemberBasicInfo:res.data.message.MemberBasicInfo
    })
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo(options.id);
  },
})