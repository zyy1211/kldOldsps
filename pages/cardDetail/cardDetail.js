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
    detail: {},
    option1: [],
    option2: [],
    option3: [],
    value1: 0,
    weekaend: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    dayTime: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let {
      id,
      name,
      sid,
      type,
      useDate,
      useTime,
      sportType
    } = options;
    let {
      weekaend,
      dayTime
    } = this.data;
    this.setData({
      id,
      name,
      sid,
      type,
      useDate,
      useTime,
      sportType
    })
    this.getDetail();
    if (type == '固定场次卡') {

      let weekStart = weekaend.indexOf(useDate.split('~')[0]);
      let weekEnd = weekaend.indexOf(useDate.split('~')[1]);
      let timeStart = dayTime.indexOf(useTime.split('-')[0]);
      let timeEnd = dayTime.indexOf(useTime.split('-')[1]);

      let optionWeek = weekaend.slice(weekStart, weekEnd + 1);
      let optionTime = dayTime.slice(timeStart, timeEnd + 1);
      let option2 = optionWeek.map(item => {
        let obj = {text: item,value: item}
        return obj;
      })
      let option3 = [];
      for (let i = optionTime.length - 1; i > 0; i--) {
        let obj = {
          text: optionTime[i - 1] + '~' + optionTime[i],
          value: optionTime[i - 1] + '-' + optionTime[i],
        }
        option3.push(obj)
      }
      option3.reverse();
      this.setData({
        option2,
        option3,
        week: option2[0].value,
        time: option3[0].value
      })
      this.getfixed();
    }
    this.getInfo();
  },

  getInfo:function(){
    let self = this;
    http.get('/card/applyCardUserInfo').then(function(res){
      console.log(res)
      let message = res.data.message;
      if(res.data.status != 200 || app.isNull(message)){
        return;
      }
      let {idNum,userName,userPhone:phone } = message;
      self.setData({
        idNum,userName,phone
      })
    })
  },

  tabsChange: function(e) {
    let self = this;
    let key = e.currentTarget.dataset.key;
    self.setData({
      [key]: e.detail
    });
  },

  getDetail: function (res) {
    let self = this;
    let {
      id
    } = this.data;
    http.get('/card/detail/' + id, '').then(function (res) {
      // console.log(res);
      let message = res.data.message;
      if (res.data.status == 200) {
        if (message.effectiveType == 1) {
          message['expirationStart'] = util.formatStamp(message.expirationStartDate).date;
          message['expirationEnd'] = util.formatStamp(message.expirationEndDate).date;
        }
        self.setData({
          detail: message
        })
      }
    })
  },
  getfixed: function () {
    let self = this;
    let {
      sid,
      sportType
    } = this.data;
    http.get('/stadium/getBoutsBySid', {
      sid,
      type: sportType
    }).then(function (res) {
      console.log(res);
      let message = res.data.message;
      message.forEach(item => {
        item['text'] = item.bName;
        item['value'] = item.id;
      })
      self.setData({
        option1: message,
        boutId: message[0].value,
      })
    })
  },
  submit: function (res) {
    let self = this;
    let {
      userName,
      idNum,
      phone,
      boutId,
      week,
      time,
      type
    } = this.data;
    let cardId = this.data.id;
    let params = {
      userName,
      idNum,
      phone,
      cardId
    }
    if (type == '固定场次卡') {
      params = {
        userName,
        idNum,
        phone,
        boutId,
        week,
        time,
        cardId
      }
    }
    console.log(params)
    http.post('/card/pay', params, 1).then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        self.wxPay(res.data.message)
      }
    })
  },
  //微信支付
  wxPay: function (data) {
    var that = this;
    console.log(data);
    let {
      timeStamp,
      paySign,
      orderId,
      appId,
      signType,
      nonceStr
    } = data;
    let package1 = data.package;
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: package1,
      signType: signType,
      paySign: paySign,
      success(res) {
        that.paySuccess(orderId);
      },
      fail(res) {
        wx.showToast({
          title: '订单未支付',
          icon: 'none',
          duration: 1000
        });
      },
    })
  },

  paySuccess:function(orderId){
    http.get('/card/paySuccess',{orderId}).then(function(res){
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      })
    })
  },

  bindDate: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    if (key == 'phone') {
      value = this.validateNumber(value);
      this.setData({
        [key]: value
      })
      return;
    }
    this.setData({
      [key]: value
    })
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
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