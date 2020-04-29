let http = require('../../../utils/request.js');
let API = require('../../../utils/config.js');
let App = getApp();
let util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.cid);
    this.setData({
      cid:options.cid,
      name:options.name
    });
    wx.setNavigationBarTitle({
      title: options.name + '赛事列表'
    })
  },
  onShow: function () {
    this.getListData();
  },
  getListData: function (isConcat) {
    let self = this;
    let {cid} = this.data;
    http.get('/competition/queryEventsByCid',{cid}).then(function(res){
      // console.log(res)
      let { singleEvents,teamEvents } = res.data.message;
      self.setData({singleEvents,teamEvents});
    })
  },
  
  // 详情
  toDetail: function (e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let edits = e.currentTarget.dataset.edits;
    let eventType = e.currentTarget.dataset.eventtype;
    let eventName = e.currentTarget.dataset.eventname;
    let minAge = e.currentTarget.dataset.minage;
    let maxAge = e.currentTarget.dataset.maxage;
    // console.log({eventType,minAge,maxAge})
    App.setGameType({eventType,minAge,maxAge,eventName});
    let url = '';
    if(type == 1){
      url = '../applySingle/applySingle?id='
    }else{
      url = '../applyTeam/applyTeam?id='
    }

    wx.navigateTo({
      url: url + id + '&type=' + type + '&edits=' + edits
    })

  },




  /**
   * 生命周期函数--监听页面显示
   */


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
    this.getListData();
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
    return {
      title: '栎刻动体育赛事',
      path: '/gamePages/pages/gamePageList/gamePageList?cid=' + self.data.cid + '&name=' + self.data.name
    }
  }
})