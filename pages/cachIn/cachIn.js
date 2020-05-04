let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    suucess:API.cvs_img + '/20200430/46168b07a26d743f1ce41e4a65133799.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.beTotal)
    this.setData({
      beTotal: options.beTotal
    })
    console.log(this.data.beTotal)
  },
  bindDate: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    if (key == 'money') {
      value = this.validateFixed(value);
    }
    this.setData({
      [key]: value
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

  toCachIn: function () {
    let self = this;
    let {
      money,
      name,
      beTotal
    } = this.data;
    if (app.isNull(money) || money < 1) {
      return wx.showToast({
        title: '最小提现金额为1元',
        icon: 'none'
      })
    }
    if(parseFloat(money) > parseFloat(beTotal)){
      return wx.showToast({
        title: '提现金额不能超过账户金额',
        icon: 'none'
      })
    }
    if (app.isNull(name)) {
      return wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
    }

    http.post('/activities/withdrawal', {
      money,
      name
    }).then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        self.setData({show:true})
      }
    })
  },

  onConfirm:function(){
    console.log('fsfs')
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
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