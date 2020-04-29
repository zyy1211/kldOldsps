let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames:['']
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    let self = this;
    let sid = options.sid;
    let type = options.type
    let name = options.name
    //  sid = 25;
    //  type = '固定场次卡';
    //  name = '不知道';v
     self.setData({
      sid,
      type,
      name
    })
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    app.getToken(function (res) {
      self.getList();
    })
    
  },
  toCardDetail:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let useDate = e.currentTarget.dataset.usedate;
    let useTime = e.currentTarget.dataset.usetime;
    let sportType = e.currentTarget.dataset.sporttype;
    console.log(sportType)
    let {sid,type} = this.data;
    wx.navigateTo({
      url: '../cardDetail/cardDetail?id=' + id +'&name='+name +'&sid=' + sid + '&type=' + type + '&useDate=' + useDate + '&useTime=' + useTime + '&sportType=' + sportType
    })
  },

  getList: function () {
    let self = this;
    let {
      sid,
      type
    } = this.data;

    http.get('/card/stadiumCards', {
      sid,
      type
    }).then(function (res) {
      console.log(res);
      let cardList = res.data.message;
      cardList.forEach(item =>{
        if(item.effectiveType == 1){
          item['expirationStart'] =  util.formatStamp(item.expirationStartDate).date;
          item['expirationEnd'] =  util.formatStamp(item.expirationEndDate).date;
        }
      })
      self.setData({
        cardList: cardList
      })
    })
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