let http = require('../../utils/request.js');
let API = require('../../utils/config.js');
let App = getApp();
let util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    total: 0,
    active: "0",
    pageNum: 1,
    pageSize: 10,
    img_host: API.img_host,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData(0);
  },
  onPullDownRefresh: function () {
    this.reloadPage();
  },
  reloadPage: function () {
    this.setData({
      pageNum: 1,
    });
    this.getListData(0);
  },
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    App.isToDetail(function(){
      wx.navigateTo({
        url: '../activityDetail/activityDetail?id=' + id,
      })
    })
  },
  getListData: function (isConcat) {
    let self = this;
    let { pageNum,pageSize } = this.data
    http.get('/activities/queryActivityCreatorBySelf', { pageNum,pageSize }).then(function (data) {
      // console.log(data);
      wx.stopPullDownRefresh();
      if (data.data.status != 200) {
        data.data.message = {
          records: []
        };
      }
      if (data.data.message == null) {
        data.data.message = {
          records: []
        }
      }
      let records = data.data.message.records;
      records.forEach((item,index,arr) =>{
        item.setime = (util.timeSlot(item.activityStartTime,item.activityEndTime))
      })
      let dataList;
      if (isConcat == 0) {
        dataList = records;
      } else {
        dataList = self.data.dataList.concat(records);
      }
      self.setData({
        dataList: dataList,
        total: data.data.message.total
      });
    })
  },
  onReachBottom: function () {
    console.log('触底');
    if (this.data.dataList.length == this.data.total) {
      return;
    }
    let pageNum = (this.data.pageNum) + 1;
    this.setData({
      pageNum: pageNum
    });
    this.getListData();
  },
  tabsChange: function (e) {
    console.log(e.currentTarget.dataset.key);
    this.setData({
      active: e.currentTarget.dataset.key
    })
  },
  signByIds:function(e){
    let self = this;
    let uid = e.currentTarget.dataset.uid;
    let activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../signIn/signIn?self=true&activityId=' + activityId + "&uid=" + uid
    })
  },
  toIssue:function(e){
    let self = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../issue/issue?draft=true&id=' + id
    })
  }

})