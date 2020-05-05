let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [],
    cardUrl: API.cvs_img + '/20200427/fc732e50c8952077a2df437bdc8b4581.png',
    activitiesList: [],
    beTotal: '',
    total: '',
    api: API.img_host,
    stickyId:''
  },
  onScroll(e){
    console.log(e)

  },
  onChange(event) {
    // console.log(event)
    let ids = event.currentTarget.dataset.ids;
    let key = 'activitiesList[' + ids + '].activity';
    let activity = this.data.activitiesList[ids].activity;
    this.setData({
      activeNames: event.detail,
      [key]:!activity
    });
  },
  conceCach: function () {
    let beTotal = this.data.beTotal;
    wx.navigateTo({
      url: '../cachIn/cachIn?beTotal=' + beTotal,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.queryAccount();
  },
  onShow: function(){
    console.log('fsfs')
    this.queryAccount();
  },
  queryAccount: function () {
    let self = this;
    http.get('/activities/queryAccount', '').then(function (req) {
      let res = req.data;
      console.log(res)
      if (res.status == 200) {
        let activitiesList = [];
        if(!app.isNull(res.message.activitiesList)){
          activitiesList = res.message.activitiesList;
        }
        activitiesList.forEach(item =>{
          item['activity'] = false;
          item['Time'] = (util.timeSlot(item.startTime, item.endTime))
        })
        activitiesList = activitiesList.sort(function(a,b){
          return b.startTime - a.startTime
        })

        self.setData({
          activitiesList:activitiesList,
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