// gamePages/pages/component/addTag/addTag.js
let util = require('../../../../utils/util');
let http = require('../../../../utils/request');
let API = require('../../../../utils/config.js');
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information:'',
    type:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  submit:function(){
    let self = this;
    let {information,type} = this.data;
    if(App.isNull(information) || App.isNull(type)){
      return wx.showToast({
        title: '标签名称和类型不能为空',
        icon: 'none'
      })
    };
    self.showLoading();
    let url = '/competition/information/add';
    http.get(url,{information,type}).then(function(data){
      self.hideLoading();
      if (data.data.status != 200) {
        wx.showToast({
          title: data.data.status + data.data.message,
          icon: 'none',
          duration: 3000
        })
      }else{
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        // console.log(prevPage);
        let {info,infoName} = prevPage.data;
        console.log(info);
        info.push(data.data.message.id);
        infoName.push(data.data.message);
        prevPage.setData({
          info,
          infoName
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  showLoading: function () {
    this.setData({
      isHidden: false
    });
    wx.showLoading({
      title: "提交中",
      mask: true
    });
  },
  hideLoading: function () {
    this.setData({
      isHidden: true
    });
    wx.hideLoading();
  },
  bindDate: function (e) {
    console.log(e);
    let key = e.currentTarget.dataset.key;
    let value = e.detail
    this.setData({
      [key]: value
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