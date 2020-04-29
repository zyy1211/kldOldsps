let util = require('../../../utils/util');
let http = require('../../../utils/request');
let API = require('../../../utils/config.js');
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFlag: false,
    api:API.img_host
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let id = options.id;
    if(options.scene){
      let scene = decodeURIComponent(options.scene);
      id = scene;
    }
    self.setData({id});
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    App.getToken(function (res) {
      let user = App.getUserInfo();
      let userId = '';
      if (!App.isNull(user)) {
        userId = user.id;
      }
      self.setData({userId});
      self.getDetail();
    })
  },

  editGame:function(e){
    let id = this.data.id;
    wx.navigateTo({
      url: '../g_issue/g_issue?id=' + id + '&able=1',
    })
  },

  getDetail: function () {
    let self = this;
    let {
      id
    } = this.data;
    http.get('/competition/queryCompetitionById', {
      id
    }).then(function (res) {
      // console.log(res);
      let competition = res.data.message.competition;
      let registrationDeadlineName = '';
      let listPublicityTimeName = '';
      let drawTimeName = '';
      let drawPublicityTimeName = '';
      // let beginTimeName = util.formatStamp(competition.beginTime).time;
      // let endTimeName = util.formatStamp(competition.endTime).time;
      let cancelTimeName = '';
      if(!App.isNull(competition.registrationDeadline)){
        registrationDeadlineName = util.formatStamp(competition.registrationDeadline).time
      }

      if(!App.isNull(competition.listPublicityTime)){
        listPublicityTimeName = util.formatStamp(competition.listPublicityTime).time;
      }
      if(!App.isNull(competition.drawTime)){
        drawTimeName = util.formatStamp(competition.drawTime).time;
      }
      if(!App.isNull(competition.drawPublicityTime)){
        drawPublicityTimeName = util.formatStamp(competition.drawPublicityTime).time;
      }
      if(!App.isNull(competition.cancelTime)){
        cancelTimeName = util.formatStamp(competition.cancelTime).time;
      }
      
      let setime = (util.timeSlot(competition.beginTime,competition.endTime))
      // console.log(setime)
      self.setData({
        competition: {
          ...res.data.message.competition,
          registrationDeadlineName,
          listPublicityTimeName,
          drawTimeName,
          drawPublicityTimeName,
          // beginTimeName,
          // endTimeName,
          cancelTimeName,
          setime
        },
        images: res.data.message.images
      })
    })
  },
  cancelGame:function(){
    let self = this;
    http.get('/competition/cancel',{cid:self.data.id}).then(function(res){
      if(res.data.status == 200){
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  openMap: function (t) {
    let longitude = this.data.competition.longitude;
    let latitude = this.data.competition.latitude;
    this.selectComponent("#authorize").getAuthorizeLocation(function (t) {
      wx.openLocation({
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude)
      });
    });
  },
  // 切换遮罩层
  tapmMask: function () {
    this.setData({
      isFlag: !this.data.isFlag
    })
  },
  toDetail:function(){
    let cid = this.data.id;
    let name = this.data.competition.name;
    wx.navigateTo({
      url: '../gamePageList/gamePageList?cid=' + cid + '&name=' + name,
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
    this.getDetail();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 300);
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
    let self = this;
    // console.log(self.data.id)
    return {
      title: '栎刻动体育赛事',
      path: '/gamePages/pages/gameDetail/gameDetail?id=' + self.data.id
    }
  },
})