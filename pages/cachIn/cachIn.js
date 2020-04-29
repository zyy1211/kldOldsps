let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    minAge:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindDate:function(e){
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    if (key == 'money') {
      value = this.validateFixed(value);
    }
    this.setData({
      [key]:value
    })
  },

  validateFixed(val) {
    let value;
    value = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g, ""); //验证第一个字符是数字
    value = value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    return value;
  },

  toCachIn:function(){
    let { money,name } = this.data;
    if(money < 1 ){
      return wx.showToast({
        title: '最小提现金额为1元',
        icon: 'none'
      })
    }
    http.post('/activities/withdrawal',{money,name}).then(function(res){
      console.log(res);
      if(res.status == 200){

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