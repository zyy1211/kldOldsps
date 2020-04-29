let http = require('../../utils/request.js');
let API = require('../../utils/config.js');
let App = getApp();
let util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 0,
    dataList: [],
    total: 0,
    active: "0",
    pageNum: 1,
    pageSize: 10,
    img_host: API.img_host,
    url:'/stadium/queryOrderByUid',
    orderStatus:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData(0);
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.reloadPage();
  },
  reloadPage: function () {
    this.setData({
      pageNum: 1,
      total:0,
    });
    this.getListData(0);
  },

  toDetail: function (e) {
    let sceneId = e.currentTarget.dataset.sceneid;
    console.log(e.currentTarget.dataset.sceneid)
    console.log(e.currentTarget.dataset.sceneId)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?sceneId=' + sceneId,
    })
  },

  getListData: function (isConcat) {
    let self = this;
    let { pageNum,pageSize,url,orderStatus } = this.data;
    console.log(url)
    http.get(url, { pageNum,pageSize,orderStatus }).then(function (data) {
      console.log(data);
      if (data.data.status != 200) {
        data.data.message = {
          records:[]
        };
      }
      if (data.data.message == null) {
        data.data.message =  {
          records:[]
        };
      }
      let records = data.data.message.records;
      // records.["createTimeFormat"] = util.formatStamp(records.scene?.createTime);
      // records.forEach((item,index,arr) =>{
      //   item.setime = (util.timeSlot(item.activityStartTime,item.activityEndTime))
      // })
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
  onChange(event) {
    let tabActive = event.detail.index;
    let orderStatus = tabActive - 1;
    console.log(tabActive);
    this.setData({
      tabActive:tabActive,
      orderStatus:orderStatus,
      pageNum: 1,
      total:0,
    })
    this.getListData(0);
  }
})